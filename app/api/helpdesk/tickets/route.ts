import { NextResponse } from 'next/server'
import { getServerSessionWithTest } from '@/lib/auth'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'
import { helpdeskCreateTicket } from '@/lib/integrations/helpdesk'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await getServerSessionWithTest()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const canCreate = await checkPermission(PERMISSIONS.HELPDESK_TICKETS_CREATE)
    if (!canCreate) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const subject = String(body?.subject || '').trim()
    const description = String(body?.description || '').trim()

    if (!subject || !description) {
      return NextResponse.json(
        { error: 'subject et description sont requis' },
        { status: 400 }
      )
    }

    const ticket = await helpdeskCreateTicket({
      subject,
      description,
      raisedByEmail: session?.user?.email || undefined,
    })

    // Mirror dans la DB InfluenceCore (même instance MariaDB)
    // On garde un JSON brut pour éviter de dépendre du schéma Helpdesk.
    try {
      const externalId =
        String((ticket as any)?.name || (ticket as any)?.id || (ticket as any)?.ticket_id || '')
      if (externalId) {
        await prisma.externalTicket.upsert({
          where: { externalId },
          update: {
            subject,
            description,
            status: String((ticket as any)?.status || ''),
            requesterEmail: session?.user?.email || null,
            raw: JSON.stringify(ticket),
          },
          create: {
            externalId,
            subject,
            description,
            status: String((ticket as any)?.status || ''),
            requesterEmail: session?.user?.email || null,
            raw: JSON.stringify(ticket),
          },
        })
      }
    } catch (e) {
      // Ne pas bloquer la création du ticket si le mirror échoue
      console.warn('[helpdesk] mirror ticket failed:', e)
    }

    return NextResponse.json({ ticket })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}


