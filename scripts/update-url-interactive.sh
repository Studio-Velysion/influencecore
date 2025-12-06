#!/bin/bash

# Script interactif pour modifier l'URL avec menu
# Usage: ./scripts/update-url-interactive.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
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

# Vérifier que le fichier .env existe
if [ ! -f "$ENV_FILE" ]; then
    log_error "Le fichier .env n'existe pas dans $APP_DIR"
    exit 1
fi

# Fonction pour obtenir l'URL actuelle
get_current_url() {
    grep "^NEXTAUTH_URL=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"' || echo "Non définie"
}

# Fonction pour mettre à jour l'URL
update_url() {
    local new_url="$1"
    
    # Sauvegarder
    BACKUP_FILE="${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$ENV_FILE" "$BACKUP_FILE"
    
    # Mettre à jour
    if grep -q "^NEXTAUTH_URL=" "$ENV_FILE"; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"${new_url}\"|" "$ENV_FILE"
        else
            sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"${new_url}\"|" "$ENV_FILE"
        fi
    else
        echo "NEXTAUTH_URL=\"${new_url}\"" >> "$ENV_FILE"
    fi
    
    log_success "URL mise à jour: $new_url"
    log_info "Sauvegarde: $BACKUP_FILE"
}

# Menu principal
while true; do
    clear
    echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   Configuration URL - InfluenceCore   ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
    echo ""
    
    CURRENT_URL=$(get_current_url)
    log_info "URL actuelle: $CURRENT_URL"
    echo ""
    
    echo "1. Modifier l'URL"
    echo "2. Utiliser une URL prédéfinie"
    echo "3. Voir toutes les variables d'environnement"
    echo "4. Redémarrer l'application"
    echo "5. Quitter"
    echo ""
    read -p "Choisissez une option (1-5): " choice
    
    case $choice in
        1)
            echo ""
            read -p "🌐 Entrez la nouvelle URL: " new_url
            if [ ! -z "$new_url" ]; then
                update_url "$new_url"
                echo ""
                read -p "Appuyez sur Entrée pour continuer..."
            fi
            ;;
        2)
            echo ""
            echo "URLs prédéfinies:"
            echo "1. http://localhost:3000 (développement local)"
            echo "2. https://votre-domaine.com (production avec HTTPS)"
            echo "3. http://VOTRE_IP:3000 (production avec IP)"
            echo ""
            read -p "Choisissez (1-3): " preset
            
            case $preset in
                1) update_url "http://localhost:3000" ;;
                2) 
                    read -p "Entrez votre domaine: " domain
                    if [ ! -z "$domain" ]; then
                        update_url "https://$domain"
                    fi
                    ;;
                3)
                    read -p "Entrez votre IP: " ip
                    if [ ! -z "$ip" ]; then
                        update_url "http://$ip:3000"
                    fi
                    ;;
            esac
            echo ""
            read -p "Appuyez sur Entrée pour continuer..."
            ;;
        3)
            echo ""
            log_info "Variables d'environnement:"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            cat "$ENV_FILE" | grep -v "^#" | grep -v "^$" | while IFS= read -r line; do
                if [[ "$line" == *"SECRET"* ]] || [[ "$line" == *"PASSWORD"* ]] || [[ "$line" == *"KEY"* ]]; then
                    key=$(echo "$line" | cut -d '=' -f1)
                    echo "$key=***"
                else
                    echo "$line"
                fi
            done
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            read -p "Appuyez sur Entrée pour continuer..."
            ;;
        4)
            echo ""
            if command -v pm2 &> /dev/null; then
                if pm2 list | grep -q "influencecore"; then
                    log_info "Redémarrage de l'application..."
                    pm2 restart influencecore
                    log_success "Application redémarrée"
                    pm2 status | grep influencecore
                else
                    log_warning "L'application n'est pas en cours d'exécution"
                fi
            else
                log_error "PM2 n'est pas installé"
            fi
            echo ""
            read -p "Appuyez sur Entrée pour continuer..."
            ;;
        5)
            echo ""
            log_info "Au revoir!"
            exit 0
            ;;
        *)
            log_error "Option invalide"
            sleep 1
            ;;
    esac
done

