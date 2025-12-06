// Système de permissions et vérification

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// Liste de toutes les permissions disponibles
export const PERMISSIONS = {
  // Administration
  ADMIN_ACCESS: 'admin.access',
  ADMIN_USERS: 'admin.users',
  ADMIN_ROLES: 'admin.roles',
  
  // Idées
  IDEAS_VIEW: 'ideas.view',
  IDEAS_CREATE: 'ideas.create',
  IDEAS_EDIT: 'ideas.edit',
  IDEAS_DELETE: 'ideas.delete',
  
  // Scripts
  SCRIPTS_VIEW: 'scripts.view',
  SCRIPTS_CREATE: 'scripts.create',
  SCRIPTS_EDIT: 'scripts.edit',
  SCRIPTS_DELETE: 'scripts.delete',
  
  // Calendrier
  CALENDAR_VIEW: 'calendar.view',
  CALENDAR_EDIT: 'calendar.edit',
  
  // Notes
  NOTES_VIEW: 'notes.view',
  NOTES_CREATE: 'notes.create',
  NOTES_EDIT: 'notes.edit',
  NOTES_DELETE: 'notes.delete',
} as const

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Catégories de permissions
export const PERMISSION_CATEGORIES = {
  admin: 'Administration',
  ideas: 'Idées Vidéos',
  scripts: 'Scripts',
  calendar: 'Calendrier',
  notes: 'Notes',
} as const

// Permissions par catégorie
export const PERMISSIONS_BY_CATEGORY = {
  admin: [
    { key: PERMISSIONS.ADMIN_ACCESS, name: 'Accès administration', description: 'Accéder à l\'interface d\'administration' },
    { key: PERMISSIONS.ADMIN_USERS, name: 'Gérer les utilisateurs', description: 'Créer, modifier et supprimer des utilisateurs' },
    { key: PERMISSIONS.ADMIN_ROLES, name: 'Gérer les rôles', description: 'Créer, modifier et supprimer des rôles' },
  ],
  ideas: [
    { key: PERMISSIONS.IDEAS_VIEW, name: 'Voir les idées', description: 'Consulter les idées de vidéos' },
    { key: PERMISSIONS.IDEAS_CREATE, name: 'Créer des idées', description: 'Créer de nouvelles idées' },
    { key: PERMISSIONS.IDEAS_EDIT, name: 'Modifier les idées', description: 'Modifier les idées existantes' },
    { key: PERMISSIONS.IDEAS_DELETE, name: 'Supprimer les idées', description: 'Supprimer des idées' },
  ],
  scripts: [
    { key: PERMISSIONS.SCRIPTS_VIEW, name: 'Voir les scripts', description: 'Consulter les scripts' },
    { key: PERMISSIONS.SCRIPTS_CREATE, name: 'Créer des scripts', description: 'Créer de nouveaux scripts' },
    { key: PERMISSIONS.SCRIPTS_EDIT, name: 'Modifier les scripts', description: 'Modifier les scripts existants' },
    { key: PERMISSIONS.SCRIPTS_DELETE, name: 'Supprimer les scripts', description: 'Supprimer des scripts' },
  ],
  calendar: [
    { key: PERMISSIONS.CALENDAR_VIEW, name: 'Voir le calendrier', description: 'Consulter le calendrier éditorial' },
    { key: PERMISSIONS.CALENDAR_EDIT, name: 'Modifier le calendrier', description: 'Modifier les dates du calendrier' },
  ],
  notes: [
    { key: PERMISSIONS.NOTES_VIEW, name: 'Voir les notes', description: 'Consulter les notes rapides' },
    { key: PERMISSIONS.NOTES_CREATE, name: 'Créer des notes', description: 'Créer de nouvelles notes' },
    { key: PERMISSIONS.NOTES_EDIT, name: 'Modifier les notes', description: 'Modifier les notes existantes' },
    { key: PERMISSIONS.NOTES_DELETE, name: 'Supprimer les notes', description: 'Supprimer des notes' },
  ],
}

// Vérifier si un utilisateur a une permission
export async function hasPermission(
  userId: string,
  permission: PermissionKey
): Promise<boolean> {
  // Vérifier si l'utilisateur est admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  })

  if (user?.isAdmin) {
    return true // Les admins ont toutes les permissions
  }

  // Vérifier les permissions via les rôles
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  })

  for (const userRole of userRoles) {
    for (const rolePermission of userRole.role.permissions) {
      if (rolePermission.permission.key === permission) {
        return true
      }
    }
  }

  return false
}

// Vérifier si l'utilisateur actuel a une permission
export async function checkPermission(
  permission: PermissionKey
): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return false
  }

  return hasPermission(session.user.id, permission)
}

// Obtenir toutes les permissions d'un utilisateur
export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  })

  if (user?.isAdmin) {
    // Les admins ont toutes les permissions
    return Object.values(PERMISSIONS)
  }

  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  })

  const permissions = new Set<string>()
  for (const userRole of userRoles) {
    for (const rolePermission of userRole.role.permissions) {
      permissions.add(rolePermission.permission.key)
    }
  }

  return Array.from(permissions)
}

