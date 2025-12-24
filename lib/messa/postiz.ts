import { headers } from 'next/headers'

type Json = any

function getPostizConfig() {
  const baseUrl = process.env.POSTIZ_BACKEND_URL
  const internalKey = process.env.INFLUENCECORE_INTERNAL_KEY

  if (!baseUrl) {
    throw Object.assign(new Error('POSTIZ_BACKEND_URL manquant (ex: http://localhost:3100)'), { status: 503 })
  }
  if (!internalKey) {
    throw Object.assign(
      new Error('INFLUENCECORE_INTERNAL_KEY manquant (clé partagée InfluenceCore <-> Postiz backend)'),
      { status: 503 }
    )
  }

  return { baseUrl: baseUrl.replace(/\/$/, ''), internalKey }
}

export async function postizFetch(path: string, init: RequestInit = {}) {
  const { baseUrl, internalKey } = getPostizConfig()

  // Si on veut plus tard faire du multi-tenant, on pourra forward des infos user/org ici.
  const h = new Headers(init.headers)
  h.set('x-influencecore-internal-key', internalKey)
  h.set('content-type', h.get('content-type') ?? 'application/json')

  // On conserve l’UA pour debug (optionnel)
  const incoming = await headers()
  const ua = incoming.get('user-agent')
  if (ua) h.set('x-forwarded-user-agent', ua)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 7000)

  try {
    return await fetch(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
      ...init,
      headers: h,
      cache: 'no-store',
      signal: init.signal ?? controller.signal,
    })
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      throw Object.assign(new Error('Timeout: Postiz backend ne répond pas'), { status: 504 })
    }
    throw Object.assign(new Error('Postiz backend indisponible'), { status: 503, cause: e })
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function postizJson<T = Json>(res: Response): Promise<T> {
  const text = await res.text()
  try {
    return text ? (JSON.parse(text) as T) : ({} as T)
  } catch {
    // Réponse non JSON
    return { raw: text } as any
  }
}


