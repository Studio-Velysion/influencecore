import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import crypto from 'crypto'

function base64UrlEncode(input: string) {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlEncodeBytes(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function signToken(payload: any, secret: string) {
  const body = base64UrlEncode(JSON.stringify(payload))
  const sig = crypto.createHmac('sha256', secret).update(body).digest()
  return `${body}.${base64UrlEncodeBytes(sig)}`
}

function getSafeNextPath(nextParam: string | null) {
  if (!nextParam) return '/billing'
  const trimmed = nextParam.trim()
  if (!trimmed.startsWith('/')) return '/billing'
  return trimmed
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    const next = getSafeNextPath(req.nextUrl.searchParams.get('next'))
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, req.url))
  }

  const secret = process.env.INFLUENCECORE_INTERNAL_KEY
  if (!secret) {
    return new NextResponse('INFLUENCECORE_INTERNAL_KEY manquant', { status: 503 })
  }

  const next = getSafeNextPath(req.nextUrl.searchParams.get('next'))

  const roles = Array.isArray((session.user as any).roles) ? (session.user as any).roles : []
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    email: String(session.user.email).trim().toLowerCase(),
    name: (session.user.name ? String(session.user.name) : '') || 'InfluenceCore',
    roles: roles.map(String),
    iat: now,
    exp: now + 60, // 60s de validité
  }

  const token = signToken(payload, secret)

  const target = new URL(`/billing/sso/influencecore`, req.url)
  target.searchParams.set('token', token)
  target.searchParams.set('next', next)

  return NextResponse.redirect(target)
}


