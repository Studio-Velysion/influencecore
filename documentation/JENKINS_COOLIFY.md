# Jenkins → Coolify (déploiement auto)

Ce repo est un **monorepo**. Le déploiement recommandé est :

1) Jenkins fait les checks (install/lint/build)
2) Jenkins déclenche un **redeploy Coolify** via le **webhook de déploiement** Coolify

## Pré-requis

- Jenkins avec Node.js (idéalement Node 20+ pour InfluenceCore)
- Accès sortant HTTPS depuis Jenkins vers Coolify
- Le webhook Coolify de l’application (Deploy Webhook)

## Configuration Jenkins (Pipeline from SCM)

1. Crée un job Jenkins de type **Pipeline**
2. Dans **Pipeline → Definition**, choisis **Pipeline script from SCM**
3. SCM : Git
4. Repository URL : ton repo GitHub
5. Branch : `*/main`

## Variable requise

Définis dans Jenkins (Credentials / env var) :

- `COOLIFY_WEBHOOK_URL` : l’URL du webhook de déploiement (secret)

> Astuce : utilise un “Secret text” Jenkins + “Inject environment variables”.

## Fonctionnement du Jenkinsfile

Le fichier `Jenkinsfile` à la racine exécute :

- `npm ci`
- `npm run lint`
- `npm run build`
- `curl -X POST "$COOLIFY_WEBHOOK_URL"`

Tu peux désactiver certaines étapes via les paramètres du job :

- `SKIP_LINT`
- `SKIP_BUILD`
- `TRIGGER_COOLIFY`

## Déclenchement automatique

Deux options :

1) **Webhook GitHub → Jenkins** (recommandé) : build à chaque push sur `main`
2) **Polling SCM** : Jenkins check le repo périodiquement

## Si tu veux juste “redeploy maintenant”

Dans Jenkins :

- Ouvre le job
- Clique **Build Now**

Coolify recevra le webhook et relancera le déploiement.


