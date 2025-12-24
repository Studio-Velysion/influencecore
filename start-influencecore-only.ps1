# Script PowerShell pour démarrer uniquement InfluenceCore
# Usage: .\start-influencecore-only.ps1
# Peut être exécuté depuis n'importe quel répertoire

Write-Host "=== Démarrage d'InfluenceCore uniquement ===" -ForegroundColor Cyan
Write-Host ""

# Trouver le répertoire InfluenceCore automatiquement
$currentPath = Get-Location
$influenceCorePath = $currentPath

# Si on est dans un sous-répertoire, chercher le répertoire racine
if (-not (Test-Path (Join-Path $currentPath "package.json"))) {
    # Chercher dans le répertoire parent
    $parentPath = Split-Path -Parent $currentPath
    if (Test-Path (Join-Path $parentPath "package.json")) {
        $influenceCorePath = $parentPath
    }
}

# Vérifier que package.json existe
if (-not (Test-Path (Join-Path $influenceCorePath "package.json"))) {
    Write-Host "ERREUR: Impossible de trouver le répertoire InfluenceCore" -ForegroundColor Red
    Write-Host "Répertoire actuel: $currentPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "Répertoire trouvé: $influenceCorePath" -ForegroundColor Green
Set-Location -Path $influenceCorePath

# Vérifier npm
$npmInstalled = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmInstalled) {
    Write-Host "ERREUR: npm n'est pas installé" -ForegroundColor Red
    Write-Host "Veuillez installer Node.js depuis https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Vérifier Node.js version
$nodeVersion = node --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Gray

# Vérifier et installer les dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: Échec de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
} elseif (-not (Test-Path "node_modules\next")) {
    Write-Host "Dépendances incomplètes, réinstallation..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: Échec de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Dépendances vérifiées ✓" -ForegroundColor Green
}

Write-Host ""
Write-Host "Démarrage d'InfluenceCore sur http://localhost:3000" -ForegroundColor Green
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
Write-Host ""

# Démarrer le serveur de développement
npm run dev

