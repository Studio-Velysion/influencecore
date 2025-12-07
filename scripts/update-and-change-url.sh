#!/bin/bash

# Script pour mettre à jour le code depuis GitHub puis modifier l'URL
# Usage: ./scripts/update-and-change-url.sh [nouvelle-url]

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

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

# Vérifier qu'on est dans le bon répertoire
if [ ! -d "$APP_DIR" ]; then
    log_error "Le répertoire $APP_DIR n'existe pas"
    exit 1
fi

cd "$APP_DIR"

# Mettre à jour depuis GitHub
log_info "Mise à jour du code depuis GitHub..."
if git pull origin main; then
    log_success "Code mis à jour depuis GitHub"
else
    log_error "Erreur lors de la mise à jour depuis GitHub"
    exit 1
fi

# Vérifier que le script existe maintenant
if [ ! -f "scripts/update-url.sh" ]; then
    log_error "Le script scripts/update-url.sh n'existe toujours pas"
    log_info "Vérifiez que les fichiers ont été poussés sur GitHub"
    exit 1
fi

# Rendre le script exécutable
chmod +x scripts/update-url.sh
log_success "Script rendu exécutable"

# Exécuter le script de mise à jour d'URL
if [ -z "$1" ]; then
    log_info "Exécution du script de mise à jour d'URL..."
    ./scripts/update-url.sh
else
    log_info "Exécution du script de mise à jour d'URL avec l'URL: $1"
    ./scripts/update-url.sh "$1"
fi

