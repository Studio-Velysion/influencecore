# Script PowerShell Simple pour démarrer tous les services
# Usage: .\start-all-services-simple.ps1
# Depuis n'importe quel répertoire

Write-Host "=== Démarrage Tous les Services ===" -ForegroundColor Cyan
Write-Host ""

# Trouver automatiquement postiz-app-main
$currentPath = Get-Location
$postizPath = $null

# Chercher postiz-app-main dans différents emplacements
$pathsToCheck = @(
    Join-Path $currentPath "postiz-app-main",
    Join-Path (Split-Path -Parent $currentPath) "postiz-app-main",
    "H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main"
)

foreach ($path in $pathsToCheck) {
    if (Test-Path $path) {
        $postizPath = $path
        break
    }
}

if (-not $postizPath) {
    Write-Host "ERREUR: postiz-app-main introuvable" -ForegroundColor Red
    Write-Host "Veuillez exécuter ce script depuis:" -ForegroundColor Yellow
    Write-Host "  H:\Studio Velysion CreatorHub\InfluenceCore" -ForegroundColor White
    Write-Host "  ou" -ForegroundColor Yellow
    Write-Host "  H:\Studio Velysion CreatorHub\InfluenceCore\postiz-app-main" -ForegroundColor White
    exit 1
}

Write-Host "Répertoire trouvé: $postizPath" -ForegroundColor Green
Set-Location $postizPath

# Vérifier pnpm
$pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpmInstalled) {
    Write-Host "pnpm n'est pas installé. Installation..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur: Impossible d'installer pnpm" -ForegroundColor Red
        exit 1
    }
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
Write-Host "Démarrage de tous les services..." -ForegroundColor Green
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
Write-Host ""

# Démarrer tous les services
pnpm run dev

