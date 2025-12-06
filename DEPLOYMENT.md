# 🚀 Guide de Déploiement - InfluenceCore

Guide complet pour déployer InfluenceCore en production.

---

## 📋 Prérequis

- ✅ Base de données PostgreSQL configurée (VPS, Supabase, Neon, etc.)
- ✅ Compte sur une plateforme de déploiement (Vercel, Railway, etc.)
- ✅ Domaine (optionnel mais recommandé)
- ✅ Variables d'environnement configurées

---

## 🌐 Option 1 : Vercel (Recommandé pour Next.js) ⭐

**Avantages :**
- Gratuit pour commencer
- Optimisé pour Next.js
- Déploiement automatique depuis Git
- CDN global
- SSL automatique

### Étapes de déploiement

1. **Préparer le projet :**
   ```bash
   # S'assurer que tout fonctionne en local
   npm run build
   ```

2. **Créer un compte Vercel :**
   - Allez sur https://vercel.com
   - Connectez-vous avec GitHub/GitLab/Bitbucket

3. **Importer le projet :**
   - Cliquez sur "New Project"
   - Importez votre repository
   - Vercel détecte automatiquement Next.js

4. **Configurer les variables d'environnement :**
   - Dans les paramètres du projet → Environment Variables
   - Ajoutez :
     ```
     DATABASE_URL=votre_connection_string
     NEXTAUTH_URL=https://votre-domaine.vercel.app
     NEXTAUTH_SECRET=votre_secret
     NODE_ENV=production
     ```

5. **Déployer :**
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes
   - Votre app est en ligne !

**Liens :**
- Vercel : https://vercel.com
- Documentation : https://vercel.com/docs

---

## 🚂 Option 2 : Railway

**Avantages :**
- Simple à utiliser
- Base de données PostgreSQL incluse
- Déploiement depuis Git

### Étapes

1. **Créer un compte :**
   - https://railway.app
   - Connectez-vous avec GitHub

2. **Créer un nouveau projet :**
   - "New Project" → "Deploy from GitHub repo"
   - Sélectionnez votre repository

3. **Ajouter PostgreSQL :**
   - "New" → "Database" → "PostgreSQL"
   - Railway crée automatiquement la base

4. **Configurer les variables :**
   - Railway détecte automatiquement `DATABASE_URL`
   - Ajoutez `NEXTAUTH_URL` et `NEXTAUTH_SECRET`

5. **Déployer :**
   - Railway déploie automatiquement
   - Votre app est accessible via un URL Railway

**Liens :**
- Railway : https://railway.app
- Documentation : https://docs.railway.app

---

## 🐳 Option 3 : VPS avec Docker

**Pour un contrôle total sur votre propre serveur.**

### Prérequis

- VPS avec Docker installé
- PostgreSQL configuré (voir `VPS_SETUP.md`)
- Domaine pointant vers votre VPS

### Étapes

1. **Build l'image Docker :**

Créez un `Dockerfile` :
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

2. **Modifier `next.config.js` :**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Pour Docker
}

module.exports = nextConfig
```

3. **Créer `docker-compose.prod.yml` :**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NODE_ENV=production
    depends_on:
      - postgres
    restart: always

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: influencecore
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: influencecore
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:
```

4. **Déployer :**
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

5. **Configurer Nginx (reverse proxy) :**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Configuration SSL/HTTPS

### Avec Vercel/Railway
- SSL automatique inclus
- Pas de configuration nécessaire

### Sur VPS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir un certificat
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

---

## 📝 Checklist de déploiement

### Avant le déploiement

- [ ] Code testé en local
- [ ] `npm run build` fonctionne sans erreur
- [ ] Base de données configurée et accessible
- [ ] Variables d'environnement préparées
- [ ] `.env` ne contient pas de secrets (utiliser les variables d'environnement de la plateforme)

### Configuration

- [ ] `DATABASE_URL` configuré
- [ ] `NEXTAUTH_URL` pointant vers l'URL de production
- [ ] `NEXTAUTH_SECRET` généré et sécurisé
- [ ] `NODE_ENV=production`

### Après le déploiement

- [ ] Application accessible
- [ ] Connexion à la base de données fonctionne
- [ ] Authentification fonctionne
- [ ] Toutes les pages chargent correctement
- [ ] SSL/HTTPS activé
- [ ] Backup de la base de données configuré

---

## 🔄 Déploiement continu (CI/CD)

### Avec Vercel
- Automatique depuis Git
- Déploie à chaque push sur `main`

### Avec GitHub Actions

Créez `.github/workflows/deploy.yml` :
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      # Ajoutez vos étapes de déploiement ici
```

---

## 🐛 Dépannage

### Erreur de build

```bash
# Vérifier les erreurs localement
npm run build

# Vérifier les logs de déploiement
# Sur Vercel : Dashboard → Deployments → Logs
```

### Erreur de connexion DB

- Vérifiez que `DATABASE_URL` est correct
- Vérifiez que la base de données accepte les connexions externes
- Vérifiez le firewall

### Erreur NextAuth

- Vérifiez que `NEXTAUTH_URL` correspond à l'URL de production
- Vérifiez que `NEXTAUTH_SECRET` est défini
- Vérifiez les cookies dans les DevTools

---

## 📊 Monitoring et Analytics

### Vercel Analytics
- Inclus dans Vercel Pro
- Ou utilisez Vercel Analytics (gratuit)

### Sentry (Gestion d'erreurs)
```bash
npm install @sentry/nextjs
```

### Logs
- Vercel : Dashboard → Logs
- Railway : Dashboard → Logs
- VPS : `docker logs influencecore-app`

---

## 🔗 Liens utiles

- **Vercel** : https://vercel.com
- **Railway** : https://railway.app
- **Netlify** : https://netlify.com
- **Docker** : https://docs.docker.com
- **Let's Encrypt** : https://letsencrypt.org
- **Next.js Deployment** : https://nextjs.org/docs/deployment

---

## ✅ Votre application est prête !

Une fois déployée, votre application InfluenceCore sera accessible publiquement et prête à être utilisée par vos créateurs de contenu ! 🎉

