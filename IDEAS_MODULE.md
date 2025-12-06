# 📝 Module Idées Vidéos - InfluenceCore

## ✅ Fonctionnalités implémentées

### 1. API Routes CRUD
- **GET `/api/ideas`** - Récupérer toutes les idées de l'utilisateur (avec filtrage par statut)
- **POST `/api/ideas`** - Créer une nouvelle idée
- **GET `/api/ideas/[id]`** - Récupérer une idée spécifique avec ses scripts
- **PUT `/api/ideas/[id]`** - Mettre à jour une idée
- **DELETE `/api/ideas/[id]`** - Supprimer une idée

### 2. Vue Kanban
- **Page**: `/ideas`
- Affichage des idées organisées par statut (colonnes)
- 6 statuts : Idée, Écriture, Tournage, Montage, Programmée, Publiée
- Compteur d'idées par statut
- Navigation horizontale avec scroll

### 3. Page de détail
- **Page**: `/ideas/[id]`
- Affichage complet d'une idée
- Mode édition inline
- Suppression avec confirmation
- Affichage des scripts associés
- Lien vers création de script

### 4. Composants
- `IdeaCard` - Carte d'idée pour le Kanban
- `KanbanBoard` - Vue Kanban complète
- `CreateIdeaModal` - Modal de création d'idée
- `IdeaDetail` - Page de détail avec édition

### 5. Navigation
- Menu de navigation ajouté au dashboard
- Liens vers toutes les sections principales
- Navigation cohérente sur toutes les pages

## 📁 Structure des fichiers

```
app/
├── api/
│   └── ideas/
│       ├── route.ts              # GET, POST /api/ideas
│       └── [id]/route.ts         # GET, PUT, DELETE /api/ideas/[id]
├── ideas/
│   ├── page.tsx                  # Liste Kanban
│   └── [id]/page.tsx             # Détail d'une idée
└── dashboard/
    └── page.tsx                  # Dashboard avec navigation

components/
└── ideas/
    ├── IdeaCard.tsx              # Carte d'idée
    ├── KanbanBoard.tsx           # Vue Kanban
    ├── CreateIdeaModal.tsx       # Modal création
    └── IdeaDetail.tsx            # Détail avec édition

types/
└── ideas.ts                      # Types TypeScript
```

## 🎨 Fonctionnalités UI

### Vue Kanban
- Colonnes par statut avec compteur
- Cartes cliquables vers le détail
- Badge de statut coloré
- Affichage des métadonnées (plateforme, format, priorité, date)
- Indicateur du nombre de scripts associés
- Bouton "Nouvelle idée" avec modal

### Page de détail
- Informations complètes de l'idée
- Mode édition avec formulaire
- Suppression avec double confirmation
- Section scripts associés
- Lien rapide vers création de script

### Modal de création
- Formulaire complet avec validation
- Champs : titre, concept, plateforme, format, statut, priorité, date cible
- Gestion des erreurs
- Feedback utilisateur

## 🔄 Workflow

1. **Création** : Utilisateur clique sur "Nouvelle idée" → Modal s'ouvre → Formulaire rempli → Idée créée → Kanban mis à jour
2. **Visualisation** : Clic sur une carte → Page de détail → Affichage complet
3. **Modification** : Clic sur "Modifier" → Formulaire inline → Sauvegarde → Mise à jour
4. **Suppression** : Clic sur "Supprimer" → Confirmation → Suppression → Redirection vers liste

## 📊 Données gérées

Chaque idée contient :
- **Titre** (obligatoire)
- **Concept** (description textuelle)
- **Plateforme** (YouTube, Twitch, TikTok, Instagram, Autre)
- **Format** (Long, Short, Live)
- **Statut** (Idée, Écriture, Tournage, Montage, Programmée, Publiée)
- **Priorité** (Haute, Moyenne, Basse)
- **Date cible** (optionnelle)
- **Scripts associés** (relation avec VideoScript)

## 🧪 Test du module

### 1. Créer une idée
1. Aller sur `/ideas`
2. Cliquer sur "+ Nouvelle idée"
3. Remplir le formulaire
4. Cliquer sur "Créer l'idée"
5. Vérifier l'apparition dans la colonne correspondante

### 2. Voir le détail
1. Cliquer sur une carte d'idée
2. Vérifier l'affichage de toutes les informations
3. Vérifier la section scripts (vide au début)

### 3. Modifier une idée
1. Sur la page de détail, cliquer sur "Modifier"
2. Modifier les champs
3. Cliquer sur "Enregistrer"
4. Vérifier la mise à jour

### 4. Changer le statut
1. Dans le mode édition, changer le statut
2. Sauvegarder
3. Retourner à `/ideas`
4. Vérifier que l'idée a changé de colonne

### 5. Supprimer une idée
1. Sur la page de détail, cliquer sur "Supprimer"
2. Confirmer la suppression
3. Vérifier la redirection vers `/ideas`
4. Vérifier la disparition de l'idée

## 🔗 Intégrations

- ✅ **Authentification** : Toutes les routes sont protégées
- ✅ **Base de données** : Utilise Prisma avec le modèle VideoIdea
- ✅ **Scripts** : Affichage des scripts associés (module à venir)
- ✅ **Navigation** : Menu unifié sur toutes les pages

## 🚀 Prochaines étapes

Le module Idées Vidéos est complet. Prochaines étapes :
1. Module Scripts (création et édition de scripts)
2. Association scripts ↔ idées
3. Calendrier éditorial
4. Notes rapides

## 🐛 Dépannage

### Les idées ne s'affichent pas
- Vérifier la connexion à la base de données
- Vérifier que l'utilisateur est authentifié
- Vérifier les logs de la console navigateur

### Erreur lors de la création
- Vérifier que le titre est rempli (obligatoire)
- Vérifier les logs serveur
- Vérifier les permissions de la base de données

### Le Kanban ne se met pas à jour
- Rafraîchir la page
- Vérifier que `fetchIdeas` est appelé après création
- Vérifier les erreurs dans la console

