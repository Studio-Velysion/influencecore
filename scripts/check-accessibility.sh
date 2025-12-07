#!/bin/bash

# Script pour vérifier l'accessibilité de l'application
# Usage: ./scripts/check-accessibility.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
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

echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Vérification de l'Accessibilité     ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

# 1. Vérifier la configuration
log_info "1. Vérification de la configuration..."

if [ ! -f ".env" ]; then
    log_error "Fichier .env introuvable"
    exit 1
fi

URL=$(grep "^NEXTAUTH_URL=" .env | cut -d '=' -f2 | tr -d '"' || echo "")
PORT=$(grep "^PORT=" .env | cut -d '=' -f2 | tr -d '"' || echo "3000")

if [ -z "$URL" ]; then
    log_error "NEXTAUTH_URL non défini dans .env"
    exit 1
fi

log_success "URL configurée: $URL"
log_success "Port configuré: $PORT"

# Extraire l'IP ou le domaine de l'URL
if [[ "$URL" =~ ^https?://([^:/]+) ]]; then
    HOST="${BASH_REMATCH[1]}"
else
    log_error "Format d'URL invalide: $URL"
    exit 1
fi

echo ""

# 2. Vérifier PM2
log_info "2. Vérification de PM2..."

if ! command -v pm2 &> /dev/null; then
    log_error "PM2 n'est pas installé"
    exit 1
fi

if pm2 list | grep -q "influencecore"; then
    STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="influencecore") | .pm2_env.status' 2>/dev/null || pm2 list | grep influencecore | awk '{print $10}')
    if [ "$STATUS" = "online" ] || pm2 list | grep influencecore | grep -q "online"; then
        log_success "Application en cours d'exécution avec PM2"
    else
        log_warning "Application PM2 trouvée mais statut: $STATUS"
    fi
else
    log_error "Application non trouvée dans PM2"
    log_info "Démarrez avec: ./scripts/start-app.sh"
    exit 1
fi

echo ""

# 3. Vérifier que l'application écoute sur le port
log_info "3. Vérification du port $PORT..."

if command -v netstat &> /dev/null; then
    if netstat -tlnp 2>/dev/null | grep -q ":$PORT "; then
        log_success "Port $PORT en écoute"
        netstat -tlnp 2>/dev/null | grep ":$PORT " | head -1
    else
        log_warning "Port $PORT non trouvé dans netstat"
    fi
elif command -v ss &> /dev/null; then
    if ss -tlnp 2>/dev/null | grep -q ":$PORT "; then
        log_success "Port $PORT en écoute"
        ss -tlnp 2>/dev/null | grep ":$PORT " | head -1
    else
        log_warning "Port $PORT non trouvé dans ss"
    fi
else
    log_warning "netstat et ss non disponibles"
fi

echo ""

# 4. Vérifier le firewall
log_info "4. Vérification du firewall..."

if command -v ufw &> /dev/null; then
    UFW_STATUS=$(ufw status | head -1)
    if echo "$UFW_STATUS" | grep -q "Status: active"; then
        log_warning "UFW est actif"
        if ufw status | grep -q "$PORT/tcp"; then
            log_success "Port $PORT autorisé dans UFW"
        else
            log_error "Port $PORT NON autorisé dans UFW"
            log_info "Autorisez avec: sudo ufw allow $PORT/tcp"
        fi
    else
        log_info "UFW est inactif"
    fi
elif command -v firewall-cmd &> /dev/null; then
    log_info "Firewalld détecté"
    if firewall-cmd --list-ports 2>/dev/null | grep -q "$PORT"; then
        log_success "Port $PORT autorisé dans firewalld"
    else
        log_warning "Port $PORT peut ne pas être autorisé"
    fi
else
    log_warning "Aucun firewall détecté (peut être géré par le provider)"
fi

echo ""

# 5. Test de connexion locale
log_info "5. Test de connexion locale..."

if command -v curl &> /dev/null; then
    if curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://localhost:$PORT" | grep -q "200\|301\|302"; then
        log_success "Application répond localement sur le port $PORT"
    else
        log_error "Application ne répond pas localement"
        log_info "Vérifiez les logs: pm2 logs influencecore"
    fi
else
    log_warning "curl non disponible pour le test"
fi

echo ""

# 6. Vérifier l'IP publique
log_info "6. Vérification de l'IP publique..."

if command -v curl &> /dev/null; then
    PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "")
    if [ ! -z "$PUBLIC_IP" ]; then
        log_info "IP publique du serveur: $PUBLIC_IP"
        if [[ "$URL" =~ $PUBLIC_IP ]]; then
            log_success "L'URL correspond à l'IP publique"
        else
            log_warning "L'URL ($HOST) ne correspond pas à l'IP publique ($PUBLIC_IP)"
        fi
    fi
fi

echo ""

# 7. Résumé et recommandations
log_info "7. Résumé et recommandations..."
echo ""

if [[ "$HOST" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log_info "Vous utilisez une IP directe: $HOST"
    log_info "Assurez-vous que:"
    echo "   - Le port $PORT est ouvert dans le firewall du serveur"
    echo "   - Le port $PORT est ouvert dans le firewall de votre provider (OVH, AWS, etc.)"
    echo "   - L'application écoute sur 0.0.0.0 et non seulement sur 127.0.0.1"
else
    log_info "Vous utilisez un domaine: $HOST"
    log_info "Assurez-vous que:"
    echo "   - Le DNS pointe vers l'IP du serveur"
    echo "   - Le port 80/443 est ouvert pour HTTP/HTTPS"
    echo "   - Nginx/Apache est configuré pour rediriger vers le port $PORT"
fi

echo ""
log_info "📝 Commandes utiles:"
echo "   pm2 logs influencecore          # Voir les logs"
echo "   pm2 restart influencecore       # Redémarrer"
echo "   sudo ufw allow $PORT/tcp        # Autoriser le port (si UFW)"
echo "   netstat -tlnp | grep $PORT      # Vérifier le port"
echo ""

