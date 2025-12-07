#!/bin/bash

# Script pour résoudre l'erreur "next: not found"
# Usage: ./scripts/fix-next-not-found.sh

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

echo -e "${BLUE}🔧 Résolution de l'erreur 'next: not found'${NC}"
echo ""

# 1. Vérifier que Node.js est installé
log_info "1. Vérification de Node.js..."

if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé"
    log_info "Installez Node.js avec: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
log_success "Node.js $NODE_VERSION installé"
log_success "npm $NPM_VERSION installé"

# 2. Vérifier que package.json existe
log_info "2. Vérification de package.json..."

if [ ! -f "package.json" ]; then
    log_error "package.json introuvable"
    exit 1
fi
log_success "package.json trouvé"

# 3. Vérifier si node_modules existe
log_info "3. Vérification des dépendances..."

if [ ! -d "node_modules" ]; then
    log_warning "node_modules n'existe pas"
    log_info "Installation des dépendances..."
    npm install
    log_success "Dépendances installées"
else
    log_info "Vérification de l'installation de next..."
    if [ ! -f "node_modules/.bin/next" ]; then
        log_warning "next n'est pas installé dans node_modules"
        log_info "Réinstallation des dépendances..."
        npm install
        log_success "Dépendances réinstallées"
    else
        log_success "next est installé"
    fi
fi

# 4. Vérifier que next est accessible
log_info "4. Vérification de l'accès à next..."

if [ -f "node_modules/.bin/next" ]; then
    log_success "next trouvé dans node_modules/.bin/next"
    
    # Tester l'exécution
    if ./node_modules/.bin/next --version &> /dev/null; then
        NEXT_VERSION=$(./node_modules/.bin/next --version)
        log_success "next $NEXT_VERSION fonctionne"
    else
        log_warning "next ne s'exécute pas correctement"
    fi
else
    log_error "next toujours introuvable après installation"
    log_info "Essayez: npm install --force"
    exit 1
fi

# 5. Vérifier le script start dans package.json
log_info "5. Vérification du script start..."

if grep -q '"start":' package.json; then
    START_SCRIPT=$(grep '"start":' package.json | cut -d '"' -f4)
    log_info "Script start: $START_SCRIPT"
    
    # Vérifier si le script utilise npx ou le chemin complet
    if echo "$START_SCRIPT" | grep -q "npx"; then
        log_success "Le script utilise npx (recommandé)"
    elif echo "$START_SCRIPT" | grep -q "next start"; then
        log_warning "Le script utilise 'next start' directement"
        log_info "Modification pour utiliser npx..."
        
        # Créer une sauvegarde
        cp package.json package.json.backup
        
        # Modifier le script start
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' 's/"start": "next start -H 0.0.0.0"/"start": "npx next start -H 0.0.0.0"/' package.json
        else
            sed -i 's/"start": "next start -H 0.0.0.0"/"start": "npx next start -H 0.0.0.0"/' package.json
        fi
        
        log_success "Script start modifié pour utiliser npx"
    fi
else
    log_error "Script start introuvable dans package.json"
    exit 1
fi

# 6. Vérifier que le build existe
log_info "6. Vérification du build..."

if [ ! -d ".next" ]; then
    log_warning "Le dossier .next n'existe pas"
    log_info "Build de l'application..."
    npm run build
    log_success "Application buildée"
else
    log_success "Build trouvé"
fi

# 7. Arrêter PM2 si l'application tourne
log_info "7. Gestion de PM2..."

if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "influencecore"; then
        log_info "Arrêt de l'application PM2..."
        pm2 stop influencecore || true
        pm2 delete influencecore || true
        log_success "Application PM2 arrêtée"
    fi
else
    log_warning "PM2 n'est pas installé"
fi

# 8. Redémarrer l'application
log_info "8. Redémarrage de l'application..."

if command -v pm2 &> /dev/null; then
    log_info "Démarrage avec PM2..."
    
    # Utiliser npx pour être sûr
    if [ -f "ecosystem.config.js" ]; then
        # Modifier ecosystem.config.js pour utiliser npx
        if grep -q '"npm"' ecosystem.config.js && ! grep -q "npx" ecosystem.config.js; then
            log_info "Mise à jour de ecosystem.config.js pour utiliser npx..."
            cp ecosystem.config.js ecosystem.config.js.backup
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' 's/"args": "start"/"args": "run start"/' ecosystem.config.js
                sed -i '' 's/"script": "npm"/"script": "npx"/' ecosystem.config.js || true
            else
                sed -i 's/"args": "start"/"args": "run start"/' ecosystem.config.js
                sed -i 's/"script": "npm"/"script": "npx"/' ecosystem.config.js || true
            fi
        fi
        
        # Alternative: utiliser directement le chemin
        pm2 start npm --name influencecore -- run start || {
            log_info "Tentative avec npx..."
            pm2 start npx --name influencecore -- next start -H 0.0.0.0 || {
                log_info "Tentative avec le chemin complet..."
                pm2 start ./node_modules/.bin/next --name influencecore -- start -H 0.0.0.0
            }
        }
    else
        # Utiliser npx directement
        log_info "Démarrage avec npx..."
        pm2 start npx --name influencecore -- next start -H 0.0.0.0
    fi
    
    pm2 save
    log_success "Application démarrée avec PM2"
    
    # Attendre un peu
    sleep 3
    
    # Vérifier le statut
    echo ""
    log_info "Statut de l'application:"
    pm2 status | grep influencecore || pm2 status
    
    # Vérifier les logs
    echo ""
    log_info "Dernières lignes des logs:"
    pm2 logs influencecore --lines 10 --nostream || true
else
    log_warning "PM2 n'est pas installé"
    log_info "Installez avec: npm install -g pm2"
fi

echo ""
log_success "=========================================="
log_success "✅ Problème résolu!"
log_success "=========================================="
echo ""
log_info "📝 Résumé:"
echo "   - Dépendances installées/vérifiées"
echo "   - next trouvé et fonctionnel"
echo "   - Application redémarrée"
echo ""
log_info "🔍 Vérification:"
echo "   pm2 logs influencecore    # Voir les logs"
echo "   pm2 status                # Voir le statut"
echo ""

