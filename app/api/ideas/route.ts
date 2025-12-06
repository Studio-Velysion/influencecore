import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les idées de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {
      userId: session.user.id,
    }

    if (status) {
      where.status = status
    }

    const ideas = await prisma.videoIdea.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        scripts: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error('Erreur lors de la récupération des idées:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle idée
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { title, concept, platform, format, status, priority, targetDate } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      )
    }

    const idea = await prisma.videoIdea.create({
      data: {
        userId: session.user.id,
        title,
        concept: concept || null,
        platform: platform || null,
        format: format || null,
        status: status || 'Idée',
        priority: priority || null,
        targetDate: targetDate ? new Date(targetDate) : null,
      },
      include: {
        scripts: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'idée:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

