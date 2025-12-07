#!/bin/bash

# Script pour démarrer l'application avec PM2
# Usage: ./scripts/start-app.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

APP_DIR="/var/www/influencecore"
APP_NAME="influencecore"

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

cd "$APP_DIR"

# Vérifier que .env existe
if [ ! -f ".env" ]; then
    log_error "Le fichier .env n'existe pas!"
    exit 1
fi

# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null; then
    log_error "PM2 n'est pas installé"
    log_info "Installez PM2 avec: npm install -g pm2"
    exit 1
fi

# Vérifier si l'application tourne déjà
if pm2 list | grep -q "$APP_NAME"; then
    log_warning "L'application est déjà en cours d'exécution"
    log_info "Statut actuel:"
    pm2 status | grep "$APP_NAME"
    echo ""
    read -p "Voulez-vous redémarrer l'application? (O/n): " RESTART
    if [ "$RESTART" != "n" ] && [ "$RESTART" != "N" ]; then
        log_info "Redémarrage de l'application..."
        pm2 restart "$APP_NAME" --update-env
        log_success "Application redémarrée"
    else
        log_info "Application laissée en cours d'exécution"
        exit 0
    fi
else
    log_info "Démarrage de l'application..."
    
    # Vérifier si ecosystem.config.js existe
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
        log_success "Application démarrée avec ecosystem.config.js"
    else
        # Charger les variables d'environnement
        export $(cat .env | grep -v '^#' | xargs)
        
        pm2 start npm --name "$APP_NAME" -- start
        log_success "Application démarrée avec npm start"
    fi
    
    pm2 save
    log_success "Configuration PM2 sauvegardée"
fi

# Attendre un peu
sleep 2

# Afficher le statut
echo ""
log_success "=========================================="
log_success "✅ Application démarrée!"
log_success "=========================================="
echo ""
log_info "📊 Statut:"
pm2 status | grep "$APP_NAME" || pm2 status
echo ""
log_info "📝 Commandes utiles:"
echo "   pm2 logs $APP_NAME          # Voir les logs"
echo "   pm2 restart $APP_NAME       # Redémarrer"
echo "   pm2 stop $APP_NAME          # Arrêter"
echo "   pm2 monit                   # Monitorer"
echo ""

# Afficher l'URL si disponible
if [ -f ".env" ]; then
    URL=$(grep "^NEXTAUTH_URL=" .env | cut -d '=' -f2 | tr -d '"' || echo "")
    if [ ! -z "$URL" ]; then
        log_info "🔗 Accédez à l'application:"
        echo "   $URL"
        echo ""
    fi
fi

