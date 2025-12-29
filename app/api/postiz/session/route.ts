import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { postizFetch, postizJson } from '@/lib/messa/postiz'

function getCookieDomainFromHost(host: string | null) {
  if (!host) return undefined
  const domain = host.includes(':') ? host.split(':')[0] : host
  // Pour localhost, on évite de forcer un domain (comportements variables selon navigateurs)
  if (!domain || domain === 'localhost') return undefined
  return domain
}

function getSafeNextPath(nextParam: string | null) {
  if (!nextParam) return '/social'
  const trimmed = nextParam.trim()
  // On n'autorise que des chemins relatifs same-origin
  if (!trimmed.startsWith('/')) return '/social'
  return trimmed
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    // On conserve l'intention de navigation si présente
    const next = getSafeNextPath(req.nextUrl.searchParams.get('next'))
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, req.url))
  }

  const email = String(session.user.email).trim().toLowerCase()
  const next = getSafeNextPath(req.nextUrl.searchParams.get('next'))

  const res = await postizFetch('/auth/influencecore/session', {
    method: 'POST',
    body: JSON.stringify({
      email,
      company: 'InfluenceCore',
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return new NextResponse(
      body || 'Erreur Postiz: impossible de créer une session',
      { status: res.status || 502 }
    )
  }

  const data = await postizJson<{ jwt?: string; orgId?: string }>(res)
  if (!data?.jwt || !data?.orgId) {
    return new NextResponse('Réponse Postiz invalide (jwt/orgId manquants)', { status: 502 })
  }

  const redirect = NextResponse.redirect(new URL(next, req.url))

  const cookieDomain = getCookieDomainFromHost(req.headers.get('host'))
  const isHttps = req.nextUrl.protocol === 'https:'

  // Cookie Postiz attendu par son middleware frontend + backend.
  redirect.cookies.set('auth', data.jwt, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? 'none' : 'lax',
    path: '/',
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  })
  redirect.cookies.set('showorg', data.orgId, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? 'none' : 'lax',
    path: '/',
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  })

  return redirect
}


