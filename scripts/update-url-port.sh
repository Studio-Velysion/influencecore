#!/bin/bash

# Script pour modifier l'URL et le port de l'application dans le VPS
# Usage: ./scripts/update-url-port.sh [url] [port]

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
APP_DIR="/var/www/influencecore"
ENV_FILE="$APP_DIR/.env"
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

# Vérifier que le fichier .env existe
if [ ! -f "$ENV_FILE" ]; then
    log_error "Le fichier .env n'existe pas dans $APP_DIR"
    log_info "Créez d'abord le fichier .env ou exécutez: ./scripts/auto-deploy-server.sh"
    exit 1
fi

cd "$APP_DIR"

# Obtenir les valeurs actuelles
CURRENT_URL=$(grep "^NEXTAUTH_URL=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"' || echo "Non définie")
CURRENT_PORT=$(grep "^PORT=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"' || echo "3000")

# Obtenir la nouvelle URL
if [ -z "$1" ]; then
    echo ""
    log_info "Configuration actuelle:"
    echo "   URL: $CURRENT_URL"
    echo "   Port: $CURRENT_PORT"
    echo ""
    read -p "🌐 Entrez la nouvelle URL (ex: http://123.45.67.89 ou https://domaine.com): " NEW_URL
    
    if [ -z "$NEW_URL" ]; then
        NEW_URL="$CURRENT_URL"
        log_info "URL inchangée: $NEW_URL"
    fi
else
    NEW_URL="$1"
fi

# Obtenir le nouveau port
if [ -z "$2" ]; then
    # Extraire le port de l'URL si présent
    if [[ "$NEW_URL" =~ :([0-9]+)$ ]]; then
        EXTRACTED_PORT="${BASH_REMATCH[1]}"
        read -p "🔌 Port détecté dans l'URL ($EXTRACTED_PORT). Utiliser ce port? (O/n): " USE_EXTRACTED
        if [ "$USE_EXTRACTED" != "n" ] && [ "$USE_EXTRACTED" != "N" ]; then
            NEW_PORT="$EXTRACTED_PORT"
        else
            read -p "🔌 Entrez le nouveau port (actuel: $CURRENT_PORT): " NEW_PORT
            if [ -z "$NEW_PORT" ]; then
                NEW_PORT="$CURRENT_PORT"
            fi
        fi
    else
        read -p "🔌 Entrez le nouveau port (actuel: $CURRENT_PORT): " NEW_PORT
        if [ -z "$NEW_PORT" ]; then
            NEW_PORT="$CURRENT_PORT"
        fi
    fi
else
    NEW_PORT="$2"
fi

# Valider le port
if ! [[ "$NEW_PORT" =~ ^[0-9]+$ ]] || [ "$NEW_PORT" -lt 1 ] || [ "$NEW_PORT" -gt 65535 ]; then
    log_error "Port invalide: $NEW_PORT (doit être entre 1 et 65535)"
    exit 1
fi

# Construire l'URL complète si nécessaire
if [[ ! "$NEW_URL" =~ :[0-9]+$ ]] && [[ "$NEW_URL" =~ ^http:// ]]; then
    # Ajouter le port seulement pour HTTP (pas pour HTTPS)
    NEW_URL_WITH_PORT="${NEW_URL}:${NEW_PORT}"
else
    NEW_URL_WITH_PORT="$NEW_URL"
fi

# Sauvegarder l'ancien fichier .env
BACKUP_FILE="${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
log_success "Sauvegarde créée: $BACKUP_FILE"

# Mettre à jour NEXTAUTH_URL
log_info "Mise à jour de NEXTAUTH_URL..."
if grep -q "^NEXTAUTH_URL=" "$ENV_FILE"; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"${NEW_URL_WITH_PORT}\"|" "$ENV_FILE"
    else
        sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"${NEW_URL_WITH_PORT}\"|" "$ENV_FILE"
    fi
    log_success "NEXTAUTH_URL mis à jour: $NEW_URL_WITH_PORT"
else
    echo "" >> "$ENV_FILE"
    echo "NEXTAUTH_URL=\"${NEW_URL_WITH_PORT}\"" >> "$ENV_FILE"
    log_success "NEXTAUTH_URL ajouté: $NEW_URL_WITH_PORT"
fi

# Mettre à jour PORT
log_info "Mise à jour de PORT..."
if grep -q "^PORT=" "$ENV_FILE"; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^PORT=.*|PORT=${NEW_PORT}|" "$ENV_FILE"
    else
        sed -i "s|^PORT=.*|PORT=${NEW_PORT}|" "$ENV_FILE"
    fi
    log_success "PORT mis à jour: $NEW_PORT"
else
    echo "" >> "$ENV_FILE"
    echo "PORT=${NEW_PORT}" >> "$ENV_FILE"
    log_success "PORT ajouté: $NEW_PORT"
fi

# Mettre à jour ecosystem.config.js si il existe
if [ -f "ecosystem.config.js" ]; then
    log_info "Mise à jour de ecosystem.config.js..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|PORT: [0-9]*|PORT: ${NEW_PORT}|" ecosystem.config.js
    else
        sed -i "s|PORT: [0-9]*|PORT: ${NEW_PORT}|" ecosystem.config.js
    fi
    log_success "ecosystem.config.js mis à jour"
fi

# Afficher la configuration finale
echo ""
log_info "Configuration finale:"
NEW_URL_FROM_FILE=$(grep "^NEXTAUTH_URL=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"')
NEW_PORT_FROM_FILE=$(grep "^PORT=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"')
echo "   URL: $NEW_URL_FROM_FILE"
echo "   Port: $NEW_PORT_FROM_FILE"

# Gérer PM2
echo ""
log_info "Gestion de l'application PM2..."

# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null; then
    log_warning "PM2 n'est pas installé"
    log_info "Installez PM2 avec: npm install -g pm2"
    log_info "Puis démarrez l'application manuellement"
    exit 0
fi

# Vérifier si l'application tourne
if pm2 list | grep -q "$APP_NAME"; then
    log_info "Application trouvée dans PM2"
    
    # Demander si on veut redémarrer
    read -p "🔄 Voulez-vous redémarrer l'application maintenant? (O/n): " RESTART
    
    if [ "$RESTART" != "n" ] && [ "$RESTART" != "N" ]; then
        log_info "Redémarrage de l'application avec les nouvelles variables..."
        pm2 restart "$APP_NAME" --update-env
        log_success "Application redémarrée"
        
        # Attendre un peu pour que l'application démarre
        sleep 2
        
        # Afficher le statut
        echo ""
        log_info "Statut de l'application:"
        pm2 status | grep "$APP_NAME" || true
        echo ""
        log_info "Logs récents:"
        pm2 logs "$APP_NAME" --lines 5 --nostream || true
    else
        log_info "Application non redémarrée"
        log_info "Redémarrez manuellement avec: pm2 restart $APP_NAME --update-env"
    fi
else
    log_warning "L'application n'est pas en cours d'exécution avec PM2"
    
    # Demander si on veut démarrer
    read -p "🚀 Voulez-vous démarrer l'application maintenant? (O/n): " START
    
    if [ "$START" != "n" ] && [ "$START" != "N" ]; then
        log_info "Démarrage de l'application..."
        
        # Vérifier si ecosystem.config.js existe
        if [ -f "ecosystem.config.js" ]; then
            pm2 start ecosystem.config.js
            log_success "Application démarrée avec ecosystem.config.js"
        else
            pm2 start npm --name "$APP_NAME" -- start
            log_success "Application démarrée avec npm start"
        fi
        
        pm2 save
        log_success "Configuration PM2 sauvegardée"
        
        # Attendre un peu
        sleep 2
        
        # Afficher le statut
        echo ""
        log_info "Statut de l'application:"
        pm2 status | grep "$APP_NAME" || true
        echo ""
        log_info "Logs récents:"
        pm2 logs "$APP_NAME" --lines 5 --nostream || true
    else
        log_info "Application non démarrée"
        log_info "Démarrez manuellement avec:"
        if [ -f "ecosystem.config.js" ]; then
            echo "   pm2 start ecosystem.config.js"
        else
            echo "   pm2 start npm --name $APP_NAME -- start"
        fi
    fi
fi

echo ""
log_success "=========================================="
log_success "✅ Configuration mise à jour avec succès!"
log_success "=========================================="
echo ""
log_info "📝 Résumé:"
echo "   Ancienne URL: $CURRENT_URL"
echo "   Nouvelle URL: $NEW_URL_FROM_FILE"
echo "   Ancien Port: $CURRENT_PORT"
echo "   Nouveau Port: $NEW_PORT_FROM_FILE"
echo "   Fichier .env: $ENV_FILE"
echo "   Sauvegarde: $BACKUP_FILE"
echo ""
log_info "🔗 Accédez à l'application:"
echo "   $NEW_URL_FROM_FILE"
echo ""

