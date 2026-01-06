/**
 * Dashboard Data Pack (copier/coller)
 *
 * Source: InfluenceCore.
 * - Données des tableaux de bord (routes + cartes + libellés).
 * - Permissions sous forme de strings (ex: "ideas.view").
 */

export type PermissionKey = string

export type IconKey =
  | 'video'
  | 'fileText'
  | 'calendar'
  | 'edit'
  | 'users'
  | 'shield'
  | 'creditCard'
  | 'settings'
  | 'layout'
  | 'alertCircle'
  | 'lifeBuoy'

export interface DashboardCardData {
  path: string
  label: string
  title: string
  description: string
  iconKey: IconKey
  bgColor: string
  permission: PermissionKey
}

export interface SidebarRouteItem {
  path: string
  label: string
  iconKey: IconKey | 'home'
  permission?: PermissionKey
}

export const CLIENT_ROUTE_NAMES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/ideas': 'Idées Vidéos',
  '/scripts': 'Scripts',
  '/calendar': 'Calendrier',
  '/notes': 'Notes',
  '/helpdesk/new': 'Créer un ticket',
  '/subscriptions': 'Abonnements',
}

export const ADMIN_ROUTE_NAMES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'Utilisateurs',
  '/integrations/keycloak': 'Keycloak (Rôles)',
  '/admin/logs': "Logs d'Erreurs",
  '/admin/settings': 'Paramètres',
}

export const CLIENT_SIDEBAR_ROUTES: SidebarRouteItem[] = [
  { path: '/dashboard', label: 'Dashboard', iconKey: 'home' },
  { path: '/ideas', label: 'Idées', iconKey: 'video', permission: 'ideas.view' },
  { path: '/scripts', label: 'Scripts', iconKey: 'fileText', permission: 'scripts.view' },
  { path: '/calendar', label: 'Calendrier', iconKey: 'calendar', permission: 'calendar.view' },
  { path: '/notes', label: 'Notes', iconKey: 'edit', permission: 'notes.view' },
  { path: '/helpdesk/new', label: 'Créer un ticket', iconKey: 'lifeBuoy', permission: 'helpdesk.tickets.create' },
  { path: '/subscriptions', label: 'Abonnements', iconKey: 'creditCard', permission: 'fossbilling.subscriptions.view' },
]

export const ADMIN_SIDEBAR_ROUTES: SidebarRouteItem[] = [
  { path: '/admin', label: 'Dashboard', iconKey: 'home' },
  { path: '/admin/users', label: 'Utilisateurs', iconKey: 'users' },
  { path: '/integrations/keycloak', label: 'Keycloak (Rôles)', iconKey: 'shield' },
  { path: '/admin/logs', label: "Logs d'Erreurs", iconKey: 'alertCircle' },
  { path: '/admin/settings', label: 'Paramètres', iconKey: 'settings' },
]

export const DASHBOARD_CLIENT_CARDS: DashboardCardData[] = [
  {
    path: '/ideas',
    label: 'Idées Vidéos',
    title: 'Nouvelle idée',
    description: 'Enregistrez une nouvelle idée',
    iconKey: 'video',
    bgColor: 'purple.500',
    permission: 'ideas.view',
  },
  {
    path: '/scripts',
    label: 'Scripts',
    title: 'Mes Scripts',
    description: 'Gérer vos scripts',
    iconKey: 'fileText',
    bgColor: 'purple.400',
    permission: 'scripts.view',
  },
  {
    path: '/calendar',
    label: 'Calendrier',
    title: 'Éditorial',
    description: 'Planifiez vos vidéos',
    iconKey: 'calendar',
    bgColor: 'gold.500',
    permission: 'calendar.view',
  },
  {
    path: '/notes',
    label: 'Notes',
    title: 'Notes rapides',
    description: 'Capturez vos pensées',
    iconKey: 'edit',
    bgColor: 'purple.600',
    permission: 'notes.view',
  },
  {
    path: '/helpdesk/new',
    label: 'Support',
    title: 'Créer un ticket',
    description: 'Contactez le support via Helpdesk',
    iconKey: 'lifeBuoy',
    bgColor: 'purple.500',
    permission: 'helpdesk.tickets.create',
  },
  {
    path: '/subscriptions',
    label: 'Abonnements',
    title: 'Mes abonnements',
    description: 'Voir les abonnements (FOSSBilling)',
    iconKey: 'creditCard',
    bgColor: 'orange.500',
    permission: 'fossbilling.subscriptions.view',
  },
]

export const DASHBOARD_ADMIN_CARDS: DashboardCardData[] = [
  {
    path: '/admin/users',
    label: 'Utilisateurs',
    title: 'Gérer les utilisateurs',
    description: 'Voir et gérer tous les utilisateurs',
    iconKey: 'users',
    bgColor: 'blue.500',
    permission: 'admin.users',
  },
  {
    path: '/integrations/keycloak',
    label: 'Keycloak (Rôles)',
    title: 'Gestion des rôles (Keycloak)',
    description: 'Accéder à Keycloak Admin Console',
    iconKey: 'shield',
    bgColor: 'green.500',
    permission: 'admin.users',
  },
  {
    path: '/integrations/helpdesk',
    label: 'Helpdesk',
    title: 'Dashboard Helpdesk',
    description: 'Accéder au Helpdesk (agents/admin)',
    iconKey: 'lifeBuoy',
    bgColor: 'purple.500',
    permission: 'helpdesk.admin',
  },
  {
    path: '/integrations/fossbilling',
    label: 'FOSSBilling',
    title: 'Dashboard FOSSBilling',
    description: 'Accéder au billing (staff/admin)',
    iconKey: 'creditCard',
    bgColor: 'orange.500',
    permission: 'fossbilling.admin',
  },
  {
    path: '/admin/logs',
    label: "Logs d'Erreurs",
    title: 'Erreurs système',
    description: "Voir les logs d'erreurs",
    iconKey: 'alertCircle',
    bgColor: 'red.500',
    permission: 'admin.logs',
  },
  {
    path: '/admin/settings',
    label: 'Paramètres',
    title: 'Configuration',
    description: 'Paramètres du système',
    iconKey: 'settings',
    bgColor: 'gray.500',
    permission: 'admin.access',
  },
]


