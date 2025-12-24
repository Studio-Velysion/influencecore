# Script pour démarrer uniquement le frontend avec logs détaillés
# Usage: .\start-frontend-debug.ps1

Write-Host "=== Demarrage du Frontend en Mode Debug ===" -ForegroundColor Cyan
Write-Host ""

# Trouver le répertoire postiz-app-main
$currentPath = Get-Location
$postizPath = Join-Path $currentPath "postiz-app-main"

if (-not (Test-Path $postizPath)) {
    if ((Split-Path -Leaf $currentPath) -eq "postiz-app-main") {
        $postizPath = $currentPath
    } else {
        $parentPath = Split-Path -Parent $currentPath
        $postizPath = Join-Path $parentPath "postiz-app-main"
    }
}

if (-not (Test-Path $postizPath)) {
    Write-Host "ERREUR: Impossible de trouver postiz-app-main" -ForegroundColor Red
    exit 1
}

Write-Host "Repertoire: $postizPath" -ForegroundColor Green
Write-Host ""

# Aller dans le répertoire frontend
$frontendPath = Join-Path $postizPath "apps\frontend"
Set-Location -Path $frontendPath

Write-Host "Verification du fichier .env..." -ForegroundColor Yellow
$envPath = Join-Path (Split-Path -Parent (Split-Path -Parent $postizPath)) ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "ATTENTION: Fichier .env non trouve: $envPath" -ForegroundColor Yellow
} else {
    Write-Host "Fichier .env trouve: $envPath" -ForegroundColor Green
}
Write-Host ""

Write-Host "Verification des dependances..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dependances..." -ForegroundColor Yellow
    pnpm install
}
Write-Host ""

Write-Host "=== Demarrage du Frontend ===" -ForegroundColor Cyan
Write-Host "URL: http://localhost:4200" -ForegroundColor Green
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arreter" -ForegroundColor Gray
Write-Host ""

# Démarrer avec logs détaillés
$env:NODE_ENV = "development"
pnpm run dev

