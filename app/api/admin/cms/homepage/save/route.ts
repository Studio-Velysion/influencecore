import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_CMS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { html, css } = await request.json()

    // TODO: Sauvegarder dans la base de données
    // Pour l'instant, on peut stocker dans un fichier ou dans une table CMS
    // Exemple avec une table CMS si elle existe :
    /*
    await prisma.cmsPage.upsert({
      where: { slug: 'homepage' },
      update: { html, css },
      create: { slug: 'homepage', html, css },
    })
    */

    // Pour l'instant, on retourne juste un succès
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

