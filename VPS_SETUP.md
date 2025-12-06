# 🖥️ Configuration VPS - InfluenceCore

Guide complet pour installer PostgreSQL sur votre serveur VPS (avec ou sans Docker).

---

## 📋 Prérequis

- Serveur VPS avec accès SSH
- Système d'exploitation : Ubuntu/Debian (recommandé) ou CentOS/RHEL
- Accès root ou utilisateur avec sudo

---

## 🐳 Option 1 : Docker (Recommandé) ⭐

**Avantages :**
- Installation simple et rapide
- Isolation des services
- Facile à mettre à jour
- Peut inclure PostgreSQL + pgAdmin

### Étape 1 : Installer Docker sur le VPS

#### Pour Ubuntu/Debian :

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer les dépendances
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Ajouter la clé GPG de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajouter le repository Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Vérifier l'installation
sudo docker --version
```

**Liens utiles :**
- Documentation Docker : https://docs.docker.com/engine/install/ubuntu/
- Docker Compose : https://docs.docker.com/compose/install/

#### Pour CentOS/RHEL :

```bash
# Installer les dépendances
sudo yum install -y yum-utils

# Ajouter le repository Docker
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Installer Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Vérifier
sudo docker --version
```

### Étape 2 : Créer le fichier docker-compose.yml

Créez un fichier `docker-compose.yml` sur votre VPS :

```bash
mkdir -p ~/influencecore-db
cd ~/influencecore-db
nano docker-compose.yml
```

Contenu du fichier :

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: influencecore-postgres
    restart: always
    environment:
      POSTGRES_USER: influencecore
      POSTGRES_PASSWORD: VOTRE_MOT_DE_PASSE_SECURISE
      POSTGRES_DB: influencecore
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - influencecore-network

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: influencecore-pgadmin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@influencecore.com
      PGADMIN_DEFAULT_PASSWORD: VOTRE_MOT_DE_PASSE_PGADMIN
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - influencecore-network

volumes:
  postgres_data:

networks:
  influencecore-network:
    driver: bridge
```

**⚠️ Important :** Remplacez `VOTRE_MOT_DE_PASSE_SECURISE` et `VOTRE_MOT_DE_PASSE_PGADMIN` par des mots de passe sécurisés.

### Étape 3 : Lancer les conteneurs

```bash
# Lancer PostgreSQL et pgAdmin
sudo docker compose up -d

# Vérifier que les conteneurs tournent
sudo docker ps

# Voir les logs
sudo docker logs influencecore-postgres
```

### Étape 4 : Configuration du firewall

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 5432/tcp
sudo ufw allow 5050/tcp  # Pour pgAdmin (optionnel)
sudo ufw reload

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --permanent --add-port=5050/tcp
sudo firewall-cmd --reload
```

### Étape 5 : Accéder à pgAdmin (Interface graphique)

- URL : `http://VOTRE_IP_VPS:5050`
- Email : `admin@influencecore.com`
- Mot de passe : celui défini dans docker-compose.yml

### Étape 6 : Connection string pour votre application

```env
DATABASE_URL="postgresql://influencecore:VOTRE_MOT_DE_PASSE_SECURISE@VOTRE_IP_VPS:5432/influencecore?schema=public"
```

**Pour sécurité renforcée :** Utilisez un tunnel SSH au lieu d'exposer le port 5432 publiquement.

---

## 🗄️ Option 2 : Installation PostgreSQL native

### Pour Ubuntu/Debian :

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier la version
sudo -u postgres psql --version
```

**Liens utiles :**
- Documentation PostgreSQL Ubuntu : https://www.postgresql.org/download/linux/ubuntu/
- Guide officiel : https://www.postgresql.org/docs/

### Pour CentOS/RHEL :

```bash
# Installer le repository PostgreSQL
sudo yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# Installer PostgreSQL 15
sudo yum install -y postgresql15-server postgresql15

# Initialiser la base de données
sudo /usr/pgsql-15/bin/postgresql-15-setup initdb

# Démarrer PostgreSQL
sudo systemctl start postgresql-15
sudo systemctl enable postgresql-15
```

### Configuration PostgreSQL native :

```bash
# Se connecter en tant que postgres
sudo -u postgres psql

# Créer un utilisateur et une base de données
CREATE USER influencecore WITH PASSWORD 'VOTRE_MOT_DE_PASSE_SECURISE';
CREATE DATABASE influencecore OWNER influencecore;
GRANT ALL PRIVILEGES ON DATABASE influencecore TO influencecore;
\q

# Configurer l'accès distant (optionnel)
sudo nano /etc/postgresql/15/main/postgresql.conf
# Décommenter : listen_addresses = 'localhost'

sudo nano /etc/postgresql/15/main/pg_hba.conf
# Ajouter : host    influencecore    influencecore    0.0.0.0/0    md5

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### Configuration du firewall :

```bash
# Ubuntu/Debian
sudo ufw allow 5432/tcp
sudo ufw reload

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload
```

---

## 🔒 Sécurité recommandée

### Option A : Tunnel SSH (Recommandé)

Au lieu d'exposer PostgreSQL publiquement, utilisez un tunnel SSH :

```bash
# Sur votre machine locale
ssh -L 5432:localhost:5432 user@VOTRE_IP_VPS
```

