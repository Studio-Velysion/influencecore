import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

export async function POST(request: NextRequest) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_CMS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const data = await request.json()
    
    // GrapesJS envoie les données de sauvegarde automatique ici
    // On peut les ignorer ou les stocker temporairement
    
    return NextResponse.json({ data: {} })
  } catch (error) {
    console.error('Erreur lors du stockage:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

