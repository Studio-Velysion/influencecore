#!/bin/bash

# Script de déploiement automatique pour le serveur VPS
# Ce script est exécuté automatiquement via GitHub Actions ou manuellement

set -e  # Arrêter en cas d'erreur

echo "🚀 Démarrage du déploiement..."

# Variables (à adapter selon votre configuration)
APP_DIR="${VPS_APP_PATH:-/var/www/influencecore}"
BRANCH="${GIT_BRANCH:-main}"

# Aller dans le répertoire de l'application
cd "$APP_DIR"

echo "📥 Mise à jour du code depuis GitHub..."
git fetch origin
git reset --hard origin/$BRANCH
git clean -fd

echo "📦 Installation des dépendances..."
npm ci --production

echo "🗄️ Génération du client Prisma..."
npm run db:generate

echo "🔨 Build de l'application..."
npm run build

echo "🔄 Redémarrage de l'application..."
# Utiliser PM2 si disponible, sinon utiliser systemd ou autre
if command -v pm2 &> /dev/null; then
    pm2 restart influencecore || pm2 start npm --name influencecore -- start
    echo "✅ Application redémarrée avec PM2"
elif systemctl is-active --quiet influencecore; then
    sudo systemctl restart influencecore
    echo "✅ Application redémarrée avec systemd"
else
    echo "⚠️  Aucun gestionnaire de processus trouvé. Redémarrez manuellement."
fi

echo "✨ Déploiement terminé avec succès!"

