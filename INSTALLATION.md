# 📦 Guide d'Installation - InfluenceCore

## Prérequis

- Node.js 18+ installé
- PostgreSQL installé et en cours d'exécution
- npm ou yarn

## Étapes d'installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/influencecore?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# App
NODE_ENV="development"
```

**Important** :
- Remplacez `user`, `password` et `influencecore` par vos identifiants PostgreSQL
- Pour générer `NEXTAUTH_SECRET`, utilisez : `openssl rand -base64 32` (ou un générateur en ligne)

### 3. Créer la base de données PostgreSQL

Connectez-vous à PostgreSQL et créez la base de données :

```sql
CREATE DATABASE influencecore;
```

Ou via la ligne de commande :

```bash
createdb influencecore
```

### 4. Générer le client Prisma

```bash
npm run db:generate
```

Cette commande génère le client TypeScript Prisma basé sur votre schéma.

### 5. Appliquer le schéma à la base de données

**Option A - Développement rapide (db:push) :**
```bash
npm run db:push
```

**Option B - Migration formelle (recommandé pour production) :**
```bash
npm run db:migrate
```

Cette commande vous demandera un nom pour la migration (ex: "init").

### 6. Vérifier la base de données (optionnel)

Ouvrez Prisma Studio pour visualiser votre base de données :

```bash
npm run db:studio
```

Cela ouvrira une interface graphique sur http://localhost:5555

### 7. Lancer le serveur de développement

```bash
npm run dev
```

Le serveur sera accessible sur [http://localhost:3000](http://localhost:3000)

## ✅ Checklist de vérification

- [ ] Les dépendances sont installées (`node_modules` existe)
- [ ] Le fichier `.env` est créé avec `DATABASE_URL` valide
- [ ] La base de données PostgreSQL `influencecore` existe
- [ ] Le client Prisma est généré (`npm run db:generate` exécuté)
- [ ] Le schéma est appliqué (`npm run db:push` ou `db:migrate` exécuté)
- [ ] Le serveur démarre sans erreur (`npm run dev`)

## 🐛 Dépannage

### Erreur de connexion à la base de données

- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez les identifiants dans `DATABASE_URL`
- Testez la connexion : `psql -U user -d influencecore`

### Erreur Prisma Client

- Exécutez `npm run db:generate` après chaque modification du schéma
- Supprimez `node_modules/.prisma` et régénérez si nécessaire

### Port 3000 déjà utilisé

- Changez le port : `npm run dev -- -p 3001`
- Ou arrêtez le processus utilisant le port 3000

## 📚 Prochaines étapes

Une fois l'installation terminée, vous pouvez :
1. Commencer à développer les pages d'authentification
2. Créer le dashboard principal
3. Implémenter les modules CRUD

