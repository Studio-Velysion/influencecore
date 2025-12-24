# Répare une installation npm corrompue sur Windows (TAR_ENTRY_ERROR / tarball corrupted / next introuvable)
# Usage (PowerShell):
#   cd "H:\Studio Velysion CreatorHub\InfluenceCore"
#   .\FIX_NPM_INFLUENCECORE.ps1

$ErrorActionPreference = "Stop"

function Remove-FolderSafe([string]$Path) {
  if (-not (Test-Path $Path)) { return }
  try {
    attrib -R "$Path\*" /S /D 2>$null | Out-Null
  } catch {}
  try {
    Remove-Item -Recurse -Force $Path -ErrorAction Stop
  } catch {
    cmd /c "rmdir /s /q `"$Path`"" | Out-Null
  }
}

Write-Host "=== InfluenceCore: réparation dépendances npm ===" -ForegroundColor Cyan
Write-Host "Répertoire: $PSScriptRoot" -ForegroundColor Yellow
Set-Location -Path $PSScriptRoot

Write-Host "1) Arrêt des processus node/npm..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process npm -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

Write-Host "2) Suppression node_modules + .next (si présent)..." -ForegroundColor Yellow
Remove-FolderSafe "node_modules"
Remove-FolderSafe ".next"

Write-Host "3) Nettoyage cache npm..." -ForegroundColor Yellow
# Option: déplacer le cache hors du disque H: (souvent plus stable)
$cacheDir = Join-Path $env:LOCALAPPDATA "npm-cache"
Write-Host "   - cache npm => $cacheDir" -ForegroundColor DarkGray
npm config set cache "$cacheDir" | Out-Null
npm cache clean --force | Out-Null
npm cache verify | Out-Null

Write-Host "4) Installation propre (sans audit/fund)..." -ForegroundColor Yellow
npm install --no-audit --no-fund

Write-Host "5) Vérification Next..." -ForegroundColor Yellow
if (-not (Test-Path ".\node_modules\next\package.json")) {
  Write-Host "❌ Next n'est pas installé. Ton npm/cache/antivirus bloque encore l'extraction." -ForegroundColor Red
  Write-Host "➡️ Essaie: ajouter une exclusion antivirus sur `"$PSScriptRoot\node_modules`" puis relance ce script." -ForegroundColor Yellow
  exit 1
}

$nextVersion = node -p "require('./node_modules/next/package.json').version"
Write-Host "✅ Next installé: v$nextVersion" -ForegroundColor Green

Write-Host ""
Write-Host "Tu peux maintenant lancer:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White


