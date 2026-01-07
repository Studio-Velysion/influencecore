# Script PowerShell pour installer Chakra UI v3
# Usage: .\install-chakra-ui.ps1

Write-Host "=== Installation de Chakra UI v3 ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier si pnpm est installé
Write-Host "Vérification de pnpm..." -ForegroundColor Yellow
$pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue

if (-not $pnpmInstalled) {
    Write-Host "pnpm n'est pas installé. Installation via npm..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors de l'installation de pnpm" -ForegroundColor Red
        exit 1
    }
    Write-Host "pnpm installé avec succès!" -ForegroundColor Green
} else {
    Write-Host "pnpm est déjà installé" -ForegroundColor Green
    pnpm --version
}

Write-Host ""
Write-Host "Installation des dépendances Chakra UI..." -ForegroundColor Yellow

# Aller dans le répertoire du projet
Set-Location -Path "H:\Studio Velysion CreatorHub\ic-billing-core\postiz-app-main"

# Installer les dépendances Chakra UI
pnpm add @chakra-ui/react@next @emotion/react@^11.13.0 @emotion/styled@^11.13.0 framer-motion@^11.0.0

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Installation terminée avec succès! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Dépendances installées:" -ForegroundColor Cyan
    Write-Host "  - @chakra-ui/react@next" -ForegroundColor White
    Write-Host "  - @emotion/react@^11.13.0" -ForegroundColor White
    Write-Host "  - @emotion/styled@^11.13.0" -ForegroundColor White
    Write-Host "  - framer-motion@^11.0.0" -ForegroundColor White
    Write-Host ""
    Write-Host "Vous pouvez maintenant utiliser les composants Chakra UI!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

