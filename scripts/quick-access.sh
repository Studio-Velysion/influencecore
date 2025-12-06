#!/bin/bash

# Script rapide pour vérifier l'accès à l'application

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 Vérification de l'accès à InfluenceCore${NC}"
echo ""

# Vérifier PM2
echo -e "${BLUE}1. Vérification PM2...${NC}"
if pm2 list | grep -q "influencecore.*online"; then
    echo -e "${GREEN}✅ Application en cours d'exécution${NC}"
    pm2 list | grep influencecore
else
    echo -e "${RED}❌ Application non démarrée${NC}"
    echo "   Démarrez avec: pm2 start npm --name influencecore -- start"
fi
echo ""

# Vérifier PostgreSQL
echo -e "${BLUE}2. Vérification PostgreSQL...${NC}"
if docker ps | grep -q "influencecore-postgres"; then
    echo -e "${GREEN}✅ PostgreSQL en cours d'exécution${NC}"
else
    echo -e "${RED}❌ PostgreSQL non démarré${NC}"
    echo "   Démarrez avec: docker compose -f docker-compose.db.yml up -d"
fi
echo ""

# Vérifier le port 3000
echo -e "${BLUE}3. Vérification du port 3000...${NC}"
if netstat -tuln 2>/dev/null | grep -q ":3000" || ss -tuln 2>/dev/null | grep -q ":3000"; then
    echo -e "${GREEN}✅ Port 3000 en écoute${NC}"
else
    echo -e "${YELLOW}⚠️  Port 3000 non détecté (peut être normal si l'app vient de démarrer)${NC}"
fi
echo ""

# Tester l'accès local
echo -e "${BLUE}4. Test d'accès local...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application accessible sur http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Application non accessible localement${NC}"
    echo "   Vérifiez les logs: pm2 logs influencecore"
fi
echo ""

# Afficher l'IP publique
echo -e "${BLUE}5. Informations de connexion...${NC}"
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "Non disponible")
echo "   IP publique: $PUBLIC_IP"
echo "   URL locale: http://localhost:3000"
if [ "$PUBLIC_IP" != "Non disponible" ]; then
    echo "   URL publique: http://$PUBLIC_IP:3000"
    echo -e "${YELLOW}   ⚠️  Assurez-vous que le port 3000 est ouvert dans le firewall${NC}"
fi
echo ""

# Vérifier le firewall
echo -e "${BLUE}6. Vérification du firewall...${NC}"
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status | grep -i "Status" | awk '{print $2}')
    if [ "$UFW_STATUS" = "active" ]; then
        if sudo ufw status | grep -q "3000"; then
            echo -e "${GREEN}✅ Port 3000 ouvert dans UFW${NC}"
        else
            echo -e "${YELLOW}⚠️  Port 3000 non ouvert dans UFW${NC}"
            echo "   Ouvrez avec: sudo ufw allow 3000/tcp"
        fi
    else
        echo -e "${YELLOW}⚠️  UFW désactivé${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  UFW non installé${NC}"
fi
echo ""

# Résumé
echo -e "${BLUE}📋 Résumé:${NC}"
echo ""
echo "Pour accéder à l'application:"
echo "  - Local: http://localhost:3000"
if [ "$PUBLIC_IP" != "Non disponible" ]; then
    echo "  - Public: http://$PUBLIC_IP:3000"
fi
echo ""
echo "Commandes utiles:"
echo "  pm2 logs influencecore    # Voir les logs"
echo "  pm2 restart influencecore # Redémarrer"
echo "  pm2 status                # Statut"
echo ""

