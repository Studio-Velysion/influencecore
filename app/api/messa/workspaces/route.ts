import { NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'
import { postizFetch, postizJson } from '@/lib/messa/postiz'

async function requirePermission(permission: keyof typeof PERMISSIONS) {
  const session = await getServerSessionWithTest()
  if (!session?.user?.id) {
    throw Object.assign(new Error('Non authentifié'), { status: 401 })
  }
  const ok = await checkPermission(PERMISSIONS[permission])
  if (!ok) {
    throw Object.assign(new Error('Accès refusé'), { status: 403 })
  }
}

export async function GET() {
  try {
    await requirePermission('MESSA_WORKSPACES_VIEW')
    const res = await postizFetch('/workspaces', { method: 'GET' })
    const data = await postizJson(res)
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Erreur' },
      { status: e?.status ?? 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await requirePermission('MESSA_WORKSPACES_VIEW')
    const body = await req.json()
    const res = await postizFetch('/workspaces', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    const data = await postizJson(res)
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Erreur' },
      { status: e?.status ?? 500 }
    )
  }
}


