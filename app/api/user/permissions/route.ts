import { NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth'

import { PERMISSIONS } from '@/lib/permissions'

export async function GET() {
  try {
    const session = await getServerSessionWithTest()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await getCurrentUser()
    const isAdmin = user?.isAdmin || false
    const permissions = isAdmin
      ? Object.values(PERMISSIONS)
      : Object.values(PERMISSIONS).filter((p) => !p.startsWith('admin.'))

    return NextResponse.json({
      permissions,
      isAdmin,
      userId: session.user.id,
    })
  } catch (error: any) {
    console.error('Erreur lors de la récupération des permissions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

