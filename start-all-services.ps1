# Script PowerShell pour démarrer tous les services Postiz
# Usage: .\start-all-services.ps1
# Peut être exécuté depuis n'importe quel répertoire

Write-Host "=== Demarrage de Tous les Services Postiz ===" -ForegroundColor Cyan
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
    Write-Host "Repertoire actuel: $currentPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Veuillez executer ce script depuis:" -ForegroundColor Yellow
    Write-Host "  H:\Studio Velysion CreatorHub\InfluenceCore" -ForegroundColor White
    Write-Host "  ou" -ForegroundColor Yellow
    Write-Host "  H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main" -ForegroundColor White
    exit 1
}

Write-Host "Repertoire trouve: $postizPath" -ForegroundColor Green
Write-Host ""

# Aller dans le répertoire postiz-app-main
Set-Location -Path $postizPath

# Vérifier si le fichier .env existe
$envPath = Join-Path (Split-Path -Parent $postizPath) ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "ATTENTION: Le fichier .env n'existe pas!" -ForegroundColor Yellow
    Write-Host "Chemin attendu: $envPath" -ForegroundColor Gray
    Write-Host "Les services peuvent echouer sans le fichier .env" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Voulez-vous continuer quand meme? (O/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "O" -and $response -ne "o") {
        Write-Host "Arret du script" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Vérifier si pnpm est disponible
$pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpmInstalled) {
    Write-Host "pnpm n'est pas installe. Installation..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur: Impossible d'installer pnpm" -ForegroundColor Red
        Write-Host "Veuillez installer pnpm manuellement: npm install -g pnpm" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "pnpm installe avec succes!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Utilisation de: pnpm" -ForegroundColor Cyan
Write-Host ""

# Vérifier si les dépendances sont installées
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dependances..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors de l'installation des dependances" -ForegroundColor Red
        Write-Host "Essayez manuellement: pnpm install" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "Dependances installees avec succes!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Dependances deja installees" -ForegroundColor Green
    Write-Host ""
}

# Vérifier si Chakra UI est installé
$chakraInstalled = Test-Path "node_modules\@chakra-ui\react"
if (-not $chakraInstalled) {
    Write-Host "Installation de Chakra UI v3..." -ForegroundColor Yellow
    pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Avertissement: Erreur lors de l'installation de Chakra UI" -ForegroundColor Yellow
        Write-Host "Vous pouvez continuer sans Chakra UI pour l'instant" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "=== Demarrage des Services ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services qui vont demarrer:" -ForegroundColor Yellow
Write-Host "  [OK] Frontend - http://localhost:3000" -ForegroundColor Green
Write-Host "  [OK] Backend" -ForegroundColor Green
Write-Host "  [OK] Workers" -ForegroundColor Green
Write-Host "  [OK] Cron" -ForegroundColor Green
Write-Host "  [SKIP] Extension (ignoree sur Windows)" -ForegroundColor Gray
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arreter tous les services" -ForegroundColor Gray
Write-Host ""

# Démarrer tous les services (sans extension pour éviter l'erreur Windows)
Write-Host "Demarrage en cours..." -ForegroundColor Cyan
Write-Host ""

# Configurer pour continuer même en cas d'erreur
$ErrorActionPreference = "Continue"

# Exécuter pnpm run dev (qui exclut maintenant l'extension)
pnpm run dev

# Si on arrive ici, les services se sont arrêtés
Write-Host ""
Write-Host "Les services se sont arretes." -ForegroundColor Yellow
Write-Host ""
Write-Host "Si des services ont echoue, vous pouvez les demarrer individuellement:" -ForegroundColor Yellow
Write-Host "  pnpm run dev:frontend  - Frontend uniquement" -ForegroundColor White
Write-Host "  pnpm run dev:backend   - Backend uniquement" -ForegroundColor White
Write-Host "  pnpm run dev:workers   - Workers uniquement" -ForegroundColor White
Write-Host "  pnpm run dev:cron      - Cron uniquement" -ForegroundColor White
Write-Host ""
Write-Host "OU utiliser le script: .\start-frontend-only.ps1" -ForegroundColor Cyan
