import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les scripts de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ideaId = searchParams.get('ideaId')

    const where: any = {
      userId: session.user.id,
    }

    if (ideaId) {
      where.videoIdeaId = ideaId
    }

    const scripts = await prisma.videoScript.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
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

    return NextResponse.json(scripts)
  } catch (error) {
    console.error('Erreur lors de la récupération des scripts:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau script
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { title, videoIdeaId, content, checklist } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      )
    }

    // Structure de contenu par défaut si non fournie
    const defaultContent = {
      hook: '',
      introduction: '',
      parts: [],
      outro: '',
      cta: '',
    }

    const script = await prisma.videoScript.create({
      data: {
        userId: session.user.id,
        title,
        videoIdeaId: videoIdeaId || null,
        content: content || defaultContent,
        checklist: checklist || {
          tournage: [],
          montage: [],
        },
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

    return NextResponse.json(script, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du script:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

