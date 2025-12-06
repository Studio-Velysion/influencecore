#!/bin/bash

# Script de configuration initiale complète
# À exécuter une seule fois sur un nouveau serveur

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

APP_DIR="/var/www/influencecore"

log_info "🚀 Configuration initiale de InfluenceCore"
log_info "=========================================="
echo ""

# Vérifier si on est root
if [ "$EUID" -ne 0 ]; then 
    log_warning "Ce script doit être exécuté en tant que root"
    log_info "Utilisation de sudo..."
    sudo "$0" "$@"
    exit $?
fi

# Étape 1: Installation du serveur
log_info "Étape 1/3: Installation du serveur..."
if [ -f "$APP_DIR/scripts/auto-deploy-server.sh" ]; then
    chmod +x "$APP_DIR/scripts/auto-deploy-server.sh"
    "$APP_DIR/scripts/auto-deploy-server.sh"
else
    log_warning "Script auto-deploy-server.sh non trouvé"
    log_info "Assurez-vous d'avoir cloné le repository"
    exit 1
fi

# Étape 2: Cloner le repository si nécessaire
log_info "Étape 2/3: Vérification du repository..."
if [ ! -d "$APP_DIR/.git" ]; then
    log_warning "Le repository n'est pas encore cloné"
    read -p "Entrez l'URL du repository GitHub: " REPO_URL
    if [ -z "$REPO_URL" ]; then
        log_warning "URL non fournie, passage à l'étape suivante"
    else
        if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
            log_warning "Le répertoire $APP_DIR n'est pas vide"
            read -p "Voulez-vous le vider et cloner le repository? (o/N): " CONFIRM
            if [ "$CONFIRM" = "o" ] || [ "$CONFIRM" = "O" ]; then
                rm -rf "$APP_DIR"/*
                rm -rf "$APP_DIR"/.* 2>/dev/null || true
            fi
        fi
        git clone "$REPO_URL" "$APP_DIR"
        log_success "Repository cloné"
    fi
else
    log_success "Repository déjà cloné"
fi

# Étape 3: Déploiement de l'application
log_info "Étape 3/3: Déploiement de l'application..."
if [ -f "$APP_DIR/scripts/deploy-app.sh" ]; then
    cd "$APP_DIR"
    chmod +x scripts/deploy-app.sh
    ./scripts/deploy-app.sh
else
    log_warning "Script deploy-app.sh non trouvé"
    log_info "Assurez-vous d'avoir cloné le repository"
    exit 1
fi

echo ""
log_success "=========================================="
log_success "✅ Configuration initiale terminée!"
log_success "=========================================="
echo ""

