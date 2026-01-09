# Script PowerShell pour installer les dépendances et démarrer l'application
# Usage: .\setup-and-run.ps1

Write-Host "=== Configuration et Démarrage de l'Application ===" -ForegroundColor Cyan
Write-Host ""

# Aller dans le répertoire du projet
$projectPath = "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"
Set-Location -Path $projectPath

Write-Host "Répertoire actuel: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Vérifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances du projet..." -ForegroundColor Yellow
    
    # Essayer pnpm d'abord
    $pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
    if ($pnpmInstalled) {
        Write-Host "Utilisation de pnpm..." -ForegroundColor Green
        pnpm install
    } else {
        Write-Host "Utilisation de npm..." -ForegroundColor Green
        npm install
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
    Write-Host "Dépendances installées avec succès!" -ForegroundColor Green
} else {
    Write-Host "Les dépendances sont déjà installées" -ForegroundColor Green
}

Write-Host ""

# Installer Chakra UI si pas déjà installé
Write-Host "Vérification de Chakra UI..." -ForegroundColor Yellow
$chakraInstalled = Test-Path "node_modules\@chakra-ui\react"

if (-not $chakraInstalled) {
    Write-Host "Installation de Chakra UI v3..." -ForegroundColor Yellow
    
    $pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
    if ($pnpmInstalled) {
        pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
    } else {
        npm install @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Chakra UI installé avec succès!" -ForegroundColor Green
    } else {
        Write-Host "Erreur lors de l'installation de Chakra UI" -ForegroundColor Red
        Write-Host "Vous pouvez continuer sans Chakra UI pour l'instant" -ForegroundColor Yellow
    }
} else {
    Write-Host "Chakra UI est déjà installé" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Démarrage du serveur de développement ===" -ForegroundColor Cyan
Write-Host ""

# Démarrer le serveur
$pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
if ($pnpmInstalled) {
    Write-Host "Démarrage avec pnpm..." -ForegroundColor Green
    pnpm run dev
} else {
    Write-Host "Démarrage avec npm..." -ForegroundColor Green
    npm run dev
}

