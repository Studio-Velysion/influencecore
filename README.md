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

### Installation en 3 étapes

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer Supabase et installer la base de données**
   ```bash
   npm run db:setup
   ```
   > Cette commande vous guidera pour configurer Supabase et créer automatiquement toutes les tables.

3. **Lancer l'application**
   ```bash
   npm run dev
   ```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

📖 **Guide complet** : Voir [`documentation/GUIDE_COMPLET.md`](documentation/GUIDE_COMPLET.md)

---

## 🗄️ Base de données

Ce projet utilise **Supabase** (PostgreSQL dans le cloud) - Gratuit jusqu'à 500MB.

📖 **Guide complet** : Voir [`documentation/GUIDE_COMPLET.md`](documentation/GUIDE_COMPLET.md)

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
npm run db:setup     # Installation automatique (Supabase + tables + utilisateurs test)
npm run db:generate  # Générer le client Prisma
npm run db:push      # Appliquer le schéma (dev)
npm run db:migrate   # Créer une migration
npm run db:studio    # Interface graphique Prisma
npm run test:create-users  # Créer les utilisateurs de test
```

---

## 📁 Structure du projet

```
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

- 📖 **[`documentation/GUIDE_COMPLET.md`](documentation/GUIDE_COMPLET.md)** - **Guide unique et complet** (Installation, Configuration, Déploiement, Dépannage)
- 🔌 **[`documentation/DOCUMENTATION_API.md`](documentation/DOCUMENTATION_API.md)** - **Documentation complète de toutes les API**
- 📁 **[`documentation/README.md`](documentation/README.md)** - **Index de toute la documentation**

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

### Erreur : "Can't reach database server"
- Vérifiez que votre fichier `.env.local` existe
- Vérifiez que `DATABASE_URL` est correcte
- Vérifiez que votre projet Supabase est actif
- Consultez [`documentation/GUIDE_COMPLET.md`](documentation/GUIDE_COMPLET.md) pour la configuration Supabase

### Erreur Prisma
```bash
npm run db:generate
npm run db:push
```

### Port 3000 utilisé
```bash
npm run dev -- -p 3001
```

📖 **Plus d'aide** : Voir la section Dépannage dans [`documentation/GUIDE_COMPLET.md`](documentation/GUIDE_COMPLET.md)

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

