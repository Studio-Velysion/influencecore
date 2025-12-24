import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

// GET - Récupérer tous les utilisateurs
export async function GET(request: NextRequest) {
  try {
    const hasAccess = await checkPermission(PERMISSIONS.ADMIN_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: any = {}
    if (search) {
      // SQLite ne supporte pas mode: 'insensitive', on utilise contains directement
      // La recherche sera case-sensitive mais fonctionnelle
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
        { pseudo: { contains: search } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        pseudo: true,
        isAdmin: true,
        createdAt: true,
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

