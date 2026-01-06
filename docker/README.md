# 🐳 Docker - InfluenceCore

Ce dossier contient tous les fichiers de configuration Docker pour InfluenceCore.

## 📁 Fichiers

- **docker-compose.yml** - Configuration Docker principale (production)
- **docker-compose.local.yml** - Configuration Docker pour développement local

## 🚀 Utilisation

### Production
```bash
docker-compose -f docker/docker-compose.yml up -d
```

### Développement Local
```bash
docker-compose -f docker/docker-compose.local.yml up -d
```

### Tests
```bash
# (supprimé) Les anciens fichiers de test ont été retirés.
```

## 📝 Notes

Les fichiers Docker sont utilisés pour :
- **Une seule instance PostgreSQL** (InfluenceCore + Keycloak + services compatibles)
- **Keycloak** (gestion des rôles + SSO)
- Déploiement en production / local

### Démarrage (local)

```bash
docker compose -f docker/docker-compose.local.yml up -d
```

Avant, crée `docker/.env` (non versionné) à partir de `docker/env.example` et mets tes valeurs.

Puis configure `DATABASE_URL` côté InfluenceCore:

```env
DATABASE_URL="postgresql://postgres:change-me@localhost:5432/influencecore?schema=public"
```

