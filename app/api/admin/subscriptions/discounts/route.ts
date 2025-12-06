import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// GET - Récupérer toutes les réductions
export async function GET(request: NextRequest) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    const where: any = {}
    if (planId) {
      where.planId = planId
    }

    const discounts = await prisma.subscriptionDiscount.findMany({
      where,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(discounts)
  } catch (error) {
    console.error('Erreur lors de la récupération des réductions:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle réduction
export async function POST(request: NextRequest) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_ACCESS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const {
      planId,
      code,
      name,
      description,
      type,
      value,
      isActive,
      validFrom,
      validUntil,
      maxUses,
    } = body

    if (!planId || !name || !type || value === undefined) {
      return NextResponse.json(
        { error: 'Plan, nom, type et valeur sont requis' },
        { status: 400 }
      )
    }

    if (type !== 'percentage' && type !== 'fixed') {
      return NextResponse.json(
        { error: 'Le type doit être "percentage" ou "fixed"' },
        { status: 400 }
      )
    }

    // Vérifier si le code existe déjà
    if (code) {
      const existingDiscount = await prisma.subscriptionDiscount.findUnique({
        where: { code: code.toUpperCase() },
      })

      if (existingDiscount) {
        return NextResponse.json(
          { error: 'Un code promo avec ce code existe déjà' },
          { status: 400 }
        )
      }
    }

    const discount = await prisma.subscriptionDiscount.create({
      data: {
        planId,
        code: code ? code.toUpperCase() : null,
        name,
        description: description || null,
        type,
        value,
        isActive: isActive !== undefined ? isActive : true,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        maxUses: maxUses || null,
        currentUses: 0,
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(discount, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la réduction:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

