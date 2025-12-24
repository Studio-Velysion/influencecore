import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les scripts de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSessionWithTest()

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

    // Parser les champs JSON pour SQLite
    const parsedScripts = scripts.map(script => ({
      ...script,
      content: typeof script.content === 'string' ? JSON.parse(script.content) : script.content,
      checklist: typeof script.checklist === 'string' ? JSON.parse(script.checklist) : script.checklist,
    }))

    return NextResponse.json(parsedScripts)
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
    const session = await getServerSessionWithTest()

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

    // Pour SQLite, Prisma attend des chaînes JSON pour les champs Json
    const contentToSave = content || defaultContent
    const checklistToSave = checklist || {
      tournage: [],
      montage: [],
    }

    const script = await prisma.videoScript.create({
      data: {
        userId: session.user.id,
        title,
        videoIdeaId: videoIdeaId || null,
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

    return NextResponse.json(parsedScript, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du script:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

