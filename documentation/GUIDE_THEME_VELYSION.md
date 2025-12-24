# Guide du Thème Studio Velysion

## 🎨 Palette de Couleurs

### Fond
- **bg-primary**: `#0A0A0F` - Noir profond principal
- **bg-secondary**: `#12121A` - Gris anthracite
- **bg-tertiary**: `#1A1A24` - Noir adouci pour cartes
- **bg-card**: `rgba(26, 26, 36, 0.8)` - Cartes avec transparence
- **bg-hover**: `#1F1F2E` - Hover sur éléments

### Accents Violets (Branding)
- **purple-500**: `#9333EA` - Violet principal
- **purple-400**: `#A855F7` - Violet clair
- **purple-600**: `#7E22CE` - Violet foncé

### Jaune Doré (CTA)
- **gold-500**: `#F59E0B` - Jaune doré principal
- **gold-400**: `#FBBF24` - Jaune clair
- **gold-600**: `#D97706` - Jaune foncé

### Texte
- **text-primary**: `#FFFFFF` - Blanc pur pour titres
- **text-secondary**: `#E5E7EB` - Gris clair pour sous-titres
- **text-tertiary**: `#9CA3AF` - Gris moyen pour texte courant
- **text-muted**: `#6B7280` - Gris désaturé pour texte secondaire
- **text-inverse**: `#0A0A0F` - Noir pour texte sur fond clair

## 🧩 Classes Utilitaires

### Boutons
```tsx
// Bouton primaire (jaune doré)
<button className="btn-velysion-primary">Action</button>

// Bouton secondaire (violet avec bordure)
<button className="btn-velysion-secondary">Action</button>

// Bouton avec dégradé violet-rose
<button className="btn-velysion-gradient">Action</button>
```

### Cartes
```tsx
// Carte de base
<div className="card-velysion">
  Contenu
</div>

// Carte avec glow
<div className="card-velysion glow-purple">
  Contenu
</div>
```

### Inputs
```tsx
<input className="input-velysion" placeholder="Texte..." />
<textarea className="input-velysion" rows={4} />
```

### Dégradés
```tsx
// Dégradé violet-rose
<div className="gradient-purple-pink">...</div>

// Dégradé violet foncé
<div className="gradient-purple-dark">...</div>
```

### Effets
```tsx
// Effet glass
<div className="glass-effect">...</div>

// Glow violet
<div className="glow-purple">...</div>

// Glow jaune doré
<div className="glow-gold">...</div>
```

## 📝 Exemples d'Utilisation

### Page avec fond sombre
```tsx
<div className="min-h-screen bg-bg-primary">
  {/* Contenu */}
</div>
```

### Titre avec dégradé
```tsx
<h1 className="text-4xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
  Titre
</h1>
```

### Navigation active
```tsx
<Link
  href="/dashboard"
  className={`px-4 py-2 rounded-lg ${
    isActive
      ? 'text-purple-400 bg-purple-500/20 border border-purple-500/30'
      : 'text-text-secondary hover:text-purple-400 hover:bg-bg-hover'
  }`}
>
  Dashboard
</Link>
```

## 🎯 États Interactifs

### Hover
- Légère montée de luminosité
- Accent violet visible
- Transition fluide (250ms)

### Active / Focus
- Outline violet
- Glow discret
- Ring avec offset

### Disabled
- Opacité réduite (50%)
- Cursor not-allowed
- Pas d'effet hover

## 📦 Composants Prêts à l'Emploi

### VelysionButton
```tsx
import VelysionButton from '@/components/common/VelysionButton'

<VelysionButton variant="primary" size="md">
  Cliquer
</VelysionButton>
```

### VelysionCard
```tsx
import VelysionCard from '@/components/common/VelysionCard'

<VelysionCard hover glow>
  Contenu de la carte
</VelysionCard>
```

## 🔧 Configuration Tailwind

Toutes les couleurs sont configurées dans `tailwind.config.ts` et peuvent être utilisées directement :

```tsx
<div className="bg-bg-primary text-text-primary border-border-default">
  ...
</div>
```

## 📚 Fichiers de Configuration

- `lib/theme/colors.ts` - Définition des couleurs
- `tailwind.config.ts` - Configuration Tailwind
- `app/globals.css` - Styles globaux et classes utilitaires

