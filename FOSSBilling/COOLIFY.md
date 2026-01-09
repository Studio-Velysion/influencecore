## Déploiement sur Coolify (ou “Coolifier”)

Ce repo est un monorepo (frontend Next + backend Nest + workers/cron).  
Pour Coolify, le plus simple est **un seul container** qui expose **une seule URL**, via Nginx :

- `/` → frontend (Next) sur `localhost:4200`
- `/api/*` → backend (Nest) sur `localhost:3000`
- `/uploads/*` → volume `/uploads` (si `STORAGE_PROVIDER=local`)

### Fichiers ajoutés
- `Dockerfile` : image prod “Coolify-ready”
- `docker-compose.coolify.yml` : compose prod (avec Postgres + Redis)
- `var/docker/nginx.coolify.conf` : nginx en écoute sur **80**

### Variables d’environnement minimales (obligatoires)
À définir dans Coolify (Build + Runtime si possible) :

- `FRONTEND_URL` : URL publique (ex: `https://postiz.mondomaine.com`)
- `MAIN_URL` : idem (souvent même valeur)
- `NEXT_PUBLIC_BACKEND_URL` : doit finir par `/api` (ex: `https://postiz.mondomaine.com/api`)
- `DATABASE_URL` : ex: `postgresql://user:pass@postgres:5432/db?schema=public`
- `REDIS_URL` : ex: `redis://redis:6379`
- `JWT_SECRET` : une chaîne longue et aléatoire
- `STORAGE_PROVIDER` : `local` (ou cloudflare si tu configures R2)

### Déploiement via docker-compose
Dans Coolify, utilise le fichier `docker-compose.coolify.yml`.

Si tu testes en local :

```bash
docker compose -f docker-compose.coolify.yml up -d --build
```

### Notes
- Le container expose **le port 80** (Coolify s’occupe du HTTPS).
- Les fichiers uploadés sont persistés dans le volume `postiz-uploads`.
- `pnpm run pm2-run` lance aussi `prisma db push` au démarrage.


