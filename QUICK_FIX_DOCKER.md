# 🔧 Correction Docker Compose

## Problème

L'erreur `docker-compose: command not found` est due à la nouvelle version de Docker qui utilise `docker compose` (sans tiret) au lieu de `docker-compose`.

## ✅ Solution

Les scripts ont été corrigés. Sur votre serveur, exécutez :

```bash
cd /var/www/influencecore

# Mettre à jour le code
git pull origin main

# Continuer l'installation
cd /var/www/influencecore
docker compose -f docker-compose.db.yml up -d
```

Ou relancez le script complet :

```bash
cd /var/www/influencecore
git pull origin main
chmod +x scripts/auto-deploy-server.sh
sudo ./scripts/auto-deploy-server.sh
```

Le script va maintenant utiliser `docker compose` au lieu de `docker-compose`.

