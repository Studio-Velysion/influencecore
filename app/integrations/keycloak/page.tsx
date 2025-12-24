import ExternalIframe from '@/components/integrations/ExternalIframe'

export default function KeycloakIntegrationPage() {
  // URL de la console Keycloak (ex: http://localhost:8080/admin/master/console/)
  const src = process.env.NEXT_PUBLIC_KEYCLOAK_ADMIN_URL || ''

  return <ExternalIframe title="Keycloak (Rôles & Accès)" src={src} />
}


