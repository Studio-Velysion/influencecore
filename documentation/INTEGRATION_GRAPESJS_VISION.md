# Intégration GrapesJS et Vision UI Dashboard

## ✅ Corrections effectuées

### 1. Erreurs Tailwind corrigées
- Remplacement des `@apply` avec classes personnalisées par des valeurs CSS directes
- Ajout des variables CSS manquantes (`--text-inverse`, `--purple-300`, `--purple-400`)

### 2. GrapesJS intégré pour le CMS
- **Composant** : `components/admin/cms/GrapesJSEditor.tsx`
- **Routes API** :
  - `/api/admin/cms/homepage/save` - Sauvegarde de la page
  - `/api/admin/cms/homepage/load` - Chargement de la page
  - `/api/admin/cms/homepage/store` - Stockage automatique
- **Utilisation** : Remplace l'ancien `HomePageEditor` dans `/admin/cms`

### 3. GrapesJS Configuration
- Thème Studio Velysion intégré
- Panels personnalisés (Blocks, Layers, Styles)
- Device Manager (Desktop, Tablet, Mobile)
- Bouton de sauvegarde personnalisé
- Style Manager avec secteurs personnalisés

## 🔄 À faire

### Vision UI Dashboard Chakra
L'intégration de Vision UI Dashboard Chakra nécessite :
1. Migration des composants Chakra UI v1 vers v3 (le projet utilise v3)
2. Adaptation du layout client
3. Intégration avec le thème Studio Velysion

### GrapesJS - Fonctionnalités supplémentaires
- [ ] Créer une table Prisma pour stocker les pages CMS
- [ ] Implémenter la sauvegarde dans la base de données
- [ ] Ajouter des blocs personnalisés pour Studio Velysion
- [ ] Créer un éditeur similaire pour la page Pricing
- [ ] Prévisualisation en temps réel

## 📝 Utilisation

### Éditer la page d'accueil
1. Aller sur `/admin/cms`
2. Utiliser l'éditeur GrapesJS
3. Cliquer sur "Sauvegarder" dans la toolbar

### Créer une page Pricing
1. Créer `/app/admin/cms/pricing/page.tsx`
2. Utiliser `<GrapesJSEditor pageType="pricing" />`
3. Créer les routes API correspondantes

## 🔗 Documentation
- [GrapesJS](https://github.com/GrapesJS/grapesjs)
- [Vision UI Dashboard](https://demos.creative-tim.com/docs-vision-ui-dashboard-chakra/docs/getting-started)

