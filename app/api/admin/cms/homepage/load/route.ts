import { NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

export async function GET() {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_CMS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // TODO: Charger depuis la base de données
    // Pour l'instant, on retourne du contenu vide ou par défaut
    return NextResponse.json({
      html: '<div>Contenu de la page d\'accueil</div>',
      css: '',
    })
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

