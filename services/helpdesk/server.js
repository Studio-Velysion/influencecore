import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifyStatic from '@fastify/static'
import { Issuer } from 'openid-client'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT || 8000)
const HOST = process.env.HOST || '0.0.0.0'

const HELP_DESK_BASE_PATH = '/helpdesk'
const SESSION_COOKIE = 'hd_session'

function getPublicBaseUrl(req) {
  // Prefer explicit public URL (needed behind reverse proxy)
  if (process.env.HELPDESK_PUBLIC_URL) return process.env.HELPDESK_PUBLIC_URL.replace(/\/$/, '')

  const proto = (req.headers['x-forwarded-proto'] || 'http').toString().split(',')[0].trim()
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().split(',')[0].trim()
  return `${proto}://${host}`
}

function getRedirectTarget(req) {
  const rt = req.query?.['redirect-to']
  if (typeof rt === 'string' && rt.startsWith('/')) return rt
  return HELP_DESK_BASE_PATH
}

function parseSession(req) {
  const raw = req.cookies?.[SESSION_COOKIE]
  if (!raw || typeof raw !== 'string') return null
  try {
    const json = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
    if (!json || typeof json !== 'object') return null
    return json
  } catch {
    return null
  }
}

function setSession(reply, session) {
  const value = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url')
  const secure = (process.env.NODE_ENV === 'production')
  reply.setCookie(SESSION_COOKIE, value, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure,
  })
  // Frappe UI expects a readable cookie `user_id` (non httpOnly)
  reply.setCookie('user_id', session?.user_id || 'Guest', {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure,
  })
}

function clearSession(reply) {
  reply.clearCookie(SESSION_COOKIE, { path: '/' })
  reply.setCookie('user_id', 'Guest', { path: '/', httpOnly: false, sameSite: 'lax' })
}

async function buildOidcClient() {
  const issuerUrl = process.env.KEYCLOAK_ISSUER
  const clientId = process.env.KEYCLOAK_CLIENT_ID
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET
  if (!issuerUrl || !clientId) return null

  const issuer = await Issuer.discover(issuerUrl)
  const client = new issuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    response_types: ['code'],
  })
  return client
}

const app = Fastify({ logger: true })
await app.register(cookie)

// Serve the built Helpdesk desk UI under /helpdesk/*
// In Docker we bundle it under /app/helpdesk-develop/desk/dist
const deskDist = path.join(__dirname, 'helpdesk-develop', 'desk', 'dist')
await app.register(fastifyStatic, {
  root: deskDist,
  prefix: `${HELP_DESK_BASE_PATH}/`,
  decorateReply: false,
})

// Basic login endpoint -> Keycloak OIDC auth
app.get(`${HELP_DESK_BASE_PATH}/login`, async (req, reply) => {
  const oidc = await buildOidcClient()
  if (!oidc) {
    return reply.code(500).type('text/plain').send('Keycloak OIDC non configuré (KEYCLOAK_ISSUER / KEYCLOAK_CLIENT_ID).')
  }

  const publicBase = getPublicBaseUrl(req)
  const redirectUri = `${publicBase}${HELP_DESK_BASE_PATH}/oauth/callback`
  const state = Buffer.from(JSON.stringify({ rt: getRedirectTarget(req), t: Date.now() }), 'utf8').toString('base64url')

  const authorizationUrl = oidc.authorizationUrl({
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
  })
  return reply.redirect(authorizationUrl)
})

app.get(`${HELP_DESK_BASE_PATH}/oauth/callback`, async (req, reply) => {
  const oidc = await buildOidcClient()
  if (!oidc) return reply.code(500).send('OIDC non configuré')

  const publicBase = getPublicBaseUrl(req)
  const redirectUri = `${publicBase}${HELP_DESK_BASE_PATH}/oauth/callback`
  const params = oidc.callbackParams(req.raw)
  const tokenSet = await oidc.callback(redirectUri, params, { state: params.state })

  const claims = tokenSet.claims()
  const roles = Array.isArray(claims?.realm_access?.roles) ? claims.realm_access.roles : []

  let rt = HELP_DESK_BASE_PATH
  try {
    const stateJson = JSON.parse(Buffer.from(params.state, 'base64url').toString('utf8'))
    if (stateJson?.rt && typeof stateJson.rt === 'string' && stateJson.rt.startsWith('/')) rt = stateJson.rt
  } catch {
    // ignore
  }

  setSession(reply, {
    user_id: claims?.email || claims?.preferred_username || claims?.sub || 'user',
    email: claims?.email || null,
    name: claims?.name || claims?.preferred_username || null,
    given_name: claims?.given_name || null,
    picture: claims?.picture || null,
    roles,
    iat: Date.now(),
  })

  return reply.redirect(rt)
})

