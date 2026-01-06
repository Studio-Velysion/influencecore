# Déploiement CapRover (monorepo InfluenceCore)

CapRover déploie **1 conteneur par application**. Pour ta stack complète, crée plusieurs apps CapRover:

### Noms d’apps recommandés (à utiliser tels quels)

- **influencecore** (Next.js + Prisma)
- **postgres** (service DB unique)
- **keycloak** (SSO + rôles)
- **helpdesk** (Frappe)
- **fossbilling** (PHP)
- **postiz-backend** (Postiz backend pour Messa)

## 1) InfluenceCore (Git Deploy)

Le repo contient `captain-definition` à la racine → CapRover détecte automatiquement le `Dockerfile`.

### Variables d’environnement (InfluenceCore)

- `DATABASE_URL` : `postgresql://<POSTGRES_USER>:<PASS>@srv-captain--postgres:5432/influencecore?schema=public`
- `PORT` : `80` (CapRover expose généralement le port 80 du conteneur)
- `NEXTAUTH_URL` : `https://ton-domaine`
- `NEXTAUTH_SECRET` : secret fort
- `KEYCLOAK_ISSUER` : `https://ton-domaine-keycloak/realms/influencecore` (ou **URL interne**: `http://srv-captain--keycloak:8080/realms/influencecore`)
- `KEYCLOAK_CLIENT_ID` : `influencecore-web`
- `KEYCLOAK_CLIENT_SECRET` : secret
- `AUTO_DB_PUSH` : `true` (ou `false` si tu fais les migrations séparément)

Premier admin (création au premier démarrage si aucun admin):
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `INITIAL_ADMIN_NAME` (optionnel)
- `INITIAL_ADMIN_PSEUDO` (optionnel)

### Connexion API entre conteneurs (InfluenceCore -> services)

CapRover fournit un DNS interne pour chaque app:

- **`srv-captain--<app-name>`** (accessible uniquement depuis les autres conteneurs CapRover)

Variables à définir côté InfluenceCore pour que les API fonctionnent correctement:

- **Helpdesk**
  - `HELPDESK_URL=http://srv-captain--helpdesk:8000`
  - `HELPDESK_API_KEY=...` (Frappe API key)
  - `HELPDESK_API_SECRET=...` (Frappe API secret)

- **FOSSBilling**
  - `FOSSBILLING_URL=http://srv-captain--fossbilling` (Apache écoute sur 80)
  - `FOSSBILLING_ADMIN_API_TOKEN=...` (token admin FOSSBilling)

- **Postiz backend (Messa)**
  - `POSTIZ_BACKEND_URL=http://srv-captain--postiz-backend:3100`
  - `INFLUENCECORE_INTERNAL_KEY=...` (clé partagée InfluenceCore <-> Postiz)

> Les URLs `NEXT_PUBLIC_*` servent à l’iframe (côté navigateur). Pour l’API serveur, utilise les URLs internes ci‑dessus.

## Checklist rapide CapRover (ordre)

1) Créer l’app **postgres** (one‑click) et définir le user/password  
2) Créer l’app **keycloak** (image) et connecter la DB `keycloak` sur `srv-captain--postgres:5432`  
3) (Optionnel) Déployer tes services annexes selon leur compatibilité DB (certains stacks legacy restent MySQL‑only)  
5) Créer l’app **postiz-backend** (si tu utilises Messa)  
6) Déployer **influencecore** depuis Git et renseigner toutes les variables ci‑dessus

## 2) MariaDB (DB unique)

Utilise une app CapRover MariaDB/MySQL (one-click), puis crée 4 DB:
- `influencecore`
- `keycloak`
- `helpdesk`
- `fossbilling`

## 3) Keycloak

Déploie Keycloak comme app CapRover séparée (image `quay.io/keycloak/keycloak`).
Le repo inclut un realm importable + thème (dossier `docker/keycloak`).

## Synchronisation “DB / API”

- **DB unique**: tout le monde se connecte au **même serveur MariaDB**, mais avec **des bases séparées** (pas de duplication de serveur).
- **Miroir InfluenceCore**: InfluenceCore stocke un miroir dans ses tables `ExternalTicket` et `ExternalSubscription` lors des appels API (tickets créés via InfluenceCore, subscriptions listées via InfluenceCore).
- Pour une sync “temps réel” complète (créé dans FOSSBilling/Helpdesk -> visible dans InfluenceCore), il faut ajouter :
  - soit des **webhooks** (FOSSBilling -> InfluenceCore, Helpdesk -> InfluenceCore),
  - soit un **job planifié** (polling) côté InfluenceCore/worker.

## Notes

- En production, évite de scaler InfluenceCore > 1 tant que `AUTO_DB_PUSH=true` (concurrence sur db push). Préférable: migrations contrôlées.


