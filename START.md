# ⚡ Démarrage Rapide - InfluenceCore

Guide ultra-rapide pour démarrer le projet.

---

## 🚀 En 3 Commandes (Local)

```bash
# 1. Installer
npm install

# 2. Configurer (créer .env avec DATABASE_URL et NEXTAUTH_SECRET)
cp .env.example .env
# Éditer .env avec vos valeurs

# 3. Démarrer
npm run dev
```

**Accès** : http://localhost:3000

---

## 🖥️ Sur le Serveur (Production)

```bash
# 1. Cloner et configurer
cd /var/www
git clone https://github.com/Studio-Velysion/influencecore.git
cd influencecore
sudo ./scripts/first-time-setup.sh

# C'est tout ! L'application démarre automatiquement.
```

**Vérifier** :
```bash
pm2 status
curl http://localhost:3000
```

---

## 📖 Documentation Complète

Voir `DEMARRER_PROJET.md` pour le guide détaillé.

---

**🎯 Prêt en moins de 5 minutes !**