Puis dans votre `.env` local :
```env
DATABASE_URL="postgresql://influencecore:password@localhost:5432/influencecore?schema=public"
```

### Option B : Restreindre l'accès IP

Modifiez le firewall pour n'autoriser que votre IP :

```bash
# Ubuntu/Debian
sudo ufw allow from VOTRE_IP to any port 5432

# CentOS/RHEL
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="VOTRE_IP" port port="5432" protocol="tcp" accept'
sudo firewall-cmd --reload
```

### Option C : SSL/TLS

Pour une connexion sécurisée, configurez SSL dans PostgreSQL.

---

## 📦 Applications supplémentaires utiles

### 1. pgAdmin (Interface graphique)

**Avec Docker :** Déjà inclus dans le docker-compose.yml ci-dessus.

**Installation native :**
```bash
# Ubuntu/Debian
sudo apt install -y pgadmin4

# Accès web : http://VOTRE_IP/pgadmin4
```

**Lien :** https://www.pgadmin.org/download/

### 2. PostgREST (API REST automatique)

```bash
# Avec Docker
docker run --name postgrest \
  -p 3001:3000 \
  -e PGRST_DB_URI="postgresql://influencecore:password@postgres:5432/influencecore" \
  -e PGRST_DB_SCHEMA="public" \
  postgrest/postgrest
```

**Lien :** https://postgrest.org/

### 3. Redis (pour cache/sessions - optionnel)

```bash
# Avec Docker
docker run -d --name redis -p 6379:6379 redis:alpine
```

**Lien :** https://redis.io/

### 4. Nginx (Reverse proxy - pour production)

```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

**Lien :** https://nginx.org/en/download.html

---

## 🔧 Commandes Docker utiles

```bash
# Voir les conteneurs en cours
sudo docker ps

# Voir tous les conteneurs
sudo docker ps -a

# Voir les logs
sudo docker logs influencecore-postgres

# Arrêter les conteneurs
sudo docker compose down

# Redémarrer les conteneurs
sudo docker compose restart

# Supprimer les conteneurs (⚠️ garde les données)
sudo docker compose down

# Supprimer les conteneurs ET les données (⚠️ DANGER)
sudo docker compose down -v

# Mettre à jour les images
sudo docker compose pull
sudo docker compose up -d

# Backup de la base de données
sudo docker exec influencecore-postgres pg_dump -U influencecore influencecore > backup.sql

# Restore de la base de données
sudo docker exec -i influencecore-postgres psql -U influencecore influencecore < backup.sql
```

---

## 📝 Checklist de configuration VPS

- [ ] Docker installé (ou PostgreSQL natif)
- [ ] Conteneurs PostgreSQL lancés (ou service démarré)
- [ ] Base de données `influencecore` créée
- [ ] Utilisateur `influencecore` créé avec mot de passe
- [ ] Firewall configuré (port 5432)
- [ ] pgAdmin accessible (optionnel)
- [ ] Connection string testée
- [ ] Backup configuré (cron job recommandé)

---

## 🚀 Script d'installation automatique (Docker)

Créez un fichier `setup.sh` sur votre VPS :

```bash
#!/bin/bash

# Installation Docker
sudo apt update && sudo apt upgrade -y
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Créer le répertoire
mkdir -p ~/influencecore-db
cd ~/influencecore-db

# Créer docker-compose.yml (vous devrez éditer les mots de passe)
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: influencecore-postgres
    restart: always
    environment:
      POSTGRES_USER: influencecore
      POSTGRES_PASSWORD: CHANGE_ME
      POSTGRES_DB: influencecore
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: influencecore-pgadmin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@influencecore.com
      PGADMIN_DEFAULT_PASSWORD: CHANGE_ME
    ports:
      - "5050:80"
    depends_on:
      - postgres
volumes:
  postgres_data:
EOF

echo "✅ Docker installé !"
echo "⚠️  N'oubliez pas de modifier les mots de passe dans docker-compose.yml"
echo "Puis lancez : sudo docker compose up -d"
```

Rendre exécutable et lancer :
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🔗 Liens de référence

### Docker
- **Docker Engine** : https://docs.docker.com/engine/install/
- **Docker Compose** : https://docs.docker.com/compose/install/
- **PostgreSQL Docker** : https://hub.docker.com/_/postgres
- **pgAdmin Docker** : https://hub.docker.com/r/dpage/pgadmin4

### PostgreSQL
- **PostgreSQL Official** : https://www.postgresql.org/download/
- **Documentation** : https://www.postgresql.org/docs/
- **Ubuntu Guide** : https://www.postgresql.org/download/linux/ubuntu/
- **CentOS Guide** : https://www.postgresql.org/download/linux/redhat/

### Outils
- **pgAdmin** : https://www.pgadmin.org/
- **PostgREST** : https://postgrest.org/
- **Redis** : https://redis.io/
- **Nginx** : https://nginx.org/

---

## ✅ Une fois configuré

Votre connection string sera :
```env
DATABASE_URL="postgresql://influencecore:VOTRE_MOT_DE_PASSE@VOTRE_IP_VPS:5432/influencecore?schema=public"
```

Puis sur votre machine de développement :
```bash
npm run db:generate
npm run db:push
```

Votre base de données est prête ! 🎉

