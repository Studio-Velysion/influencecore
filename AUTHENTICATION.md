# 🔐 Authentification - InfluenceCore

## ✅ Fonctionnalités implémentées

### 1. Configuration NextAuth
- **Fichier**: `app/api/auth/[...nextauth]/route.ts`
- Provider Credentials configuré
- Hashage des mots de passe avec bcryptjs
- Sessions JWT
- Callbacks pour enrichir le token et la session

### 2. Inscription (Register)
- **Page**: `/register`
- **API Route**: `POST /api/auth/register`
- Validation des données
- Vérification d'unicité de l'email
- Hashage sécurisé du mot de passe
- Redirection vers `/login` après inscription

### 3. Connexion (Login)
- **Page**: `/login`
- Utilise NextAuth `signIn` avec provider credentials
- Gestion des erreurs
- Message de succès après inscription
- Redirection vers `/dashboard` après connexion

### 4. Déconnexion (Logout)
- **Composant**: `LogoutButton`
- Utilise NextAuth `signOut`
- Redirection vers `/login` après déconnexion

### 5. Protection des routes
- **Middleware**: `middleware.ts`
- Protection automatique des routes :
  - `/dashboard/*`
  - `/ideas/*`
  - `/scripts/*`
  - `/calendar/*`
  - `/notes/*`
- Redirection vers `/login` si non authentifié

### 6. Dashboard
- **Page**: `/dashboard`
- Vérification de session côté serveur
- Affichage des informations utilisateur
- Interface de base avec cartes d'action rapide

## 📁 Structure des fichiers

```
app/
├── api/
│   └── auth/
│       ├── [...nextauth]/route.ts    # Configuration NextAuth
│       └── register/route.ts         # API d'inscription
├── login/page.tsx                     # Page de connexion
├── register/page.tsx                  # Page d'inscription
├── dashboard/page.tsx                 # Dashboard (protégé)
└── page.tsx                           # Page d'accueil (redirige)

components/
├── auth/
│   ├── LoginForm.tsx                  # Formulaire de connexion
│   ├── RegisterForm.tsx               # Formulaire d'inscription
│   └── LogoutButton.tsx               # Bouton de déconnexion
└── providers/
    └── SessionProvider.tsx            # Provider NextAuth

lib/
├── auth.ts                            # Utilitaires d'authentification
└── prisma.ts                          # Client Prisma

types/
└── next-auth.d.ts                     # Types TypeScript pour NextAuth

middleware.ts                          # Protection des routes
```

## 🧪 Test de l'authentification

### 1. Créer un compte

1. Accédez à `http://localhost:3000/register`
2. Remplissez le formulaire :
   - Email (obligatoire)
   - Nom (optionnel)
   - Pseudo (optionnel)
   - Mot de passe (minimum 6 caractères)
   - Confirmation du mot de passe
3. Cliquez sur "Créer mon compte"
4. Vous serez redirigé vers `/login` avec un message de succès

### 2. Se connecter

1. Accédez à `http://localhost:3000/login`
2. Entrez votre email et mot de passe
3. Cliquez sur "Se connecter"
4. Vous serez redirigé vers `/dashboard`

### 3. Vérifier la session

- Le dashboard affiche votre nom/pseudo/email
- Le bouton de déconnexion est visible
- Les routes protégées sont accessibles

### 4. Se déconnecter

1. Cliquez sur "Déconnexion" dans le dashboard
2. Vous serez redirigé vers `/login`
3. Les routes protégées ne seront plus accessibles

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcryptjs (10 rounds)
- ✅ Validation des données côté serveur
- ✅ Protection CSRF via NextAuth
- ✅ Sessions JWT sécurisées
- ✅ Variables d'environnement pour les secrets
- ✅ Protection des routes via middleware

## 📝 Variables d'environnement requises

Assurez-vous d'avoir dans votre `.env` :

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-ici"
```

Pour générer `NEXTAUTH_SECRET` :
```bash
openssl rand -base64 32
```

## 🚀 Prochaines étapes

L'authentification de base est complète. Vous pouvez maintenant :
1. Ajouter OAuth (YouTube, Twitch) pour V2
2. Implémenter la réinitialisation de mot de passe
3. Ajouter la vérification d'email
4. Créer les modules métier (Idées, Scripts, etc.)

## 🐛 Dépannage

### Erreur "Invalid credentials"
- Vérifiez que l'utilisateur existe dans la base de données
- Vérifiez que le mot de passe est correct

### Erreur "Email already exists"
- L'email est déjà utilisé, utilisez un autre email ou connectez-vous

### Session non persistante
- Vérifiez que `NEXTAUTH_SECRET` est défini
- Vérifiez que les cookies sont activés dans le navigateur

### Redirection infinie
- Vérifiez la configuration du middleware
- Vérifiez que les routes sont correctement protégées

