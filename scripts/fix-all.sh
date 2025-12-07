#!/bin/bash

# Script tout-en-un pour résoudre les problèmes courants
# Usage: ./scripts/fix-all.sh

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
echo -e "${CYAN}║   Correction des Problèmes Courants     ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

# 1. Résoudre le conflit Git
log_info "1. Résolution des conflits Git..."

if [ -n "$(git status --porcelain)" ]; then
    log_warning "Modifications locales détectées"
    git status --short
    
    # Sauvegarder automatiquement
    log_info "Sauvegarde des modifications locales..."
    git stash save "Sauvegarde automatique - $(date +%Y%m%d_%H%M%S)" || true
    log_success "Modifications sauvegardées"
fi

# Mettre à jour depuis GitHub
log_info "Mise à jour depuis GitHub..."
if git pull origin main; then
    log_success "Code mis à jour"
else
    log_warning "Problème avec git pull, tentative de reset..."
    git fetch origin
    git reset --hard origin/main
    log_success "Code réinitialisé depuis GitHub"
fi

# 2. Rendre les scripts exécutables
log_info "2. Rendre les scripts exécutables..."
find scripts -name "*.sh" -type f -exec chmod +x {} \; 2>/dev/null || true
log_success "Scripts rendus exécutables"

# 3. Vérifier et configurer Next.js pour écouter sur 0.0.0.0
log_info "3. Configuration de Next.js pour l'accès externe..."

# Modifier package.json pour ajouter HOSTNAME
if [ -f "package.json" ]; then
    # Vérifier si le script start existe et le modifier
    if grep -q '"start": "next start"' package.json; then
        log_info "Mise à jour du script start pour écouter sur 0.0.0.0..."
        
        # Créer une sauvegarde
        cp package.json package.json.backup
        
        # Modifier le script start
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' 's/"start": "next start"/"start": "next start -H 0.0.0.0"/' package.json
        else
            sed -i 's/"start": "next start"/"start": "next start -H 0.0.0.0"/' package.json
        fi
        
        log_success "Script start mis à jour pour écouter sur 0.0.0.0"
    else
        log_info "Script start déjà configuré ou différent"
    fi
fi

# 4. Vérifier le fichier .env
log_info "4. Vérification du fichier .env..."

if [ ! -f ".env" ]; then
    log_error "Fichier .env introuvable!"
    log_info "Créez-le avec: ./scripts/auto-deploy-server.sh"
else
    log_success "Fichier .env trouvé"
    
    # Vérifier HOSTNAME dans .env
    if ! grep -q "^HOSTNAME=" .env; then
        log_info "Ajout de HOSTNAME=0.0.0.0 dans .env..."
        echo "" >> .env
        echo "HOSTNAME=0.0.0.0" >> .env
        log_success "HOSTNAME ajouté"
    else
        # Mettre à jour HOSTNAME si nécessaire
        if grep -q "^HOSTNAME=127.0.0.1" .env || grep -q "^HOSTNAME=localhost" .env; then
            log_info "Mise à jour de HOSTNAME pour 0.0.0.0..."
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' 's/^HOSTNAME=.*/HOSTNAME=0.0.0.0/' .env
            else
                sed -i 's/^HOSTNAME=.*/HOSTNAME=0.0.0.0/' .env
            fi
            log_success "HOSTNAME mis à jour"
        fi
    fi
fi

# 5. Vérifier le firewall
log_info "5. Vérification du firewall..."

PORT=$(grep "^PORT=" .env 2>/dev/null | cut -d '=' -f2 | tr -d '"' || echo "3000")

if command -v ufw &> /dev/null; then
    if ufw status | grep -q "Status: active"; then
        if ! ufw status | grep -q "$PORT/tcp"; then
            log_warning "Port $PORT non autorisé dans UFW"
            log_info "Autorisation du port $PORT..."
            echo "y" | sudo ufw allow $PORT/tcp || log_warning "Impossible d'ouvrir le port automatiquement"
            log_info "Exécutez manuellement: sudo ufw allow $PORT/tcp"
        else
            log_success "Port $PORT autorisé dans UFW"
        fi
    fi
fi

# 6. Redémarrer l'application
log_info "6. Redémarrage de l'application..."

if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "influencecore"; then
        log_info "Redémarrage avec les nouvelles configurations..."
        pm2 restart influencecore --update-env || pm2 delete influencecore
        sleep 2
        
        # Redémarrer si nécessaire
        if ! pm2 list | grep -q "influencecore"; then
            log_info "Démarrage de l'application..."
            if [ -f "ecosystem.config.js" ]; then
                pm2 start ecosystem.config.js
            else
                pm2 start npm --name influencecore -- start
            fi
            pm2 save
        fi
        
        log_success "Application redémarrée"
    else
        log_info "Démarrage de l'application..."
        if [ -f "ecosystem.config.js" ]; then
            pm2 start ecosystem.config.js
        else
            pm2 start npm --name influencecore -- start
        fi
        pm2 save
        log_success "Application démarrée"
    fi
else
    log_warning "PM2 n'est pas installé"
fi

echo ""
log_success "=========================================="
log_success "✅ Corrections terminées!"
log_success "=========================================="
echo ""

# Afficher les informations
URL=$(grep "^NEXTAUTH_URL=" .env 2>/dev/null | cut -d '=' -f2 | tr -d '"' || echo "Non configuré")
log_info "📝 Configuration:"
echo "   URL: $URL"
echo "   Port: $PORT"
echo "   Hostname: 0.0.0.0 (accessible depuis l'extérieur)"
echo ""

log_info "🔍 Vérification de l'accessibilité..."
if command -v curl &> /dev/null; then
    sleep 3
    if curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://localhost:$PORT" | grep -q "200\|301\|302"; then
        log_success "Application répond localement"
    else
        log_warning "Application ne répond pas encore, vérifiez les logs: pm2 logs influencecore"
    fi
fi

echo ""
log_info "📝 Commandes utiles:"
echo "   pm2 logs influencecore          # Voir les logs"
echo "   pm2 status                       # Voir le statut"
echo "   ./scripts/check-accessibility.sh # Vérifier l'accessibilité"
echo ""

