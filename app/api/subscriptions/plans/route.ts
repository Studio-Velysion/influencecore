import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPlanCurrentPrice } from '@/lib/subscriptions'

// GET - Récupérer tous les plans actifs (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const discountCode = searchParams.get('code')

    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true,
      },
      include: {
        discounts: {
          where: {
            isActive: true,
            OR: [
              { validFrom: null },
              { validFrom: { lte: new Date() } },
            ],
            AND: [
              {
                OR: [
                  { validUntil: null },
                  { validUntil: { gte: new Date() } },
                ],
              },
            ],
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    // Calculer les prix avec réductions
    const plansWithPrices = await Promise.all(
      plans.map(async (plan) => {
        const priceInfo = await getPlanCurrentPrice(
          plan.id,
          discountCode || undefined
        )

        return {
          ...plan,
          priceInfo,
        }
      })
    )

    return NextResponse.json(plansWithPrices)
  } catch (error) {
    console.error('Erreur lors de la récupération des plans:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

