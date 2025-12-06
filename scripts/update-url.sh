#!/bin/bash

# Script pour modifier l'URL de l'application dans le VPS
# Usage: ./scripts/update-url.sh [nouvelle-url]

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
APP_DIR="/var/www/influencecore"
ENV_FILE="$APP_DIR/.env"

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

# Vérifier que le fichier .env existe
if [ ! -f "$ENV_FILE" ]; then
    log_error "Le fichier .env n'existe pas dans $APP_DIR"
    log_info "Créez d'abord le fichier .env ou exécutez: ./scripts/auto-deploy-server.sh"
    exit 1
fi

# Obtenir la nouvelle URL
if [ -z "$1" ]; then
    # Demander l'URL si non fournie en paramètre
    echo ""
    log_info "URL actuelle:"
    CURRENT_URL=$(grep "^NEXTAUTH_URL=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"' || echo "Non définie")
    echo "   $CURRENT_URL"
    echo ""
    read -p "🌐 Entrez la nouvelle URL (ex: https://votre-domaine.com): " NEW_URL
    
    if [ -z "$NEW_URL" ]; then
        log_error "URL non fournie"
        exit 1
    fi
else
    NEW_URL="$1"
fi

# Valider l'URL (format basique)
if [[ ! "$NEW_URL" =~ ^https?:// ]]; then
    log_warning "L'URL ne commence pas par http:// ou https://"
    read -p "Voulez-vous continuer quand même? (o/N): " CONFIRM
    if [ "$CONFIRM" != "o" ] && [ "$CONFIRM" != "O" ]; then
        log_info "Opération annulée"
        exit 0
    fi
fi

# Sauvegarder l'ancien fichier .env
BACKUP_FILE="${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
log_success "Sauvegarde créée: $BACKUP_FILE"

# Mettre à jour NEXTAUTH_URL
log_info "Mise à jour de NEXTAUTH_URL..."

# Vérifier si NEXTAUTH_URL existe déjà
if grep -q "^NEXTAUTH_URL=" "$ENV_FILE"; then
    # Remplacer l'URL existante
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"${NEW_URL}\"|" "$ENV_FILE"
    else
        # Linux
        sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"${NEW_URL}\"|" "$ENV_FILE"
    fi
    log_success "NEXTAUTH_URL mis à jour"
else
    # Ajouter NEXTAUTH_URL si il n'existe pas
    echo "" >> "$ENV_FILE"
    echo "NEXTAUTH_URL=\"${NEW_URL}\"" >> "$ENV_FILE"
    log_success "NEXTAUTH_URL ajouté"
fi

# Afficher la nouvelle URL
log_info "Nouvelle URL configurée:"
NEW_URL_FROM_FILE=$(grep "^NEXTAUTH_URL=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"')
echo "   $NEW_URL_FROM_FILE"

# Demander si on veut redémarrer l'application
echo ""
read -p "🔄 Voulez-vous redémarrer l'application maintenant? (O/n): " RESTART

if [ "$RESTART" != "n" ] && [ "$RESTART" != "N" ]; then
    log_info "Redémarrage de l'application..."
    
    # Vérifier si PM2 est installé et si l'application tourne
    if command -v pm2 &> /dev/null; then
        if pm2 list | grep -q "influencecore"; then
            pm2 restart influencecore
            log_success "Application redémarrée avec PM2"
            
            # Afficher le statut
            echo ""
            log_info "Statut de l'application:"
            pm2 status | grep influencecore
        else
            log_warning "L'application n'est pas en cours d'exécution avec PM2"
            log_info "Démarrez avec: pm2 start npm --name influencecore -- start"
        fi
    else
        log_warning "PM2 n'est pas installé"
        log_info "Redémarrez manuellement l'application"
    fi
else
    log_info "Application non redémarrée"
    log_info "Redémarrez manuellement avec: pm2 restart influencecore"
fi

echo ""
log_success "=========================================="
log_success "✅ URL mise à jour avec succès!"
log_success "=========================================="
echo ""
log_info "📝 Informations:"
echo "   Ancienne URL: $CURRENT_URL"
echo "   Nouvelle URL: $NEW_URL_FROM_FILE"
echo "   Fichier .env: $ENV_FILE"
echo "   Sauvegarde: $BACKUP_FILE"
echo ""

