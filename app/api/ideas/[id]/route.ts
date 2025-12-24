import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer une idée spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSessionWithTest()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const idea = await prisma.videoIdea.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        scripts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!idea) {
      return NextResponse.json(
        { error: 'Idée non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'idée:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une idée
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
    const { title, concept, platform, format, status, priority, targetDate } = body

    // Vérifier que l'idée appartient à l'utilisateur
    const existingIdea = await prisma.videoIdea.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingIdea) {
      return NextResponse.json(
        { error: 'Idée non trouvée' },
        { status: 404 }
      )
    }

    const idea = await prisma.videoIdea.update({
      where: {
        id: params.id,
      },
      data: {
        title: title !== undefined ? title : existingIdea.title,
        concept: concept !== undefined ? concept : existingIdea.concept,
        platform: platform !== undefined ? platform : existingIdea.platform,
        format: format !== undefined ? format : existingIdea.format,
        status: status !== undefined ? status : existingIdea.status,
        priority: priority !== undefined ? priority : existingIdea.priority,
        targetDate: targetDate !== undefined
          ? (targetDate ? new Date(targetDate) : null)
          : existingIdea.targetDate,
      },
      include: {
        scripts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'idée:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une idée
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSessionWithTest()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier que l'idée appartient à l'utilisateur
    const existingIdea = await prisma.videoIdea.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingIdea) {
      return NextResponse.json(
        { error: 'Idée non trouvée' },
        { status: 404 }
      )
    }

    await prisma.videoIdea.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Idée supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'idée:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

