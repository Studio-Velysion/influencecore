export interface Role {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  createdAt: string
  updatedAt: string
  permissions?: RolePermission[]
  _count?: {
    userRoles: number
  }
}

export interface Permission {
  id: string
  key: string
  name: string
  description: string | null
  category: string | null
  createdAt: string
}

export interface RolePermission {
  id: string
  roleId: string
  permissionId: string
  createdAt: string
  permission: Permission
}

export interface UserRole {
  id: string
  userId: string
  roleId: string
  createdAt: string
  role: Role
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  pseudo: string | null
  isAdmin: boolean
  createdAt: string
  userRoles: UserRole[]
}

// Import pour compatibilité
export type { SubscriptionPlan, SubscriptionDiscount, UserSubscription } from './subscriptions'

