# Script pour démarrer uniquement le frontend (sans extension)
# Usage: .\START_FRONTEND_ONLY.ps1

Write-Host "=== Démarrage du Frontend uniquement ===" -ForegroundColor Cyan
Write-Host ""

# Aller dans le répertoire du projet
$projectPath = "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
Set-Location -Path $projectPath

Write-Host "Répertoire actuel: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Vérifier si les dépendances sont installées
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances..." -ForegroundColor Yellow
    $pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
    if ($pnpmInstalled) {
        pnpm install
    } else {
        npm install
    }
}

Write-Host ""
Write-Host "Démarrage du frontend uniquement..." -ForegroundColor Green
Write-Host ""

# Démarrer uniquement le frontend
$pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
if ($pnpmInstalled) {
    Write-Host "Utilisation de pnpm..." -ForegroundColor Cyan
    pnpm run dev:frontend
} else {
    Write-Host "Utilisation de npm..." -ForegroundColor Cyan
    npm run dev:frontend
}

