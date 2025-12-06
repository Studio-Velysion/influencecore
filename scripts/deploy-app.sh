#!/bin/bash

# Script de déploiement de l'application InfluenceCore
# À exécuter après le clone/pull du repository

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
APP_NAME="influencecore"
APP_DIR="/var/www/${APP_NAME}"

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

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "$APP_DIR/package.json" ]; then
    log_error "Le fichier package.json n'a pas été trouvé dans $APP_DIR"
    log_info "Assurez-vous d'avoir cloné le repository dans $APP_DIR"
    exit 1
fi

cd "$APP_DIR"

log_info "🚀 Déploiement de l'application InfluenceCore"
log_info "=============================================="
echo ""

# Étape 1: Vérifier que .env existe
log_info "Étape 1/6: Vérification des variables d'environnement..."
if [ ! -f ".env" ]; then
    log_error "Le fichier .env n'existe pas!"
    log_info "Exécutez d'abord: ./scripts/auto-deploy-server.sh"
    exit 1
fi
log_success "Fichier .env trouvé"

# Charger les variables d'environnement
export $(cat .env | grep -v '^#' | xargs)

# Étape 2: Vérifier que PostgreSQL est en cours d'exécution
log_info "Étape 2/6: Vérification de PostgreSQL..."
if ! docker ps | grep -q "${APP_NAME}-postgres"; then
    log_warning "PostgreSQL n'est pas en cours d'exécution"
    log_info "Démarrage de PostgreSQL..."
    docker-compose -f docker-compose.db.yml up -d
    
    # Attendre que PostgreSQL soit prêt
    log_info "Attente que PostgreSQL soit prêt..."
    for i in {1..30}; do
        if docker exec ${APP_NAME}-postgres pg_isready -U influencecore > /dev/null 2>&1; then
            log_success "PostgreSQL est prêt"
            break
        fi
        if [ $i -eq 30 ]; then
            log_error "PostgreSQL n'est pas prêt après 30 tentatives"
            exit 1
        fi
        sleep 2
    done
else
    log_success "PostgreSQL est en cours d'exécution"
fi

# Étape 3: Installation des dépendances
log_info "Étape 3/6: Installation des dépendances npm..."
npm ci --production=false
log_success "Dépendances installées"

# Étape 4: Génération du client Prisma
log_info "Étape 4/6: Génération du client Prisma..."
npm run db:generate
log_success "Client Prisma généré"

# Étape 5: Création/mise à jour de la base de données
log_info "Étape 5/6: Création/mise à jour de la base de données..."
log_info "Exécution de Prisma db push..."
npm run db:push
log_success "Base de données créée/mise à jour"

# Étape 6: Build de l'application
log_info "Étape 6/6: Build de l'application Next.js..."
npm run build
log_success "Application buildée"

# Étape 7: Démarrage avec PM2
log_info "Démarrage de l'application avec PM2..."

# Arrêter l'application si elle tourne déjà
if pm2 list | grep -q "$APP_NAME"; then
    log_info "Arrêt de l'instance existante..."
    pm2 stop "$APP_NAME" || true
    pm2 delete "$APP_NAME" || true
fi

# Démarrer l'application
log_info "Démarrage de la nouvelle instance..."
pm2 start npm --name "$APP_NAME" -- start
pm2 save

log_success "Application démarrée avec PM2"

# Afficher le statut
echo ""
log_success "=========================================="
log_success "✅ Déploiement terminé avec succès!"
log_success "=========================================="
echo ""
log_info "📊 Statut de l'application:"
pm2 status "$APP_NAME"
echo ""
log_info "📝 Commandes utiles:"
echo "   pm2 logs $APP_NAME          # Voir les logs"
echo "   pm2 restart $APP_NAME       # Redémarrer"
echo "   pm2 stop $APP_NAME          # Arrêter"
echo "   pm2 monit                   # Monitorer"
echo ""

