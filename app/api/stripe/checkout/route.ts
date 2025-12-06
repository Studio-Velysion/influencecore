import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createCheckoutSession } from '@/lib/stripe'

// POST - Créer une session de checkout Stripe
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, discountCode } = body

    if (!planId) {
      return NextResponse.json(
        { error: 'planId est requis' },
        { status: 400 }
      )
    }

    // URLs de redirection
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/subscribe?canceled=true`

    // Créer la session de checkout
    const checkoutUrl = await createCheckoutSession(
      session.user.id,
      planId,
      successUrl,
      cancelUrl,
      discountCode
    )

    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Erreur lors de la création de la session checkout:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

