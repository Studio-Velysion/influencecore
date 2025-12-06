#!/bin/bash

# Script de déploiement automatique pour InfluenceCore
# Ce script installe et configure tout automatiquement sur le serveur

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration par défaut
APP_NAME="influencecore"
APP_DIR="/var/www/${APP_NAME}"
DB_NAME="influencecore"
DB_USER="influencecore"
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Fonction pour afficher les messages
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

# Vérifier si on est root
if [ "$EUID" -ne 0 ]; then 
    log_error "Ce script doit être exécuté en tant que root (utilisez sudo)"
    exit 1
fi

log_info "🚀 Déploiement automatique de InfluenceCore"
log_info "=========================================="
echo ""

# Étape 1: Mise à jour du système
log_info "Étape 1/8: Mise à jour du système..."
apt-get update -qq
apt-get upgrade -y -qq
log_success "Système mis à jour"

# Étape 2: Installation des dépendances de base
log_info "Étape 2/8: Installation des dépendances de base..."
apt-get install -y -qq \
    curl \
    wget \
    git \
    build-essential \
    openssl \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    apt-transport-https
log_success "Dépendances installées"

# Étape 3: Installation de Node.js 20
log_info "Étape 3/8: Installation de Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
    log_success "Node.js $(node --version) installé"
else
    NODE_VERSION=$(node --version)
    log_success "Node.js $NODE_VERSION déjà installé"
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas installé"
    exit 1
fi

# Étape 4: Installation de Docker
log_info "Étape 4/8: Installation de Docker..."
if ! command -v docker &> /dev/null; then
    # Ajouter le repository Docker
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Démarrer Docker
    systemctl start docker
    systemctl enable docker
    
    log_success "Docker $(docker --version) installé"
else
    log_success "Docker $(docker --version) déjà installé"
fi

# Étape 5: Installation de PM2
log_info "Étape 5/8: Installation de PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup systemd -u root --hp /root
    log_success "PM2 installé"
else
    log_success "PM2 déjà installé"
fi

# Étape 6: Création du répertoire de l'application
log_info "Étape 6/8: Configuration du répertoire de l'application..."
if [ ! -d "$APP_DIR" ]; then
    mkdir -p "$APP_DIR"
    log_success "Répertoire $APP_DIR créé"
else
    log_success "Répertoire $APP_DIR existe déjà"
fi

# Si le code n'est pas encore cloné, on attend qu'il le soit
if [ ! -d "$APP_DIR/.git" ]; then
    log_warning "Le repository Git n'est pas encore cloné dans $APP_DIR"
    log_info "Le script continuera lors du prochain déploiement"
fi

# Étape 7: Configuration de Docker Compose pour PostgreSQL
log_info "Étape 7/8: Configuration de la base de données PostgreSQL..."

# Créer le fichier docker-compose.yml pour la base de données
cat > "$APP_DIR/docker-compose.db.yml" <<EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: ${APP_NAME}-postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ${APP_NAME}-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local

networks:
  ${APP_NAME}-network:
    driver: bridge
EOF

log_success "Fichier docker-compose.db.yml créé"

# Démarrer PostgreSQL si pas déjà démarré
cd "$APP_DIR"
if [ ! "$(docker ps -q -f name=${APP_NAME}-postgres)" ]; then
    log_info "Démarrage de PostgreSQL..."
    docker compose -f docker-compose.db.yml up -d
    
    # Attendre que PostgreSQL soit prêt
    log_info "Attente que PostgreSQL soit prêt..."
    for i in {1..30}; do
        if docker exec ${APP_NAME}-postgres pg_isready -U ${DB_USER} > /dev/null 2>&1; then
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
    log_success "PostgreSQL est déjà en cours d'exécution"
fi

# Étape 8: Configuration des variables d'environnement
log_info "Étape 8/8: Configuration des variables d'environnement..."

# Construire l'URL de la base de données
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"

# Créer le fichier .env si il n'existe pas
ENV_FILE="$APP_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    log_info "Création du fichier .env..."
    
    # Demander les informations nécessaires
    echo ""
    read -p "🌐 Entrez l'URL de votre application (ex: https://votre-domaine.com): " NEXTAUTH_URL
    if [ -z "$NEXTAUTH_URL" ]; then
        NEXTAUTH_URL="http://localhost:3000"
        log_warning "URL par défaut utilisée: $NEXTAUTH_URL"
    fi
    
    read -p "💳 Entrez votre clé secrète Stripe (SK_...) [optionnel]: " STRIPE_SECRET_KEY
    read -p "🔐 Entrez votre secret webhook Stripe [optionnel]: " STRIPE_WEBHOOK_SECRET
    
    # Créer le fichier .env
    cat > "$ENV_FILE" <<EOF
# Database
DATABASE_URL="${DATABASE_URL}"

# NextAuth
NEXTAUTH_URL="${NEXTAUTH_URL}"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# Stripe
STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:-}"
STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET:-}"

# Node Environment
NODE_ENV=production
EOF
    
    chmod 600 "$ENV_FILE"
    log_success "Fichier .env créé avec les variables d'environnement"
else
    log_success "Fichier .env existe déjà"
    
    # Mettre à jour DATABASE_URL si nécessaire
    if ! grep -q "DATABASE_URL=" "$ENV_FILE"; then
        echo "DATABASE_URL=\"${DATABASE_URL}\"" >> "$ENV_FILE"
        log_success "DATABASE_URL ajouté au fichier .env"
    fi
fi

# Afficher les informations importantes
echo ""
log_success "=========================================="
log_success "✅ Installation terminée avec succès!"
log_success "=========================================="
echo ""
log_info "📋 Informations importantes:"
echo "   📁 Répertoire: $APP_DIR"
echo "   🗄️  Base de données: $DB_NAME"
echo "   👤 Utilisateur DB: $DB_USER"
echo "   🔑 Mot de passe DB: $DB_PASSWORD"
echo "   🔐 NextAuth Secret: $NEXTAUTH_SECRET"
echo ""
log_warning "⚠️  IMPORTANT: Notez ces informations dans un endroit sûr!"
echo ""
log_info "📝 Prochaines étapes:"
echo "   1. Clonez votre repository dans $APP_DIR"
echo "   2. Exécutez: cd $APP_DIR && npm install"
echo "   3. Exécutez: npm run db:generate"
echo "   4. Exécutez: npm run db:push"
echo "   5. Exécutez: npm run build"
echo "   6. Exécutez: pm2 start npm --name $APP_NAME -- start"
echo ""
log_info "Ou utilisez le script de déploiement automatique:"
echo "   ./scripts/deploy-app.sh"
echo ""

