# Dashboard Pack (copier/coller)

Ce dossier contient **tout le nécessaire** pour réutiliser le tableau de bord InfluenceCore dans d'autres projets:

- `DASHBOARD_DATA.ts` : données (routes, cartes, labels, permissions, iconKeys)
- `iconMap.tsx` : mapping `iconKey -> ReactNode` (exemple avec `react-icons/fi`)
- `DashboardCards.tsx` : rendu générique de cartes à partir des données
- `SidebarRoutes.tsx` : rendu générique de routes sidebar
- `permissions.example.ts` : exemple de permissions (strings)

## Utilisation rapide (Next.js/React)

1) Copie le dossier `dashboard-pack/` dans ton projet.

2) Dans ton code, importe les données:

```ts
import { DASHBOARD_CLIENT_CARDS } from './dashboard-pack/DASHBOARD_DATA'
```

3) Rends les cartes:

```tsx
<DashboardCards
  cards={DASHBOARD_CLIENT_CARDS}
  can={(perm) => true /* branche ton système de permissions */}
/>
```

## Notes
- Les permissions ici sont des **strings** (ex: `ideas.view`).
- Adapte `can()` à ton système (RBAC, roles, etc.).


