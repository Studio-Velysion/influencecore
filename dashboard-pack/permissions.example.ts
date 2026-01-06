/**
 * Exemple de permissions (strings) — adapte selon ton projet.
 */

export const PERMISSIONS = {
  // Client
  IDEAS_VIEW: 'ideas.view',
  SCRIPTS_VIEW: 'scripts.view',
  CALENDAR_VIEW: 'calendar.view',
  NOTES_VIEW: 'notes.view',
  HELPDESK_TICKETS_CREATE: 'helpdesk.tickets.create',
  FOSSBILLING_SUBSCRIPTIONS_VIEW: 'fossbilling.subscriptions.view',

  // Admin
  ADMIN_ACCESS: 'admin.access',
  ADMIN_USERS: 'admin.users',
  ADMIN_LOGS: 'admin.logs',
  HELPDESK_ADMIN: 'helpdesk.admin',
  FOSSBILLING_ADMIN: 'fossbilling.admin',
} as const


