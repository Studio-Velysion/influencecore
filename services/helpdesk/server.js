import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifyStatic from '@fastify/static'
import { Issuer } from 'openid-client'
import pg from 'pg'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT || 8000)
const HOST = process.env.HOST || '0.0.0.0'

const HELP_DESK_BASE_PATH = '/helpdesk'
const SESSION_COOKIE = 'hd_session'

const { Pool } = pg
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null

function getPublicBaseUrl(req) {
  // Prefer explicit public URL (needed behind reverse proxy)
  if (process.env.HELPDESK_PUBLIC_URL) return process.env.HELPDESK_PUBLIC_URL.replace(/\/$/, '')

  const proto = (req.headers['x-forwarded-proto'] || 'http').toString().split(',')[0].trim()
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().split(',')[0].trim()
  return `${proto}://${host}`
}

async function dbExec(sql, params = []) {
  if (!pool) throw new Error('DATABASE_URL non défini pour Helpdesk')
  return await pool.query(sql, params)
}

async function ensureSchema() {
  if (!pool) return

  await dbExec(`
    create table if not exists hd_ticket_status (
      name text primary key,
      label_agent text not null,
      label_customer text,
      different_view int not null default 0,
      category text not null,
      "order" int not null default 0,
      color text not null default 'Gray',
      enabled int not null default 1,
      creation timestamptz not null default now(),
      modified timestamptz not null default now(),
      owner text not null default 'system',
      modified_by text not null default 'system'
    );
  `)

  await dbExec(`
    create table if not exists hd_ticket_template (
      name text primary key,
      description_template text,
      fields jsonb not null default '[]'::jsonb,
      creation timestamptz not null default now(),
      modified timestamptz not null default now(),
      owner text not null default 'system',
      modified_by text not null default 'system'
    );
  `)

  await dbExec(`
    create table if not exists hd_ticket (
      name text primary key,
      subject text not null,
      description text,
      status text not null,
      template text,
      via_customer_portal int not null default 0,
      owner text not null,
      modified_by text not null,
      creation timestamptz not null default now(),
      modified timestamptz not null default now(),
      data jsonb not null default '{}'::jsonb
    );
  `)

  await dbExec(`
    create table if not exists hd_ticket_seen (
      ticket_name text not null references hd_ticket(name) on delete cascade,
      user_id text not null,
      seen_at timestamptz not null default now(),
      primary key (ticket_name, user_id)
    );
  `)

  // Knowledge Base
  await dbExec(`
    create table if not exists hd_kb_category (
      name text primary key,
      title text not null,
      is_general int not null default 0,
      creation timestamptz not null default now(),
      modified timestamptz not null default now(),
      owner text not null default 'system',
      modified_by text not null default 'system'
    );
  `)

  await dbExec(`
    create table if not exists hd_kb_article (
      name text primary key,
      title text not null,
      content text not null,
      status text not null default 'Published',
      category text references hd_kb_category(name) on delete set null,
      views int not null default 0,
      feedback jsonb not null default '{}'::jsonb,
      creation timestamptz not null default now(),
      modified timestamptz not null default now(),
      owner text not null,
      modified_by text not null
    );
  `)

  // Seed statuses (idempotent)
  const statuses = [
    { name: 'Open', label_agent: 'Open', label_customer: 'Open', category: 'Open', order: 1, color: 'Blue' },
    { name: 'In Progress', label_agent: 'In Progress', label_customer: 'In Progress', category: 'Open', order: 2, color: 'Amber' },
    { name: 'Resolved', label_agent: 'Resolved', label_customer: 'Resolved', category: 'Resolved', order: 99, color: 'Green' },
  ]
  for (const s of statuses) {
    await dbExec(
      `insert into hd_ticket_status (name, label_agent, label_customer, category, "order", color, enabled, different_view)
       values ($1,$2,$3,$4,$5,$6,1,0)
       on conflict (name) do update set
         label_agent=excluded.label_agent,
         label_customer=excluded.label_customer,
         category=excluded.category,
         "order"=excluded."order",
         color=excluded.color,
         enabled=1,
         modified=now()`,
      [s.name, s.label_agent, s.label_customer, s.category, s.order, s.color]
    )
  }

  // Seed default template (idempotent)
  await dbExec(
    `insert into hd_ticket_template (name, description_template, fields)
     values ($1, $2, $3::jsonb)
     on conflict (name) do nothing`,
    ['Default', '', '[]']
  )

  // Seed general category (idempotent)
  await dbExec(
    `insert into hd_kb_category (name, title, is_general)
     values ($1,$2,1)
     on conflict (name) do update set title=excluded.title, is_general=1, modified=now()`,
    ['general', 'General']
  )
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
await ensureSchema().catch((e) => {
  app.log.error({ err: e }, 'Helpdesk DB schema init failed')
  process.exit(1)
})

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
    // --- Frappe client APIs used by frappe-ui resources ---
    case 'frappe.client.get_list': {
      const doctype = req.body?.doctype || req.query?.doctype
      const fields = req.body?.fields || req.query?.fields || []
      const limit = Number(req.body?.limit || req.query?.limit || 20)
      const orderBy = (req.body?.order_by || req.query?.order_by || '').toString()

      if (doctype === 'HD Ticket Status') {
        const res = await dbExec(
          `select name, label_agent, label_customer, different_view, category, "order", color, enabled,
                  to_char(creation at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as creation,
                  to_char(modified at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as modified,
                  owner, modified_by
           from hd_ticket_status
           where enabled=1
           order by "order" asc
           limit $1`,
          [limit]
        )
        return ok(res.rows)
      }

      if (doctype === 'HD Ticket') {
        const sort = orderBy.includes('modified') ? 'modified desc' : 'creation desc'
        const res = await dbExec(
          `select name, subject, status,
                  to_char(creation at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as creation,
                  to_char(modified at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as modified,
                  owner, modified_by
           from hd_ticket
           order by ${sort}
           limit $1`,
          [limit]
        )
        // Pick only requested fields if provided
        if (Array.isArray(fields) && fields.length) {
          return ok(res.rows.map((r) => {
            const out = { name: r.name }
            for (const f of fields) out[f] = r[f]
            // base doc fields
            out.creation = r.creation; out.modified = r.modified; out.owner = r.owner; out.modified_by = r.modified_by
            return out
          }))
        }
        return ok(res.rows)
      }

      return ok([])
    }
    case 'frappe.client.get': {
      const doctype = req.body?.doctype || req.query?.doctype
      const name = req.body?.name || req.query?.name
      if (doctype === 'HD Ticket') {
        const res = await dbExec(
          `select name, subject, description, status, template, via_customer_portal, owner, modified_by,
                  to_char(creation at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as creation,
                  to_char(modified at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as modified
           from hd_ticket where name=$1`,
          [name]
        )
        const row = res.rows[0]
        if (!row) return ok(null)
        return ok({
          ...row,
          raised_by: row.owner,
          agreement_status: '',
          is_merged: 0,
        })
      }
      return ok(null)
    }
    case 'frappe.client.insert': {
      const doc = req.body?.doc || req.query?.doc
      const doctype = doc?.doctype || req.body?.doctype || req.query?.doctype
      const session = parseSession(req)
      const owner = session?.user_id || 'system'
      if (doctype === 'HD Ticket') {
        // Generate name HD-000001 style
        const counterRes = await dbExec(`select count(*)::int as c from hd_ticket`)
        const n = (counterRes.rows[0]?.c || 0) + 1
        const name = `HD-${String(n).padStart(6, '0')}`
        await dbExec(
          `insert into hd_ticket (name, subject, description, status, template, via_customer_portal, owner, modified_by, data)
           values ($1,$2,$3,$4,$5,$6,$7,$7,$8::jsonb)`,
          [
            name,
            doc.subject || '',
            doc.description || '',
            doc.status || 'Open',
            doc.template || 'Default',
            doc.via_customer_portal ? 1 : 0,
            owner,
            JSON.stringify(doc),
          ]
        )
        return ok({ name })
      }
      if (doctype === 'HD Article') {
        const counterRes = await dbExec(`select count(*)::int as c from hd_kb_article`)
        const n = (counterRes.rows[0]?.c || 0) + 1
        const name = `KB-${String(n).padStart(6, '0')}`
        await dbExec(
          `insert into hd_kb_article (name, title, content, category, status, owner, modified_by, feedback)
           values ($1,$2,$3,$4,$5,$6,$6,'{}'::jsonb)`,
          [
            name,
            doc.title || '',
            doc.content || '',
            doc.category || 'general',
            doc.status || 'Published',
            owner,
          ]
        )
        return ok({ name })
      }
      return ok({ name: doc?.name || 'unknown' })
    }
    case 'frappe.client.set_value': {
      const doctype = req.body?.doctype
      const name = req.body?.name
      const fieldname = req.body?.fieldname
      const value = req.body?.value
      const session = parseSession(req)
      const user = session?.user_id || 'system'

      if (doctype === 'HD Ticket') {
        const allowed = new Set(['status', 'subject', 'description'])
        if (!allowed.has(fieldname)) return ok(true)
        await dbExec(
          `update hd_ticket set ${fieldname}=$1, modified=now(), modified_by=$2 where name=$3`,
          [value, user, name]
        )
        return ok(true)
      }
      if (doctype === 'HD Article') {
        const allowed = new Set(['status', 'title', 'content', 'category'])
        if (!allowed.has(fieldname)) return ok(true)
        await dbExec(
          `update hd_kb_article set ${fieldname}=$1, modified=now(), modified_by=$2 where name=$3`,
          [value, user, name]
        )
        return ok(true)
      }
      if (doctype === 'HD KB Category' || doctype === 'HD Category') {
        // Some UI paths use generic set_value for category title (we map to our table)
        if (fieldname !== 'title') return ok(true)
        await dbExec(
          `update hd_kb_category set title=$1, modified=now(), modified_by=$2 where name=$3`,
          [value, user, name]
        )
        return ok(true)
      }
      return ok(true)
    }
    case 'frappe.client.delete': {
      const doctype = req.body?.doctype
      const name = req.body?.name
      if (doctype === 'HD Ticket') {
        await dbExec(`delete from hd_ticket where name=$1`, [name])
        return ok(true)
      }
      if (doctype === 'HD Article') {
        await dbExec(`delete from hd_kb_article where name=$1`, [name])
        return ok(true)
      }
      if (doctype === 'HD KB Category' || doctype === 'HD Category') {
        await dbExec(`delete from hd_kb_category where name=$1`, [name])
        return ok(true)
      }
      return ok(true)
    }
    case 'run_doc_method': {
      // Used by createDocumentResource whitelistedMethods (eg mark_seen)
      const dt = req.body?.dt || req.body?.doctype
      const dn = req.body?.dn || req.body?.name
      const method = req.body?.method
      const session = parseSession(req)
      if (dt === 'HD Ticket' && method === 'mark_seen') {
        const user = session?.user_id || 'Guest'
        if (user !== 'Guest') {
          await dbExec(
            `insert into hd_ticket_seen (ticket_name, user_id) values ($1,$2) on conflict do nothing`,
            [dn, user]
          )
        }
        return ok(true)
      }
      if (dt === 'HD Article' && method === 'set_feedback') {
        const user = session?.user_id || 'Guest'
        const val = req.body?.args?.value
        // Store a very small feedback record { user_id: value }
        if (user !== 'Guest' && (val === 'up' || val === 'down')) {
          await dbExec(
            `update hd_kb_article
             set feedback = jsonb_set(coalesce(feedback,'{}'::jsonb), $1::text[], to_jsonb($2::text), true),
                 modified=now()
             where name=$3`,
            [[user], val, dn]
          )
        }
        return ok(true)
      }
      return ok(true)
    }
    // --- Helpdesk business APIs ---
    case 'helpdesk.helpdesk.doctype.hd_ticket_template.api.get_one': {
      const name = req.body?.name || req.query?.name || 'Default'
      const res = await dbExec(
        `select name, description_template, fields,
                to_char(creation at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as creation,
                to_char(modified at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as modified,
                owner, modified_by
         from hd_ticket_template where name=$1`,
        [name]
      )
      const row = res.rows[0]
      if (!row) return ok({ name: 'Default', description_template: '', fields: [] })
      return ok({ ...row, fields: row.fields || [] })
    }
    case 'helpdesk.helpdesk.doctype.hd_ticket.api.new': {
      const doc = req.body?.doc || {}
      const session = parseSession(req)
      const owner = session?.user_id || 'system'
      const counterRes = await dbExec(`select count(*)::int as c from hd_ticket`)
      const n = (counterRes.rows[0]?.c || 0) + 1
      const name = `HD-${String(n).padStart(6, '0')}`
      await dbExec(
        `insert into hd_ticket (name, subject, description, status, template, via_customer_portal, owner, modified_by, data)
         values ($1,$2,$3,$4,$5,$6,$7,$7,$8::jsonb)`,
        [
          name,
          doc.subject || '',
          doc.description || '',
          doc.status || 'Open',
          doc.template || 'Default',
          doc.via_customer_portal ? 1 : 0,
          owner,
          JSON.stringify(doc),
        ]
      )
      return ok({ name })
    }
    case 'helpdesk.helpdesk.doctype.hd_ticket.api.get_ticket_assignees': {
      return ok(JSON.stringify([]))
    }
    case 'helpdesk.helpdesk.doctype.hd_ticket.api.get_ticket_contact': {
      return ok({})
    }
    case 'helpdesk.helpdesk.doctype.hd_ticket.api.get_recent_similar_tickets': {
      return ok([])
    }
    case 'helpdesk.helpdesk.doctype.hd_ticket.api.get_ticket_activities': {
      return ok({ activities: [] })
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
      return ok('general')
    }
    case 'helpdesk.api.knowledge_base.get_categories': {
      const res = await dbExec(
        `select name, title from hd_kb_category order by is_general desc, title asc`
      )
      // UI expects array of { label, value } in some places, and { title, name } in others.
      return ok(res.rows.map((r) => ({ label: r.title, value: r.name, name: r.name, title: r.title })))
    }
    case 'helpdesk.api.knowledge_base.get_category_title': {
      const category = (req.body?.category || req.query?.category || '').toString()
      const res = await dbExec(`select title from hd_kb_category where name=$1`, [category])
      return ok(res.rows[0]?.title || '')
    }
    case 'helpdesk.api.knowledge_base.get_category_articles': {
      const category = (req.body?.category || req.query?.category || '').toString()
      const res = await dbExec(
        `select name, title, status,
                to_char(modified at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as modified
         from hd_kb_article
         where category=$1 and status='Published'
         order by modified desc`,
        [category]
      )
      return ok(res.rows)
    }
    case 'helpdesk.api.knowledge_base.get_article': {
      const name = (req.body?.name || req.query?.name || '').toString()
      const res = await dbExec(
        `select name, title, content, status, category, feedback,
                to_char(modified at time zone 'utc','YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as modified,
                owner
         from hd_kb_article where name=$1`,
        [name]
      )
      const row = res.rows[0]
      if (!row) return ok(null)
      return ok({
        name: row.name,
        title: row.title,
        content: row.content,
        status: row.status,
        category: row.category,
        modified: row.modified,
        feedback: undefined,
        author: { name: row.owner, image: null },
      })
    }
    case 'helpdesk.api.article.search': {
      const q = (req.body?.query || req.query?.query || '').toString().trim()
      if (!q) return ok([])
      const res = await dbExec(
        `select name, title
         from hd_kb_article
         where status='Published' and (title ilike $1 or content ilike $1)
         order by modified desc
         limit 10`,
        [`%${q}%`]
      )
      return ok(res.rows)
    }
    case 'helpdesk.api.knowledge_base.create_category': {
      const title = (req.body?.title || req.query?.title || '').toString().trim()
      if (!title) return ok({ name: null })
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const name = slug || `cat-${Date.now()}`
      const session = parseSession(req)
      const user = session?.user_id || 'system'
      await dbExec(
        `insert into hd_kb_category (name, title, is_general, owner, modified_by)
         values ($1,$2,0,$3,$3)
         on conflict (name) do update set title=excluded.title, modified=now(), modified_by=$3`,
        [name, title, user]
      )
      return ok({ name })
    }
    case 'helpdesk.api.knowledge_base.increment_views': {
      const article = (req.body?.article || req.query?.article || '').toString()
      await dbExec(`update hd_kb_article set views=views+1, modified=modified where name=$1`, [article])
      return ok(true)
    }
    case 'helpdesk.api.knowledge_base.delete_articles': {
      const articles = req.body?.articles || req.query?.articles
      const list = Array.isArray(articles) ? articles : []
      if (!list.length) return ok(true)
      await dbExec(`delete from hd_kb_article where name = any($1::text[])`, [list])
      return ok(true)
    }
    case 'helpdesk.api.knowledge_base.move_to_category': {
      const category = (req.body?.category || req.query?.category || '').toString()
      const articles = req.body?.articles || req.query?.articles
      const list = Array.isArray(articles) ? articles : []
      if (!category || !list.length) return ok(true)
      await dbExec(`update hd_kb_article set category=$1, modified=now() where name = any($2::text[])`, [category, list])
      return ok(true)
    }
    case 'helpdesk.api.knowledge_base.merge_category': {
      const source = (req.body?.source || req.query?.source || '').toString()
      const target = (req.body?.target || req.query?.target || '').toString()
      if (!source || !target || source === target) return ok(true)
      await dbExec(`update hd_kb_article set category=$1 where category=$2`, [target, source])
      await dbExec(`delete from hd_kb_category where name=$1 and is_general=0`, [source])
      return ok(true)
    }
    case 'helpdesk.api.contact.search_contacts': {
      return ok([])
    }
    case 'helpdesk.api.doc.get_list_data': {
      const p = req.body || req.query || {}
      const doctype = p.doctype
      const pageLength = Number(p.page_length || 20)
      const orderBy = (p.order_by || 'modified desc').toString()

      if (doctype !== 'HD Ticket') {
        return ok({ data: [], total_count: 0, columns: [], view_type: 'list' })
      }

      const sort = orderBy.includes('modified') ? 'modified desc' : 'creation desc'
      const res = await dbExec(
        `select name, subject, status, modified
         from hd_ticket
         order by ${sort}
         limit $1`,
        [pageLength]
      )
      const count = await dbExec(`select count(*)::int as c from hd_ticket`)
      const columns = [
        { key: 'name', label: 'Name', type: 'Data' },
        { key: 'subject', label: 'Subject', type: 'Data' },
        { key: 'status', label: 'Status', type: 'Data' },
        { key: 'modified', label: 'Modified', type: 'Datetime' },
      ]
      return ok({
        data: res.rows.map((r) => ({
          ...r,
          modified: new Date(r.modified).toISOString(),
        })),
        total_count: count.rows[0]?.c || 0,
        columns,
        view_type: 'list',
      })
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


