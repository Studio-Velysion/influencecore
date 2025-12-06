import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Récupérer un script spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

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

    return NextResponse.json(script)
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
    const session = await getServerSession(authOptions)

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

    const script = await prisma.videoScript.update({
      where: {
        id: params.id,
      },
      data: {
        title: title !== undefined ? title : existingScript.title,
        videoIdeaId: videoIdeaId !== undefined ? videoIdeaId : existingScript.videoIdeaId,
        content: content !== undefined ? content : existingScript.content,
        checklist: checklist !== undefined ? checklist : existingScript.checklist,
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

    return NextResponse.json(script)
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
    const session = await getServerSession(authOptions)

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

