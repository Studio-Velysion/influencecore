# 📁 Structure du Projet InfluenceCore

Ce document décrit l'organisation complète du projet InfluenceCore après réorganisation.

## 🗂️ Structure des Dossiers

```
InfluenceCore/
├── 📚 documentation/          # Toute la documentation du projet
│   ├── README.md             # Index de la documentation
│   ├── GUIDE_COMPLET.md      # Guide d'installation complet
│   ├── DOCUMENTATION_API.md  # Documentation de toutes les API
│   └── ...                   # Autres guides et documentations
│
├── 🐳 docker/                # Fichiers de configuration Docker
│   ├── README.md             # Guide Docker
│   ├── docker-compose.yml    # Configuration production
│   ├── docker-compose.local.yml    # Configuration développement
│   └── docker-compose.test.yml     # Configuration tests
│
├── 📱 app/                    # Next.js App Router (Pages & Routes)
│   ├── admin/                # Pages administration
│   │   ├── billing/          # Gestion billing
│   │   ├── cms/              # CMS (page d'accueil, tarifs)
│   │   ├── roles/            # Rôles & permissions
│   │   ├── users/            # Gestion utilisateurs
│   │   └── settings/         # Paramètres admin
│   │
│   ├── api/                  # Routes API Next.js
│   │   ├── admin/            # API administration
│   │   ├── auth/             # API authentification
│   │   ├── calendar/         # API calendrier
│   │   ├── ideas/            # API idées vidéos
│   │   ├── notes/            # API notes
│   │   ├── scripts/          # API scripts
│   │   ├── public/           # API publique
│   │   ├── stripe/           # API Stripe
│   │   └── user/             # API utilisateur
│   │
│   ├── dashboard/            # Dashboard client
│   ├── ideas/               # Pages idées vidéos
│   ├── scripts/              # Pages scripts
│   ├── calendar/            # Page calendrier
│   ├── notes/               # Pages notes
│   ├── pricing/             # Page tarifs publique
│   ├── login/               # Page connexion
│   ├── register/            # Page inscription
│   └── subscribe/           # Pages abonnement
│
├── 🧩 components/            # Composants React
│   ├── admin/               # Composants administration
│   │   ├── billing/        # Composants billing
│   │   ├── cms/            # Composants CMS
│   │   ├── layout/         # Layout admin
│   │   ├── roles/          # Composants rôles
│   │   ├── settings/       # Composants paramètres
│   │   └── users/          # Composants utilisateurs
│   │
│   ├── client/             # Composants client
│   │   ├── dashboard/      # Composants dashboard
│   │   └── layout/         # Layout client
│   │
│   ├── auth/               # Composants authentification
│   ├── calendar/           # Composants calendrier
│   ├── common/             # Composants communs
│   ├── ideas/              # Composants idées
│   ├── notes/               # Composants notes
│   ├── scripts/             # Composants scripts
│   ├── public/              # Composants pages publiques
│   └── providers/           # Providers React
│
├── 🔧 lib/                   # Bibliothèques et utilitaires
│   ├── api.ts               # Helpers API
│   ├── auth.ts              # Helpers authentification
│   ├── permissions.ts       # Système de permissions
│   ├── prisma.ts            # Client Prisma
│   ├── stripe.ts            # Helpers Stripe
│   ├── subscriptions.ts     # Helpers abonnements
│   ├── theme/               # Configuration thème
│   ├── utils.ts             # Utilitaires généraux
│   └── validations.ts       # Validations
│
├── 🗄️ prisma/                # Configuration Prisma
│   ├── schema.prisma        # Schéma base de données principal
│   └── schema.test.prisma   # Schéma base de données test
│
├── 📜 scripts/               # Scripts utilitaires
│   ├── setup-database.ts    # Configuration base de données
│   ├── setup-test-db.ts     # Configuration DB test
│   ├── create-test-users.ts # Création utilisateurs test
│   └── ...                  # Autres scripts
│
├── 🎣 hooks/                 # Hooks React personnalisés
│   ├── useClickOutside.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
│
├── 📝 types/                  # Types TypeScript
│   ├── admin.ts
│   ├── ideas.ts
│   ├── notes.ts
│   ├── scripts.ts
│   └── subscriptions.ts
│
└── 📄 Fichiers racine
    ├── README.md            # Documentation principale
    ├── STRUCTURE_PROJET.md  # Ce fichier
    ├── package.json         # Dépendances npm
    ├── tsconfig.json        # Configuration TypeScript
    ├── tailwind.config.ts   # Configuration Tailwind
    └── next.config.js       # Configuration Next.js
```

## 📋 Catégories par Thème

### 👨‍💼 Administration
- **Pages** : `app/admin/`
- **Composants** : `components/admin/`
- **API** : `app/api/admin/`

### 👤 Client
- **Pages** : `app/dashboard/`, `app/ideas/`, `app/scripts/`, `app/calendar/`, `app/notes/`
- **Composants** : `components/client/`
- **API** : `app/api/ideas/`, `app/api/scripts/`, `app/api/notes/`, `app/api/calendar/`, `app/api/user/`

### 🔌 API
- **Routes** : `app/api/`
- **Documentation** : `documentation/DOCUMENTATION_API.md`
- Toutes les routes API sont documentées dans un seul fichier centralisé

### 📚 Documentation
- **Dossier** : `documentation/`
- Contient tous les guides, spécifications et documentations

### 🐳 Docker
- **Dossier** : `docker/`
- Contient tous les fichiers de configuration Docker

## 🔍 Navigation Rapide

- **Documentation complète** : [`documentation/README.md`](documentation/README.md)
- **API** : [`documentation/DOCUMENTATION_API.md`](documentation/DOCUMENTATION_API.md)
- **Docker** : [`docker/README.md`](docker/README.md)

