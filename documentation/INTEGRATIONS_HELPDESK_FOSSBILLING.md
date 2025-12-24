# Intégrations : Helpdesk (Frappe Helpdesk) & FOSSBilling

Ce projet intègre deux applications externes **sans modifier leur logique** (seulement le thème/couleurs + une passerelle API côté InfluenceCore) :

- `helpdesk-develop/` (Frappe Helpdesk) : création de tickets depuis InfluenceCore + lien vers le dashboard Helpdesk
- `FOSSBilling/` : affichage des abonnements dans InfluenceCore + lien vers le dashboard FOSSBilling

## Variables d’environnement (InfluenceCore)

À ajouter dans ton `.env` (ou variables système) :

### Helpdesk

- `HELPDESK_URL` : base URL backend Frappe (ex: `http://helpdesk.localhost:8000`)
- `HELPDESK_API_KEY` : API key Frappe (service account)
- `HELPDESK_API_SECRET` : API secret Frappe (service account)
- `NEXT_PUBLIC_HELPDESK_DASHBOARD_URL` : URL du dashboard Helpdesk à afficher en iframe (ex: `http://helpdesk.localhost:8000/helpdesk`)

### FOSSBilling

- `FOSSBILLING_URL` : base URL FOSSBilling (ex: `http://localhost/fossbilling`)
- `FOSSBILLING_ADMIN_API_TOKEN` : token API admin FOSSBilling (utilisé via Basic Auth `admin:<token>`)
- `NEXT_PUBLIC_FOSSBILLING_DASHBOARD_URL` : URL dashboard staff/admin FOSSBilling à afficher en iframe (ex: `http://localhost/fossbilling/staff`)

## Pages InfluenceCore ajoutées

- ` /helpdesk/new ` : formulaire “Créer un ticket” (pousse le ticket dans Helpdesk)
- ` /integrations/helpdesk ` : iframe vers Helpdesk
- ` /subscriptions ` : liste des abonnements (source FOSSBilling)
- ` /integrations/fossbilling ` : iframe vers FOSSBilling

## Permissions

Les accès sont contrôlés via `lib/permissions.ts` (rôles InfluenceCore) :

- Helpdesk : `helpdesk.access`, `helpdesk.tickets.create`, `helpdesk.tickets.view`, `helpdesk.admin`
- FOSSBilling : `fossbilling.access`, `fossbilling.subscriptions.view`, `fossbilling.admin`

## Thème / Couleurs (sans changer la logique)

### Helpdesk

Le “violet” Tailwind a été aligné sur la palette Velysion dans :

- `helpdesk-develop/desk/tailwind.config.js`

### FOSSBilling

Override CSS ajouté et injecté dans le thème `admin_default` :

- `FOSSBilling/themes/admin_default/assets/css/velysion.css`
- inclus dans `layout_default.html.twig` + `layout_login.html.twig`


