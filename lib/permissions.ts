// Système de permissions et vérification

import { getCurrentUser } from '@/lib/auth'

// Liste de toutes les permissions disponibles
export const PERMISSIONS = {
  // Administration
  ADMIN_ACCESS: 'admin.access',
  ADMIN_USERS: 'admin.users',
  ADMIN_CMS: 'admin.cms',
  ADMIN_LOGS: 'admin.logs',
  
  // Intégrations
  HELPDESK_ACCESS: 'helpdesk.access',
  HELPDESK_TICKETS_CREATE: 'helpdesk.tickets.create',
  HELPDESK_TICKETS_VIEW: 'helpdesk.tickets.view',
  HELPDESK_ADMIN: 'helpdesk.admin',

  FOSSBILLING_ACCESS: 'fossbilling.access',
  FOSSBILLING_SUBSCRIPTIONS_VIEW: 'fossbilling.subscriptions.view',
  FOSSBILLING_ADMIN: 'fossbilling.admin',

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

  // Messa (remplace Fusion)
  MESSA_ACCESS: 'messa.access',
  MESSA_WORKSPACES_VIEW: 'messa.workspaces.view',
  MESSA_TEMPLATES_VIEW: 'messa.templates.view',
  MESSA_POST_VERSIONS_VIEW: 'messa.post_versions.view',
  MESSA_QUEUES_VIEW: 'messa.queues.view',
  MESSA_HASHTAG_GROUPS_VIEW: 'messa.hashtag_groups.view',
  MESSA_DYNAMIC_VARIABLES_VIEW: 'messa.dynamic_variables.view',
} as const

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Catégories de permissions
export const PERMISSION_CATEGORIES = {
  admin: 'Administration',
  integrations: 'Intégrations',
  ideas: 'Idées Vidéos',
  scripts: 'Scripts',
  calendar: 'Calendrier',
  notes: 'Notes',
  messa: 'Messa',
} as const

// Permissions par catégorie
export const PERMISSIONS_BY_CATEGORY = {
  admin: [
    { key: PERMISSIONS.ADMIN_ACCESS, name: 'Accès administration', description: 'Accéder à l\'interface d\'administration' },
    { key: PERMISSIONS.ADMIN_USERS, name: 'Gérer les utilisateurs', description: 'Créer, modifier et supprimer des utilisateurs' },
  ],
  integrations: [
    { key: PERMISSIONS.HELPDESK_ACCESS, name: 'Accès Helpdesk', description: 'Accéder au système de tickets' },
    { key: PERMISSIONS.HELPDESK_TICKETS_CREATE, name: 'Créer des tickets', description: 'Créer des tickets Helpdesk depuis InfluenceCore' },
    { key: PERMISSIONS.HELPDESK_TICKETS_VIEW, name: 'Voir les tickets', description: 'Voir les tickets Helpdesk (liste/état)' },
    { key: PERMISSIONS.HELPDESK_ADMIN, name: 'Admin Helpdesk', description: 'Accéder au tableau de bord Helpdesk (agents/admin)' },
    { key: PERMISSIONS.FOSSBILLING_ACCESS, name: 'Accès FOSSBilling', description: 'Accéder au système de billing' },
    { key: PERMISSIONS.FOSSBILLING_SUBSCRIPTIONS_VIEW, name: 'Voir les abonnements', description: 'Voir les abonnements synchronisés depuis FOSSBilling' },
    { key: PERMISSIONS.FOSSBILLING_ADMIN, name: 'Admin FOSSBilling', description: 'Accéder au tableau de bord FOSSBilling (staff/admin)' },
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
  messa: [
    { key: PERMISSIONS.MESSA_ACCESS, name: 'Accès Messa', description: 'Accéder à Messa' },
    { key: PERMISSIONS.MESSA_WORKSPACES_VIEW, name: 'Voir les workspaces', description: 'Consulter les espaces de travail' },
    { key: PERMISSIONS.MESSA_TEMPLATES_VIEW, name: 'Voir les templates', description: 'Consulter les modèles' },
    { key: PERMISSIONS.MESSA_POST_VERSIONS_VIEW, name: 'Voir les versions', description: 'Consulter les versions de contenu' },
    { key: PERMISSIONS.MESSA_QUEUES_VIEW, name: 'Voir les queues', description: 'Consulter les files de publication' },
    { key: PERMISSIONS.MESSA_HASHTAG_GROUPS_VIEW, name: 'Voir les groupes de hashtags', description: 'Consulter les groupes de hashtags' },
    { key: PERMISSIONS.MESSA_DYNAMIC_VARIABLES_VIEW, name: 'Voir les variables dynamiques', description: 'Consulter les variables dynamiques' },
  ],
}

/**
 * Ancien système "Rôles & Permissions" supprimé.
 * En attendant Keycloak (ou ton nouveau système), on garde une API simple:
 * - Les admins (user.isAdmin) ont tout
 * - Les users authentifiés ont toutes les permissions non-admin
 */

const ADMIN_ONLY: PermissionKey[] = [
  PERMISSIONS.ADMIN_ACCESS,
  PERMISSIONS.ADMIN_USERS,
  PERMISSIONS.ADMIN_CMS,
  PERMISSIONS.ADMIN_LOGS,
]

function getNonAdminPermissions(): string[] {
  return Object.values(PERMISSIONS).filter((p) => !ADMIN_ONLY.includes(p as PermissionKey))
}

export async function checkPermission(permission: PermissionKey): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  const roles = (user as any)?.roles as string[] | undefined
  const isAdmin =
    !!user.isAdmin ||
    (Array.isArray(roles) && (roles.includes('influencecore-admin') || roles.includes('admin')))
  if (isAdmin) return true

  // Permissions admin réservées aux admins
  if (ADMIN_ONLY.includes(permission)) return false

  // Toutes les autres permissions sont autorisées pour un utilisateur connecté
  return true
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  // userId non utilisé: l'ancien moteur était DB-driven. On garde la signature pour compat.
  const user = await getCurrentUser()
  if (!user) return []
  if (user.isAdmin) return Object.values(PERMISSIONS)

  return getNonAdminPermissions()
}

