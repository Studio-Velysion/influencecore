#!/bin/bash

# Script pour activer et configurer le firewall UFW
# Usage: ./scripts/activate-firewall.sh [port]

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

APP_DIR="/var/www/influencecore"
PORT="${1:-3000}"

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

log_info "🔥 Configuration du firewall UFW..."

# Vérifier si UFW est installé
if ! command -v ufw &> /dev/null; then
    log_error "UFW n'est pas installé"
    log_info "Installez avec: sudo apt-get install ufw"
    exit 1
fi

# Vérifier le statut actuel
CURRENT_STATUS=$(sudo ufw status | head -1)

if echo "$CURRENT_STATUS" | grep -q "Status: active"; then
    log_success "UFW est déjà actif"
else
    log_warning "UFW est inactif"
    
    # Autoriser SSH avant d'activer (important pour ne pas se déconnecter)
    log_info "Autorisation de SSH (port 22) avant activation..."
    sudo ufw allow 22/tcp
    
    # Autoriser le port de l'application
    log_info "Autorisation du port $PORT..."
    sudo ufw allow $PORT/tcp
    
    # Activer UFW
    log_info "Activation de UFW..."
    echo "y" | sudo ufw enable
    
    log_success "UFW activé"
fi

# Vérifier que le port est autorisé
if sudo ufw status | grep -q "$PORT/tcp"; then
    log_success "Port $PORT autorisé"
else
    log_info "Ajout de la règle pour le port $PORT..."
    sudo ufw allow $PORT/tcp
    log_success "Port $PORT autorisé"
fi

# Afficher le statut
echo ""
log_info "📊 Statut du firewall:"
sudo ufw status numbered

echo ""
log_success "=========================================="
log_success "✅ Firewall configuré avec succès!"
log_success "=========================================="
echo ""
log_info "📝 Ports autorisés:"
sudo ufw status | grep -E "^[0-9]+/tcp|^[0-9]+/udp" || echo "   Aucun port spécifique autorisé"
echo ""
log_warning "⚠️  Important:"
echo "   - Le port 22 (SSH) est autorisé pour maintenir l'accès"
echo "   - Le port $PORT est autorisé pour l'application"
echo "   - Vérifiez que votre provider (OVH, AWS, etc.) autorise aussi le port $PORT"
echo ""

