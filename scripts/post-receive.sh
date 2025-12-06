#!/bin/bash

# Git hook pour déploiement automatique après un git push
# À placer dans: /var/www/influencecore.git/hooks/post-receive
# Rendre exécutable: chmod +x post-receive

set -e

# Répertoire de travail
WORK_TREE="/var/www/influencecore"
GIT_DIR="/var/www/influencecore.git"

# Vérifier que nous sommes sur la branche main
while read oldrev newrev refname; do
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)
    if [ "$branch" = "main" ]; then
        echo "🚀 Déploiement automatique déclenché..."
        
        # Checkout les fichiers
        git --work-tree=$WORK_TREE --git-dir=$GIT_DIR checkout -f main
        
        # Aller dans le répertoire de travail
        cd $WORK_TREE
        
        # Installer les dépendances
        echo "📦 Installation des dépendances..."
        npm ci --production
        
        # Générer Prisma
        echo "🗄️ Génération Prisma..."
        npm run db:generate
        
        # Build
        echo "🔨 Build de l'application..."
        npm run build
        
        # Redémarrer l'application
        echo "🔄 Redémarrage..."
        if command -v pm2 &> /dev/null; then
            pm2 restart influencecore || pm2 start npm --name influencecore -- start
        fi
        
        echo "✅ Déploiement terminé!"
    fi
done

