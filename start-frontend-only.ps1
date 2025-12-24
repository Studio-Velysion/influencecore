# Script PowerShell pour démarrer uniquement le frontend
# Usage: .\start-frontend-only.ps1
# Peut être exécuté depuis n'importe quel répertoire

Write-Host "=== Démarrage du Frontend uniquement ===" -ForegroundColor Cyan
Write-Host ""

# Trouver le répertoire postiz-app-main automatiquement
$currentPath = Get-Location
$postizPath = Join-Path $currentPath "postiz-app-main"

# Si on est déjà dans postiz-app-main
if (-not (Test-Path $postizPath)) {
    if ((Split-Path -Leaf $currentPath) -eq "postiz-app-main") {
        $postizPath = $currentPath
    } else {
        # Chercher dans le répertoire parent
        $parentPath = Split-Path -Parent $currentPath
        $postizPath = Join-Path $parentPath "postiz-app-main"
    }
}

# Vérifier que postiz-app-main existe
if (-not (Test-Path $postizPath)) {
    Write-Host "ERREUR: Impossible de trouver le répertoire postiz-app-main" -ForegroundColor Red
    Write-Host "Répertoire actuel: $currentPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "Répertoire trouvé: $postizPath" -ForegroundColor Green
Set-Location -Path $postizPath

# Vérifier pnpm
$pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpmInstalled) {
    Write-Host "pnpm n'est pas installé. Installation..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Installer les dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances..." -ForegroundColor Yellow
    pnpm install
}

# Installer Chakra UI si nécessaire
if (-not (Test-Path "node_modules\@chakra-ui\react")) {
    Write-Host "Installation de Chakra UI..." -ForegroundColor Yellow
    pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
}

Write-Host ""
Write-Host "Démarrage du frontend sur http://localhost:3000" -ForegroundColor Green
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
Write-Host ""

# Démarrer uniquement le frontend
pnpm run dev:frontend

