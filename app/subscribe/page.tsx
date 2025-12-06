import { prisma } from '@/lib/prisma'
import { getPlanCurrentPrice } from '@/lib/subscriptions'
import Navbar from '@/components/common/Navbar'
import SubscriptionPlans from '@/components/subscriptions/SubscriptionPlans'

export default async function SubscribePage() {
  // Récupérer tous les plans actifs avec leurs prix
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
      try {
        const priceInfo = await getPlanCurrentPrice(plan.id)
        return {
          ...plan,
          price: Number(plan.price),
          priceInfo,
        }
      } catch (error) {
        return {
          ...plan,
          price: Number(plan.price),
          priceInfo: {
            original: Number(plan.price),
            discounted: null,
            discount: null,
            final: Number(plan.price),
            currency: plan.currency,
          },
        }
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre abonnement
          </h1>
          <p className="text-xl text-gray-600">
            Sélectionnez le plan qui correspond le mieux à vos besoins
          </p>
        </div>
        <SubscriptionPlans plans={plansWithPrices} />
      </main>
    </div>
  )
}

