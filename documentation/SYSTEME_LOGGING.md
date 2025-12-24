# 📋 Système de Logging - InfluenceCore

Ce document décrit le système de logging complet qui capture toutes les erreurs de l'application.

## 🎯 Objectif

Le système de logging permet de :
- ✅ Capturer toutes les erreurs côté serveur (API)
- ✅ Capturer toutes les erreurs côté client (React)
- ✅ Stocker les erreurs dans la base de données
- ✅ Visualiser et gérer les erreurs depuis l'interface admin
- ✅ Marquer les erreurs comme résolues

## 📁 Structure

### Modèle de Données

Le modèle `ErrorLog` dans Prisma stocke toutes les erreurs :

```prisma
model ErrorLog {
  id          String   @id @default(uuid())
  level       String   @default("error") // error, warning, info
  message     String
  stack       String?  // Stack trace
  context     String?  // JSON avec contexte supplémentaire
  userId      String?  // ID de l'utilisateur concerné
  userAgent   String?  // User agent du navigateur
  url         String?  // URL où l'erreur s'est produite
  method      String?  // Méthode HTTP
  statusCode  Int?     // Code de statut HTTP
  ipAddress   String?  // Adresse IP
  resolved    Boolean  @default(false)
  resolvedAt  DateTime?
  resolvedBy  String?  // ID de l'admin qui a résolu
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Services

#### `lib/logger.ts`
Service principal de logging avec les fonctions :
- `logError()` - Logger une erreur
- `logWarning()` - Logger un avertissement
- `logInfo()` - Logger une information
- `markErrorAsResolved()` - Marquer une erreur comme résolue
- `getErrorLogs()` - Récupérer les logs
- `countUnresolvedErrors()` - Compter les erreurs non résolues

#### `lib/api-error-handler.ts`
Wrapper pour les routes API qui capture automatiquement les erreurs :
- `withErrorLogging()` - Wrapper pour les handlers API
- `logApiError()` - Helper pour logger une erreur API

### Composants

#### `components/common/ErrorBoundaryWithLogging.tsx`
ErrorBoundary amélioré qui log les erreurs React dans la base de données.

#### `components/common/ClientErrorHandler.tsx`
Composant qui capture les erreurs globales côté client :
- Erreurs JavaScript non gérées (`window.onerror`)
- Promesses rejetées non gérées (`unhandledrejection`)

### Routes API

#### `POST /api/logs/client-error`
Route pour logger les erreurs côté client.

#### `GET /api/logs`
Récupérer les logs d'erreurs (admin uniquement).

#### `POST /api/logs/[id]/resolve`
Marquer une erreur comme résolue (admin uniquement).

### Page Admin

#### `/admin/logs`
Page admin pour visualiser et gérer tous les logs d'erreurs.

## 🚀 Utilisation

### Logger une erreur manuellement

```typescript
import { logError } from '@/lib/logger'

try {
  // Code qui peut échouer
} catch (error) {
  await logError(
    'Description de l\'erreur',
    error,
    {
      userId: user.id,
      url: '/api/example',
      method: 'POST',
    }
  )
}
```

### Utiliser le wrapper pour les routes API

```typescript
import { withErrorLogging } from '@/lib/api-error-handler'

export const GET = withErrorLogging(async (request) => {
  // Votre code ici
  // Les erreurs seront automatiquement loggées
})
```

### Logger un avertissement ou une info

```typescript
import { logWarning, logInfo } from '@/lib/logger'

await logWarning('Avertissement', { userId: user.id })
await logInfo('Information', { url: '/dashboard' })
```

## 📊 Visualisation des Logs

1. Accéder à `/admin/logs` (nécessite les permissions admin)
2. Filtrer par niveau (error, warning, info)
3. Filtrer par statut (résolu, non résolu)
4. Marquer une erreur comme résolue en cliquant sur "Résoudre"

## 🔧 Configuration

Le système de logging est automatiquement activé dans :
- `app/layout.tsx` - ErrorBoundaryWithLogging et ClientErrorHandler
- Toutes les routes API peuvent utiliser `withErrorLogging`

## 📝 Notes

- Les erreurs sont toujours loggées dans la console en mode développement
- Le logging ne doit jamais faire échouer l'application (try/catch dans les fonctions de logging)
- Les logs sont stockés dans la base de données pour un historique complet

