# 🎬 InfluenceCore

**Plateforme SaaS tout-en-un pour créateurs de contenu**

Organisez vos idées, scripts et workflow vidéo en un seul endroit. Conçu pour YouTubeurs, Streamers, Vidéastes et Influenceurs.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

---

## ✨ Fonctionnalités

### ✅ Modules V1 (Complets)

- 🔐 **Authentification** - Register, Login, Logout sécurisés
- 📊 **Dashboard** - Vue d'ensemble du workflow créateur
- 💡 **Idées Vidéos** - Vue Kanban, gestion complète des idées
- 📝 **Scripts** - Éditeur structuré avec sections modulaires
- 📅 **Calendrier éditorial** - Planification visuelle mensuelle
- 📌 **Notes rapides** - Capture instantanée avec tags

### 🚀 Modules V2 (À venir)

- 🎨 Moodboards (board visuel type Milanote)
- 🤝 Sponsors (CRM influence + contrats)
- 👥 Collaborations (projets avec d'autres créateurs)
- 📈 Analytics (intégration API YouTube/Twitch)

---

## 🚀 Stack Technique

- **Frontend**: Next.js 14 + React 18 + TypeScript + TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Email/Password)
- **Deployment**: Vercel / Railway / VPS

---

## 📦 Installation rapide

### 1. Cloner et installer

```bash
git clone <votre-repo>
cd InfluenceCore
npm install
```

### 2. Configurer la base de données

Copiez `.env.example` vers `.env` et configurez :

```bash
cp .env.example .env
```

Éditez `.env` avec vos identifiants PostgreSQL :

```env
DATABASE_URL="postgresql://user:password@host:5432/influencecore?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-32-caracteres"
```

### 3. Initialiser la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables
npm run db:push
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

---

## 🗄️ Base de données

### Options de serveur PostgreSQL

1. **PostgreSQL Local** - Installation locale
2. **Supabase** - Cloud gratuit (500MB) ⭐ Recommandé
3. **Neon** - Cloud gratuit (3GB)
4. **VPS** - Votre propre serveur

📖 **Guide complet** : Voir `DATABASE_SETUP.md` et `VPS_SETUP.md`

### Modèles de données

- **User** - Utilisateurs et authentification
- **VideoIdea** - Idées de vidéos avec workflow
- **VideoScript** - Scripts structurés avec checklists
- **QuickNote** - Notes rapides avec tags

---

## 🛠️ Commandes disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter ESLint

# Base de données
npm run db:generate  # Générer le client Prisma
npm run db:push      # Appliquer le schéma (dev)
npm run db:migrate   # Créer une migration
npm run db:studio    # Interface graphique Prisma
```

---

## 📁 Structure du projet

```
influencecore/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard
│   ├── ideas/            # Module Idées
│   ├── scripts/          # Module Scripts
│   ├── calendar/          # Calendrier
│   └── notes/            # Notes rapides
├── components/            # Composants React
│   ├── auth/            # Authentification
│   ├── ideas/            # Composants Idées
│   ├── scripts/          # Composants Scripts
│   ├── calendar/         # Composants Calendrier
│   ├── notes/            # Composants Notes
│   └── common/           # Composants communs
├── lib/                   # Utilitaires
│   ├── prisma.ts         # Client Prisma
│   └── auth.ts           # Helpers auth
├── prisma/
│   └── schema.prisma     # Schéma DB
├── types/                 # Types TypeScript
└── public/               # Assets statiques
```

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé) ⭐

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

📖 **Guide complet** : Voir `DEPLOYMENT.md`

### Option 2 : Railway

1. Créez un projet sur Railway
2. Ajoutez PostgreSQL
3. Déployez depuis Git

### Option 3 : VPS avec Docker

1. Utilisez `docker-compose.yml`
2. Lancez `setup-vps.sh`
3. Configurez Nginx

📖 **Guide VPS** : Voir `VPS_SETUP.md`

---

## 📚 Documentation

- 📖 `INSTALLATION.md` - Guide d'installation détaillé
- 🗄️ `DATABASE_SETUP.md` - Configuration base de données
- 🖥️ `VPS_SETUP.md` - Configuration serveur VPS
- 🚀 `DEPLOYMENT.md` - Guide de déploiement
- 🔐 `AUTHENTICATION.md` - Détails authentification
- 💡 `IDEAS_MODULE.md` - Module Idées Vidéos
- ✅ `COMPLETE_MODULES.md` - Récapitulatif complet

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

1. **Créer un compte** : `/register`
2. **Créer une idée** : `/ideas` → "+ Nouvelle idée"
3. **Créer un script** : `/scripts` → "+ Nouveau script"
4. **Voir le calendrier** : `/calendar`
5. **Créer des notes** : Dashboard widget ou `/notes`

---

## 🐛 Dépannage

### Erreur de connexion DB
- Vérifiez `DATABASE_URL` dans `.env`
- Vérifiez que PostgreSQL tourne
- Testez la connexion : `psql -U user -d influencecore`

### Erreur Prisma
```bash
npm run db:generate
npm run db:push
```

### Port 3000 utilisé
```bash
npm run dev -- -p 3001
```

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

**Fait avec ❤️ pour les créateurs de contenu**

