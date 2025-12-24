import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer un script spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSessionWithTest()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const script = await prisma.videoScript.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        videoIdea: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!script) {
      return NextResponse.json(
        { error: 'Script non trouvé' },
        { status: 404 }
      )
    }

    // Parser les champs JSON pour SQLite
    const parsedScript = {
      ...script,
      content: typeof script.content === 'string' ? JSON.parse(script.content) : script.content,
      checklist: typeof script.checklist === 'string' ? JSON.parse(script.checklist) : script.checklist,
    }

    return NextResponse.json(parsedScript)
  } catch (error) {
    console.error('Erreur lors de la récupération du script:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un script
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSessionWithTest()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { title, videoIdeaId, content, checklist } = body

    // Vérifier que le script appartient à l'utilisateur
    const existingScript = await prisma.videoScript.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingScript) {
      return NextResponse.json(
        { error: 'Script non trouvé' },
        { status: 404 }
      )
    }

    // Pour SQLite, Prisma attend des chaînes JSON pour les champs Json
    const contentToSave = content !== undefined ? content : existingScript.content
    const checklistToSave = checklist !== undefined ? checklist : existingScript.checklist

    const script = await prisma.videoScript.update({
      where: {
        id: params.id,
      },
      data: {
        title: title !== undefined ? title : existingScript.title,
        videoIdeaId: videoIdeaId !== undefined ? videoIdeaId : existingScript.videoIdeaId,
        content: typeof contentToSave === 'string' ? contentToSave : JSON.stringify(contentToSave),
        checklist: typeof checklistToSave === 'string' ? checklistToSave : JSON.stringify(checklistToSave),
      },
      include: {
        videoIdea: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Parser les champs JSON pour SQLite
    const parsedScript = {
      ...script,
      content: typeof script.content === 'string' ? JSON.parse(script.content) : script.content,
      checklist: typeof script.checklist === 'string' ? JSON.parse(script.checklist) : script.checklist,
    }

    return NextResponse.json(parsedScript)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du script:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un script
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSessionWithTest()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier que le script appartient à l'utilisateur
    const existingScript = await prisma.videoScript.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingScript) {
      return NextResponse.json(
        { error: 'Script non trouvé' },
        { status: 404 }
      )
    }

    await prisma.videoScript.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Script supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du script:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