// Frappe-style API: /api/method/<methodName>
async function handleMethod(req, reply, methodName) {
  const session = parseSession(req)
  const isLoggedIn = Boolean(session && session.user_id && session.user_id !== 'Guest')

  // Helper to mimic Frappe responses
  const ok = (message) => reply.send({ message })

  switch (methodName) {
    case 'logout': {
      clearSession(reply)
      return ok(true)
    }
    case 'login': {
      // In this fork, login is handled via /login (Keycloak redirect).
      return reply.code(403).send({ message: 'Utilise /login (SSO Keycloak) pour te connecter.' })
    }
    case 'helpdesk.api.auth.get_user': {
      if (!isLoggedIn) {
        return ok({
          has_desk_access: false,
          is_admin: false,
          is_agent: false,
          user_id: 'Guest',
          is_manager: false,
          user_image: null,
          user_first_name: null,
          user_name: null,
          username: 'Guest',
          time_zone: 'UTC',
          language: 'fr',
        })
      }

      const roles = Array.isArray(session.roles) ? session.roles : []
      const isAdmin = roles.includes('admin') || roles.includes('staff')
      const isAgent = isAdmin || roles.includes('support')
      const isManager = roles.includes('support') || roles.includes('staff')

      return ok({
        has_desk_access: isAgent,
        is_admin: isAdmin,
        is_agent: isAgent,
        user_id: session.user_id,
        is_manager: isManager,
        user_image: session.picture || null,
        user_first_name: session.given_name || null,
        user_name: session.name || null,
        username: session.email || session.user_id,
        time_zone: 'UTC',
        language: 'fr',
      })
    }
    case 'helpdesk.api.config.get_config': {
      // Keep same keys as the UI expects (values are strings "0"/"1" like Frappe)
      return ok({
        brand_name: process.env.HELPDESK_BRAND_NAME || 'Helpdesk',
        brand_logo: process.env.HELPDESK_BRAND_LOGO || '',
        favicon: process.env.HELPDESK_FAVICON || '',
        restrict_tickets_by_agent_group: '0',
        assign_within_team: '0',
        skip_email_workflow: '1',
        prefer_knowledge_base: '0',
        is_feedback_mandatory: '0',
      })
    }
    case 'helpdesk.api.general.get_translations': {
      // Minimal: return empty dict -> UI falls back to original strings
      return ok({})
    }
    case 'helpdesk.api.telemetry.get_posthog_settings': {
      return ok({ enabled: false })
    }
    case 'helpdesk.www.helpdesk.index.get_context_for_dev': {
      return ok({
        default_route: HELP_DESK_BASE_PATH,
        site_name: 'helpdesk',
        read_only_mode: false,
        csrf_token: 'csrf-disabled',
        setup_complete: 1,
        is_fc_site: false,
        session_user: isLoggedIn ? session.user_id : 'Guest',
        date_format: 'dd-mm-yyyy',
        time_format: 'HH:mm',
      })
    }
    case 'frappe.apps.get_apps': {
      return ok([
        {
          name: 'helpdesk',
          title: 'Helpdesk',
          logo: '/helpdesk/desk.png',
          route: '/helpdesk',
        },
      ])
    }
    // --- Minimal stubs to keep the Desk UI usable (returns empty data instead of crashing) ---
    case 'helpdesk.api.session.get_users': {
      return ok([])
    }
    case 'helpdesk.api.dashboard.get_dashboard_data': {
      return ok({
        number_cards: [],
        master_data: [],
        trend_data: [],
      })
    }
    case 'helpdesk.api.search.search': {
      return ok({ results: [] })
    }
    case 'helpdesk.api.search.get_filter_options': {
      return ok([])
    }
    case 'helpdesk.api.knowledge_base.get_general_category': {
      return ok(null)
    }
    case 'helpdesk.api.knowledge_base.get_categories': {
      return ok([])
    }
    case 'helpdesk.api.knowledge_base.get_category_title': {
      return ok('')
    }
    case 'helpdesk.api.knowledge_base.get_category_articles': {
      return ok([])
    }
    case 'helpdesk.api.knowledge_base.get_article': {
      return ok(null)
    }
    case 'helpdesk.api.article.search': {
      return ok([])
    }
    case 'helpdesk.api.contact.search_contacts': {
      return ok([])
    }
    case 'helpdesk.api.doc.get_list_data': {
      return ok({ data: [], total_count: 0 })
    }
    case 'helpdesk.api.doc.get_filterable_fields': {
      return ok([])
    }
    case 'helpdesk.api.doc.sort_options': {
      return ok([])
    }
    case 'helpdesk.api.doc.get_quick_filters': {
      return ok([])
    }
    case 'helpdesk.api.agent.sent_invites': {
      return ok([])
    }
    case 'helpdesk.api.doc.remove_assignments': {
      return ok(true)
    }
    default: {
      // Generic stub: keep UI running while we progressively implement endpoints
      return ok({ __unimplemented__: true, method: methodName })
    }
  }
}

app.get('/api/method/*', async (req, reply) => {
  const methodName = req.params['*']
  return await handleMethod(req, reply, methodName)
})

app.post('/api/method/*', async (req, reply) => {
  const methodName = req.params['*']
  return await handleMethod(req, reply, methodName)
})

// SPA fallback: /helpdesk -> index.html
app.get(`${HELP_DESK_BASE_PATH}`, async (req, reply) => {
  return reply.sendFile('index.html', deskDist)
})
app.get(`${HELP_DESK_BASE_PATH}/*`, async (req, reply) => {
  // If static file not found, serve SPA
  return reply.sendFile('index.html', deskDist)
})

await app.listen({ port: PORT, host: HOST })


