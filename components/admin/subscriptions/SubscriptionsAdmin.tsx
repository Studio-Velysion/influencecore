'use client'

import { useState, useEffect } from 'react'
import { SubscriptionPlan, SubscriptionDiscount, AdminUser } from '@/types/subscriptions'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import PlanForm from './PlanForm'
import DiscountForm from './DiscountForm'
import AssignSubscription from './AssignSubscription'
import Badge from '@/components/common/Badge'
import { handleApiError, handleApiSuccess } from '@/lib/api'
import { formatNumber } from '@/lib/utils'

export default function SubscriptionsAdmin() {
  const [activeTab, setActiveTab] = useState<'plans' | 'discounts' | 'users'>('plans')
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [discounts, setDiscounts] = useState<SubscriptionDiscount[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false)
  const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [editingDiscount, setEditingDiscount] = useState<SubscriptionDiscount | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'plan' | 'discount'; id: string; name: string } | null>(null)

  const fetchData = async () => {
    try {
      const [plansRes, discountsRes, usersRes] = await Promise.all([
        fetch('/api/admin/subscriptions/plans'),
        fetch('/api/admin/subscriptions/discounts'),
        fetch('/api/admin/users'),
      ])

      if (plansRes.ok) {
        const plansData = await plansRes.json()
        setPlans(plansData)
      }

      if (discountsRes.ok) {
        const discountsData = await discountsRes.json()
        setDiscounts(discountsData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreatePlan = () => {
    setEditingPlan(null)
    setIsPlanFormOpen(true)
  }

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setIsPlanFormOpen(true)
  }

  const handleCreateDiscount = () => {
    setEditingDiscount(null)
    setIsDiscountFormOpen(true)
  }

  const handleEditDiscount = (discount: SubscriptionDiscount) => {
    setEditingDiscount(discount)
    setIsDiscountFormOpen(true)
  }

  const handleAssignSubscription = (user: AdminUser) => {
    setSelectedUser(user)
    setIsAssignOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    try {
      const url =
        deleteConfirm.type === 'plan'
          ? `/api/admin/subscriptions/plans/${deleteConfirm.id}`
          : `/api/admin/subscriptions/discounts/${deleteConfirm.id}`

      const response = await fetch(url, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }

      handleApiSuccess(`${deleteConfirm.type === 'plan' ? 'Plan' : 'Réduction'} supprimé(e)`)
      setDeleteConfirm(null)
      fetchData()
    } catch (error) {
      handleApiError(error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Abonnements</h1>
        <p className="mt-2 text-gray-600">
          Gérez les plans, réductions et attributions d'abonnements
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['plans', 'discounts', 'users'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'plans' && 'Plans'}
              {tab === 'discounts' && 'Réductions'}
              {tab === 'users' && 'Attributions'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Plans d'abonnement</h3>
              <Button onClick={handleCreatePlan} variant="primary">
                + Créer un plan
              </Button>
            </div>

            {plans.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 mb-4">Aucun plan créé</p>
                <Button onClick={handleCreatePlan} variant="primary">
                  Créer votre premier plan
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {plan.name}
                        </h4>
                        <div className="flex gap-2 mt-2">
                          {plan.isUnlimited && (
                            <Badge variant="warning" size="sm">Illimité</Badge>
                          )}
                          {plan.isActive ? (
                            <Badge variant="success" size="sm">Actif</Badge>
                          ) : (
                            <Badge variant="default" size="sm">Inactif</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPlan(plan)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'plan',
                              id: plan.id,
                              name: plan.name,
                            })
                          }
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {plan.isUnlimited ? (
                          'Gratuit'
                        ) : (
                          `${plan.price}${plan.currency === 'EUR' ? '€' : plan.currency}/${plan.interval === 'month' ? 'mois' : 'an'}`
                        )}
                      </div>
                      {plan.description && (
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      )}
                      <div className="text-sm text-gray-500">
                        {formatNumber(plan._count?.subscriptions || 0)} abonné(s)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Réductions</h3>
              <Button onClick={handleCreateDiscount} variant="primary">
                + Créer une réduction
              </Button>
            </div>

            {discounts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 mb-4">Aucune réduction créée</p>
                <Button onClick={handleCreateDiscount} variant="primary">
                  Créer votre première réduction
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Réduction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {discounts.map((discount) => (
                      <tr key={discount.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {discount.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {discount.plan?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {discount.code || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {discount.type === 'percentage'
                            ? `${discount.value}%`
                            : `${discount.value}${discount.plan?.currency === 'EUR' ? '€' : ''}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {discount.isActive ? (
                            <Badge variant="success" size="sm">Active</Badge>
                          ) : (
                            <Badge variant="default" size="sm">Inactive</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDiscount(discount)}
                            >
                              ✏️
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'discount',
                                  id: discount.id,
                                  name: discount.name,
                                })
                              }
                            >
                              🗑️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Attribuer des abonnements
              </h3>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name || user.pseudo || user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAssignSubscription(user)}
                        >
                          Attribuer un abonnement
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isPlanFormOpen && (
        <Modal
          isOpen={isPlanFormOpen}
          onClose={() => {
            setIsPlanFormOpen(false)
            setEditingPlan(null)
          }}
          title={editingPlan ? 'Modifier le plan' : 'Créer un nouveau plan'}
          size="lg"
        >
          <PlanForm
            plan={editingPlan}
            onSuccess={() => {
              setIsPlanFormOpen(false)
              setEditingPlan(null)
              fetchData()
            }}
            onCancel={() => {
              setIsPlanFormOpen(false)
              setEditingPlan(null)
            }}
          />
        </Modal>
      )}

      {isDiscountFormOpen && (
        <Modal
          isOpen={isDiscountFormOpen}
          onClose={() => {
            setIsDiscountFormOpen(false)
            setEditingDiscount(null)
          }}
          title={editingDiscount ? 'Modifier la réduction' : 'Créer une nouvelle réduction'}
          size="lg"
        >
          <DiscountForm
            discount={editingDiscount}
            plans={plans}
            onSuccess={() => {
              setIsDiscountFormOpen(false)
              setEditingDiscount(null)
              fetchData()
            }}
            onCancel={() => {
              setIsDiscountFormOpen(false)
              setEditingDiscount(null)
            }}
          />
        </Modal>
      )}

      {isAssignOpen && selectedUser && (
        <Modal
          isOpen={isAssignOpen}
          onClose={() => {
            setIsAssignOpen(false)
            setSelectedUser(null)
          }}
          title="Attribuer un abonnement"
          size="md"
        >
          <AssignSubscription
            user={selectedUser}
            plans={plans}
            onSuccess={() => {
              setIsAssignOpen(false)
              setSelectedUser(null)
              fetchData()
            }}
            onCancel={() => {
              setIsAssignOpen(false)
              setSelectedUser(null)
            }}
          />
        </Modal>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDelete}
          title={`Supprimer ${deleteConfirm.type === 'plan' ? 'le plan' : 'la réduction'}`}
          message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm.name}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="danger"
        />
      )}
    </div>
  )
}

