import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// PUT - Mettre à jour une note
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
    const { content, tag } = body

    // Vérifier que la note appartient à l'utilisateur
    const existingNote = await prisma.quickNote.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note non trouvée' },
        { status: 404 }
      )
    }

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Le contenu est requis' },
        { status: 400 }
      )
    }

    const note = await prisma.quickNote.update({
      where: {
        id: params.id,
      },
      data: {
        content: content.trim(),
        tag: tag || null,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier que la note appartient à l'utilisateur
    const existingNote = await prisma.quickNote.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note non trouvée' },
        { status: 404 }
      )
    }

    await prisma.quickNote.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Note supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

