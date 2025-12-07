#!/bin/bash

# Script pour résoudre les conflits Git et mettre à jour le code
# Usage: ./scripts/fix-git-and-update.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

APP_DIR="/var/www/influencecore"

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

log_info "🔧 Résolution des conflits Git et mise à jour..."

# Vérifier s'il y a des modifications non commitées
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Modifications locales détectées"
    git status --short
    
    echo ""
    log_info "Options:"
    echo "1. Sauvegarder les modifications locales (stash)"
    echo "2. Écraser les modifications locales (reset)"
    echo "3. Annuler"
    echo ""
    read -p "Choisissez une option (1-3): " choice
    
    case $choice in
        1)
            log_info "Sauvegarde des modifications locales..."
            git stash save "Sauvegarde automatique avant pull - $(date +%Y%m%d_%H%M%S)"
            log_success "Modifications sauvegardées (récupérables avec: git stash pop)"
            ;;
        2)
            log_warning "Écrasement des modifications locales..."
            git reset --hard HEAD
            log_success "Modifications locales supprimées"
            ;;
        3)
            log_info "Opération annulée"
            exit 0
            ;;
        *)
            log_error "Option invalide"
            exit 1
            ;;
    esac
fi

# Mettre à jour depuis GitHub
log_info "Mise à jour depuis GitHub..."
if git pull origin main; then
    log_success "Code mis à jour depuis GitHub"
else
    log_error "Erreur lors de la mise à jour"
    exit 1
fi

# Rendre les scripts exécutables
log_info "Rendre les scripts exécutables..."
find scripts -name "*.sh" -type f -exec chmod +x {} \;
log_success "Scripts rendus exécutables"

echo ""
log_success "=========================================="
log_success "✅ Mise à jour terminée!"
log_success "=========================================="
echo ""
log_info "📝 Scripts disponibles:"
ls -1 scripts/*.sh 2>/dev/null | sed 's|scripts/|   - |' || echo "   Aucun script trouvé"
echo ""

