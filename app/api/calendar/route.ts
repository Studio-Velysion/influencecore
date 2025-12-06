import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les idées avec dates pour le calendrier
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // Format: YYYY-MM
    const year = searchParams.get('year')

    const where: any = {
      userId: session.user.id,
      targetDate: {
        not: null,
      },
    }

    // Si un mois est spécifié, filtrer par mois
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`)
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 1)
      endDate.setDate(0) // Dernier jour du mois

      where.targetDate = {
        gte: startDate,
        lte: endDate,
      }
    }

    const ideas = await prisma.videoIdea.findMany({
      where,
      orderBy: {
        targetDate: 'asc',
      },
      select: {
        id: true,
        title: true,
        status: true,
        platform: true,
        format: true,
        targetDate: true,
        priority: true,
      },
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error('Erreur lors de la récupération du calendrier:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

