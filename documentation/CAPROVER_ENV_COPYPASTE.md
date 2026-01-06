# CapRover — Variables “copier/coller” (stack complète)

## Hypothèses (noms d’apps)

- influencecore
- postgres
- keycloak
- helpdesk
- fossbilling
- postiz-backend

Le DNS interne CapRover est: `srv-captain--<app-name>`.

---

## 1) influencecore (app principale)

```env
PORT=80
DATABASE_URL=postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@srv-captain--postgres:5432/influencecore?schema=public

NEXTAUTH_URL=https://<ton-domaine-influencecore>
NEXTAUTH_SECRET=<secret-fort>

KEYCLOAK_ISSUER=http://srv-captain--keycloak:8080/realms/influencecore
KEYCLOAK_CLIENT_ID=influencecore-web
KEYCLOAK_CLIENT_SECRET=<secret-keycloak-client>

AUTO_DB_PUSH=true

# Premier admin (1ère installation uniquement)
INITIAL_ADMIN_EMAIL=<ton-email>
INITIAL_ADMIN_PASSWORD=<ton-mdp>
INITIAL_ADMIN_NAME=Administrateur
INITIAL_ADMIN_PSEUDO=admin

# APIs internes (serveur -> serveur)
HELPDESK_URL=http://srv-captain--helpdesk:8000
HELPDESK_API_KEY=<frappe-api-key>
HELPDESK_API_SECRET=<frappe-api-secret>

FOSSBILLING_URL=http://srv-captain--fossbilling
FOSSBILLING_ADMIN_API_TOKEN=<token-admin-fossbilling>

POSTIZ_BACKEND_URL=http://srv-captain--postiz-backend:3100
INFLUENCECORE_INTERNAL_KEY=<shared-key-influencecore-postiz>

# URLs publiques (iframe côté navigateur)
NEXT_PUBLIC_HELPDESK_DASHBOARD_URL=https://<ton-domaine-helpdesk>
NEXT_PUBLIC_FOSSBILLING_DASHBOARD_URL=https://<ton-domaine-fossbilling>
NEXT_PUBLIC_KEYCLOAK_ADMIN_URL=https://<ton-domaine-keycloak>/admin/master/console/
```

---

## 2) keycloak

```env
KC_DB=postgres
KC_DB_URL=jdbc:postgresql://srv-captain--postgres:5432/keycloak
KC_DB_USERNAME=<POSTGRES_USER>
KC_DB_PASSWORD=<POSTGRES_PASSWORD>

KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=<mot-de-passe-admin-keycloak>

KC_HTTP_ENABLED=true
KC_HOSTNAME_STRICT=false
KC_PROXY=edge
```

---

## 3) helpdesk (Frappe)

> Le déploiement Frappe est plus complexe (bench/site/migrations). On doit le finaliser côté CapRover (One‑Click ou image dédiée).

DB à viser:
- host: `srv-captain--postgres`
- database: `helpdesk`

---

## 4) fossbilling

DB à viser:
- host: `srv-captain--postgres`
- database: `fossbilling`

---

## 5) postiz-backend

Il doit exposer 3100 (interne), et recevoir:
- `INFLUENCECORE_INTERNAL_KEY` identique à celui d’InfluenceCore


