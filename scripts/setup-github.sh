#!/bin/bash

# Script pour initialiser et pousser le projet sur GitHub
# Usage: ./scripts/setup-github.sh

set -e

echo "🚀 Configuration GitHub pour InfluenceCore"
echo ""

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo "📦 Initialisation du repository Git..."
    git init
    echo "✅ Repository Git initialisé"
else
    echo "✅ Repository Git déjà initialisé"
fi

# Vérifier si un remote existe déjà
if git remote | grep -q "origin"; then
    echo "⚠️  Un remote 'origin' existe déjà"
    echo "   URL actuelle: $(git remote get-url origin)"
    read -p "Voulez-vous le remplacer? (o/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        read -p "Entrez l'URL du repository GitHub (ex: https://github.com/username/influencecore.git): " REPO_URL
        git remote set-url origin "$REPO_URL"
        echo "✅ Remote mis à jour"
    fi
else
    echo "📡 Configuration du remote GitHub..."
    read -p "Entrez l'URL du repository GitHub (ex: https://github.com/username/influencecore.git): " REPO_URL
    
    if [ -z "$REPO_URL" ]; then
        echo "❌ URL requise. Créez d'abord un repository sur GitHub."
        exit 1
    fi
    
    git remote add origin "$REPO_URL"
    echo "✅ Remote ajouté"
fi

# Ajouter tous les fichiers
echo ""
echo "📝 Ajout des fichiers..."
git add .

# Vérifier s'il y a des changements
if git diff --staged --quiet; then
    echo "ℹ️  Aucun changement à commiter"
else
    echo "💾 Création du commit..."
    git commit -m "Initial commit - InfluenceCore V1 avec Stripe"
    echo "✅ Commit créé"
fi

# Demander confirmation avant de pousser
echo ""
read -p "Voulez-vous pousser sur GitHub maintenant? (o/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    echo "🚀 Push vers GitHub..."
    git branch -M main
    git push -u origin main
    echo ""
    echo "✅ Projet poussé sur GitHub avec succès!"
    echo ""
    echo "🌐 Votre repository: $(git remote get-url origin)"
else
    echo ""
    echo "ℹ️  Pour pousser plus tard, exécutez:"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi

echo ""
echo "✨ Configuration terminée!"

