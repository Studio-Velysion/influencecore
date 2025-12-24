# 🎬 InfluenceCore 24/12/2025

**Plateforme SaaS tout-en-un pour créateurs de contenu** (CreatorHub).

Organisez vos idées, scripts et workflow vidéo en un seul endroit.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MariaDB](https://img.shields.io/badge/MariaDB-10.11-blue)

---

## ✨ Fonctionnalités

### ✅ Modules principaux

- **Dashboard**: vue d’ensemble du workflow créateur
- **Idées**: gestion + workflow (Kanban)
- **Scripts**: éditeur structuré
- **Calendrier**: planification éditoriale
- **Notes**: notes rapides

### 🔐 Auth & rôles

- **SSO Keycloak** via NextAuth (OIDC)
- **Admin Console Keycloak** accessible depuis InfluenceCore (iframe / intégration)

### 🔌 Intégrations (unifiées dans InfluenceCore)

- **Messa (Postiz)**: fonctionnalités Postiz intégrées dans l’UI InfluenceCore (sans UI Postiz)
- **Helpdesk**: création de tickets depuis InfluenceCore + accès dashboard Helpdesk
- **Abonnements (FOSSBilling)**: affichage dans InfluenceCore + accès dashboard FOSSBilling

---

## 🚀 Stack Technique

- **App**: Next.js 14 (App Router) + React + TypeScript
- **UI**: Chakra UI v3 (+ styles Velysion)
- **DB**: MariaDB (MySQL) + Prisma
- **Auth**: NextAuth.js + Keycloak (OIDC)
- **Containers**: Docker / Docker Compose
- **Déploiement**: CapRover (recommandé pour le multi-conteneurs)

---

## 📦 Installation (recommandé) — Docker (stack complète)

1. **Créer `docker/.env`**

```bash
copy docker\\env.example docker\\.env
```

1. **Renseigner tes variables** dans `docker/.env` (mots de passe MariaDB, secrets NextAuth, Keycloak client, etc.)

1. **Démarrer la stack locale**

```bash
docker compose -f docker/docker-compose.local.yml up -d
```

1. **Accès**

- InfluenceCore: `http://localhost:3000`
- Keycloak: `http://localhost:8080`
- Helpdesk: `http://localhost:8000`
- FOSSBilling: `http://localhost:8081`

📖 Voir aussi: `docker/README.md`

---

## 🗄️ Base de données

Le projet utilise **MariaDB** avec Prisma.

Les services (InfluenceCore, Keycloak, Helpdesk, FOSSBilling) peuvent partager la **même instance MariaDB** (bases séparées).

---

## 🛠️ Commandes disponibles

```bash
# Développement (sans Docker)
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter ESLint

# Prisma / DB
npm run db:generate  # Générer le client Prisma
npm run db:push      # Appliquer le schéma (dev)
npm run db:migrate   # Créer une migration
npm run db:studio    # Interface graphique Prisma

# Docker
docker compose -f docker/docker-compose.local.yml up -d
docker compose -f docker/docker-compose.local.yml down
```

---

## 📁 Structure du projet

```text
influencecore/
├── 📚 documentation/      # Toute la documentation
├── 🐳 docker/            # Configuration Docker
├── app/                  # Next.js App Router
│   ├── admin/           # Pages administration
│   ├── api/             # Routes API
│   ├── dashboard/       # Dashboard client
│   ├── ideas/           # Module Idées
│   ├── scripts/         # Module Scripts
│   ├── calendar/        # Calendrier
│   └── notes/           # Notes rapides
├── components/          # Composants React
│   ├── admin/          # Composants admin
│   ├── client/         # Composants client
│   ├── auth/           # Authentification
│   ├── ideas/          # Composants Idées
│   ├── scripts/        # Composants Scripts
│   ├── calendar/       # Composants Calendrier
│   ├── notes/          # Composants Notes
│   └── common/         # Composants communs
├── lib/                 # Utilitaires
│   ├── prisma.ts       # Client Prisma
│   └── auth.ts         # Helpers auth
├── prisma/              # Configuration Prisma
│   └── schema.prisma   # Schéma DB
├── types/               # Types TypeScript
└── scripts/             # Scripts utilitaires
```

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé) ⭐

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

📖 **Guide complet** : Voir [`documentation/GUIDE_COMPLET.md`](documentation/GUIDE_COMPLET.md) - Section Déploiement

---

## 📚 Documentation

- 📖 **[`documentation/INDEX_DOCUMENTATION.md`](documentation/INDEX_DOCUMENTATION.md)** - Index de la documentation
- 🚀 **[`documentation/CAPROVER_DEPLOY.md`](documentation/CAPROVER_DEPLOY.md)** - Déploiement CapRover
- 🔌 **[`documentation/INTEGRATIONS_HELPDESK_FOSSBILLING.md`](documentation/INTEGRATIONS_HELPDESK_FOSSBILLING.md)** - Intégrations Helpdesk + FOSSBilling
- 🔌 **[`documentation/DOCUMENTATION_API.md`](documentation/DOCUMENTATION_API.md)** - **Documentation complète de toutes les API**
- 🐳 **[`docker/README.md`](docker/README.md)** - Stack Docker

---

## 🔒 Sécurité

- ✅ Mots de passe hashés (bcryptjs)
- ✅ Sessions JWT sécurisées
- ✅ Protection CSRF
- ✅ Validation des données
- ✅ Variables d'environnement pour secrets
- ✅ Protection des routes

---

## 🧪 Test de l'application

1. **Démarrer la stack** (Docker recommandé)
2. **Se connecter** via le bouton **Keycloak** (SSO)
3. **Créer une idée**: `/ideas`
4. **Créer un script**: `/scripts`
5. **Voir le calendrier**: `/calendar`
6. **Créer des notes**: `/notes`

---

## 🐛 Dépannage

### Erreur : "Can't reach database server"

- Vérifie que MariaDB tourne (Docker) et que `DATABASE_URL` est correcte
- Voir `docker/README.md`

### Erreur Prisma

```bash
npm run db:generate
npm run db:push
```

### Port 3000 utilisé

```bash
npm run dev -- -p 3001
```

📖 Plus d’aide: `documentation/COMMANDES_DIAGNOSTIC.md`

---

## 🤝 Contribution

Ce projet est développé pour Studio Velysion CreatorHub.

---

## 📄 Licence

Propriétaire - Studio Velysion CreatorHub

---

## 🎯 Roadmap

- [x] V1 - Modules de base (Idées, Scripts, Calendrier, Notes)
- [ ] V2 - Moodboards
- [ ] V2 - Sponsors & CRM
- [ ] V2 - Collaborations
- [ ] V2 - Analytics YouTube/Twitch
- [ ] V3 - Mobile App
- [ ] V3 - API publique

---

## 💬 Support

Pour toute question ou problème, consultez la documentation dans le dossier du projet.

---

Fait avec ❤️ pour les créateurs de contenu
