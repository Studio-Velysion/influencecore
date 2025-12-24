import { NextResponse } from 'next/server'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'
import { fossbillingAdminCall } from '@/lib/integrations/fossbilling'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const canView = await checkPermission(PERMISSIONS.FOSSBILLING_SUBSCRIPTIONS_VIEW)
    if (!canView) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || '1')
    const per_page = Number(searchParams.get('per_page') || '30')

    const result = await fossbillingAdminCall<any>('invoice', 'subscription_get_list', {
      page,
      per_page,
      ...Object.fromEntries(searchParams.entries()),
    })

    // Mirror dans la DB InfluenceCore (même instance MariaDB)
    // On stocke un JSON brut pour ne pas dépendre du schéma exact FOSSBilling.
    try {
      const list: any[] =
        (result && (result.list || result.items || result.subscriptions)) ||
        (Array.isArray(result) ? result : [])

      if (Array.isArray(list)) {
        for (const sub of list) {
          const externalId = String(sub?.id || sub?.subscription_id || sub?.sid || '')
          if (!externalId) continue

          await prisma.externalSubscription.upsert({
            where: { externalId },
            update: {
              status: sub?.status ? String(sub.status) : null,
              clientEmail: sub?.email ? String(sub.email) : (sub?.client_email ? String(sub.client_email) : null),
              planName: sub?.title ? String(sub.title) : (sub?.plan ? String(sub.plan) : null),
              raw: JSON.stringify(sub),
            },
            create: {
              externalId,
              status: sub?.status ? String(sub.status) : null,
              clientEmail: sub?.email ? String(sub.email) : (sub?.client_email ? String(sub.client_email) : null),
              planName: sub?.title ? String(sub.title) : (sub?.plan ? String(sub.plan) : null),
              raw: JSON.stringify(sub),
            },
          })
        }
      }
    } catch (e) {
      console.warn('[fossbilling] mirror subscriptions failed:', e)
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}


