#!/bin/bash

# Script pour lancer la démo React Rooks
echo "🎯 Lancement de la démo React Rooks..."

# Vérifier si on est dans le bon répertoire
if [ ! -d "demo" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire racine de react-rooks"
    exit 1
fi

# Aller dans le dossier demo
cd demo

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Lancer le serveur de développement
echo "🚀 Démarrage du serveur de développement..."
echo "📱 L'application sera disponible sur http://localhost:5173"
echo ""
npm run dev
