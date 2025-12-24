# Script PowerShell pour demarrer tous les services Postiz
# Version 2 - Amelioree avec meilleure gestion d'erreurs
# Usage: .\start-all-services-v2.ps1

Write-Host "=== Demarrage de Tous les Services Postiz ===" -ForegroundColor Cyan
Write-Host ""

# Trouver le repertoire postiz-app-main automatiquement
$currentPath = Get-Location
$postizPath = Join-Path $currentPath "postiz-app-main"

# Si on est deja dans postiz-app-main
if (-not (Test-Path $postizPath)) {
    if ((Split-Path -Leaf $currentPath) -eq "postiz-app-main") {
        $postizPath = $currentPath
    } else {
        # Chercher dans le repertoire parent
        $parentPath = Split-Path -Parent $currentPath
        $postizPath = Join-Path $parentPath "postiz-app-main"
    }
}

# Verifier que postiz-app-main existe
if (-not (Test-Path $postizPath)) {
    Write-Host "ERREUR: Impossible de trouver le repertoire postiz-app-main" -ForegroundColor Red
    Write-Host "Repertoire actuel: $currentPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "Repertoire trouve: $postizPath" -ForegroundColor Green
Write-Host ""

# Aller dans le repertoire postiz-app-main
Set-Location -Path $postizPath

# Verifier si le fichier .env existe
$envPath = Join-Path (Split-Path -Parent $postizPath) ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "ATTENTION: Le fichier .env n'existe pas!" -ForegroundColor Yellow
    Write-Host "Chemin attendu: $envPath" -ForegroundColor Gray
    Write-Host "Les services peuvent echouer sans le fichier .env" -ForegroundColor Yellow
    Write-Host ""
}

# Verifier si pnpm est disponible
$pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpmInstalled) {
    Write-Host "pnpm n'est pas installe. Installation..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur: Impossible d'installer pnpm" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Utilisation de: pnpm" -ForegroundColor Cyan
Write-Host ""

# Verifier si les dependances sont installees
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dependances..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors de l'installation des dependances" -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependances installees avec succes!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Dependances deja installees" -ForegroundColor Green
    Write-Host ""
}

# Verifier si Chakra UI est installe
$chakraInstalled = Test-Path "node_modules\@chakra-ui\react"
if (-not $chakraInstalled) {
    Write-Host "Installation de Chakra UI v3..." -ForegroundColor Yellow
    pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0
    Write-Host ""
}

Write-Host "=== Demarrage des Services ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services qui vont demarrer:" -ForegroundColor Yellow
Write-Host "  [*] Frontend (port 4200) - http://localhost:4200" -ForegroundColor Green
Write-Host "  [*] Backend" -ForegroundColor Green
Write-Host "  [*] Workers" -ForegroundColor Green
Write-Host "  [*] Cron" -ForegroundColor Green
Write-Host "  [!] Extension (peut echouer sur Windows - c'est normal)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arreter tous les services" -ForegroundColor Gray
Write-Host ""

# Demarrer tous les services
pnpm run dev

