#!/bin/bash

# Script d'installation automatique pour VPS
# InfluenceCore - Configuration PostgreSQL avec Docker

set -e

echo "🚀 Installation de Docker et PostgreSQL pour InfluenceCore"
echo "============================================================"

# Vérifier si on est root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Ce script nécessite les privilèges sudo"
    echo "Lancez avec : sudo bash setup-vps.sh"
    exit 1
fi

# Détecter le système d'exploitation
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
else
    echo "❌ Impossible de détecter le système d'exploitation"
    exit 1
fi

echo "📦 Système détecté : $OS $VER"

# Installation Docker selon l'OS
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    echo "📥 Installation de Docker pour Ubuntu/Debian..."
    
    # Mettre à jour le système
    apt update && apt upgrade -y
    
    # Installer les dépendances
    apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Ajouter la clé GPG de Docker
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    # Ajouter le repository Docker
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Installer Docker
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ]; then
    echo "📥 Installation de Docker pour CentOS/RHEL..."
    
    # Installer les dépendances
    yum install -y yum-utils
    
    # Ajouter le repository Docker
    yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    
    # Installer Docker
    yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
else
    echo "❌ Système d'exploitation non supporté : $OS"
    echo "Veuillez installer Docker manuellement"
    exit 1
fi

# Démarrer et activer Docker
systemctl start docker
systemctl enable docker

# Vérifier l'installation
if docker --version > /dev/null 2>&1; then
    echo "✅ Docker installé avec succès : $(docker --version)"
else
    echo "❌ Erreur lors de l'installation de Docker"
    exit 1
fi

# Créer le répertoire pour les fichiers
INSTALL_DIR="$HOME/influencecore-db"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

echo ""
echo "📝 Création du fichier docker-compose.yml..."

# Demander les mots de passe
read -sp "🔐 Entrez un mot de passe pour PostgreSQL (utilisateur influencecore) : " POSTGRES_PASSWORD
echo ""
read -sp "🔐 Entrez un mot de passe pour pgAdmin : " PGADMIN_PASSWORD
echo ""

# Créer docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: influencecore-postgres
    restart: always
    environment:
      POSTGRES_USER: influencecore
      POSTGRES_PASSWORD: $POSTGRES_PASSWORD
      POSTGRES_DB: influencecore
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - influencecore-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U influencecore"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: influencecore-pgadmin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@influencecore.com
      PGADMIN_DEFAULT_PASSWORD: $PGADMIN_PASSWORD
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - influencecore-network
    volumes:
      - pgadmin_data:/var/lib/pgadmin

volumes:
  postgres_data:
    driver: local
  pgadmin_data:
    driver: local

networks:
  influencecore-network:
    driver: bridge
EOF

echo "✅ Fichier docker-compose.yml créé"

# Configurer le firewall
echo ""
echo "🔥 Configuration du firewall..."

if command -v ufw > /dev/null 2>&1; then
    ufw allow 5432/tcp
    ufw allow 5050/tcp
    echo "✅ Ports 5432 et 5050 ouverts avec UFW"
elif command -v firewall-cmd > /dev/null 2>&1; then
    firewall-cmd --permanent --add-port=5432/tcp
    firewall-cmd --permanent --add-port=5050/tcp
    firewall-cmd --reload
    echo "✅ Ports 5432 et 5050 ouverts avec firewalld"
else
    echo "⚠️  Aucun firewall détecté. Configurez manuellement les ports 5432 et 5050"
fi

# Lancer les conteneurs
echo ""
echo "🐳 Lancement des conteneurs Docker..."
docker compose up -d

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente du démarrage de PostgreSQL..."
sleep 5

# Vérifier que les conteneurs tournent
if docker ps | grep -q influencecore-postgres; then
    echo "✅ PostgreSQL est en cours d'exécution"
else
    echo "❌ Erreur : PostgreSQL n'a pas démarré"
    docker logs influencecore-postgres
    exit 1
fi

# Afficher les informations de connexion
VPS_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo ""
echo "============================================================"
echo "✅ Installation terminée avec succès !"
echo "============================================================"
echo ""
echo "📊 Informations de connexion :"
echo "  - PostgreSQL : $VPS_IP:5432"
echo "  - Base de données : influencecore"
echo "  - Utilisateur : influencecore"
echo "  - Mot de passe : [celui que vous avez entré]"
echo ""
echo "🌐 pgAdmin (Interface graphique) :"
echo "  - URL : http://$VPS_IP:5050"
echo "  - Email : admin@influencecore.com"
echo "  - Mot de passe : [celui que vous avez entré]"
echo ""
echo "📝 Connection string pour votre application :"
echo "  DATABASE_URL=\"postgresql://influencecore:$POSTGRES_PASSWORD@$VPS_IP:5432/influencecore?schema=public\""
echo ""
echo "🔧 Commandes utiles :"
echo "  - Voir les logs : docker logs influencecore-postgres"
echo "  - Arrêter : docker compose down"
echo "  - Redémarrer : docker compose restart"
echo "  - Backup : docker exec influencecore-postgres pg_dump -U influencecore influencecore > backup.sql"
echo ""
echo "⚠️  SÉCURITÉ : Pour la production, utilisez un tunnel SSH au lieu d'exposer le port 5432 publiquement"
echo "============================================================"

