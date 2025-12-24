# Démarrage Messa (InfluenceCore UI + Postiz backend moteur) en dev Windows
# - InfluenceCore (Next) : http://localhost:3000
# - Postiz backend (Nest) : http://localhost:3100
#
# Prérequis:
# - pnpm installé
# - Base Postiz configurée via DATABASE_URL (Postgres) dans ton environnement
#
# Usage:
#   ./START_MESSA_DEV.ps1

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$postiz = Join-Path $root "postiz-app-main"

if (-not (Test-Path $postiz)) {
  Write-Host "❌ postiz-app-main introuvable: $postiz" -ForegroundColor Red
  exit 1
}

# Clé partagée (dev) si pas déjà définie
if (-not $env:INFLUENCECORE_INTERNAL_KEY) {
  $env:INFLUENCECORE_INTERNAL_KEY = "dev-secret"
  Write-Host "ℹ️ INFLUENCECORE_INTERNAL_KEY non défini -> utilisation dev-secret (dev uniquement)" -ForegroundColor Yellow
}

# InfluenceCore doit appeler le backend Postiz sur 3100
$env:POSTIZ_BACKEND_URL = "http://localhost:3100"

# Désactiver login/register Postiz côté public (InfluenceCore pilote l'accès)
$env:INFLUENCECORE_DISABLE_PUBLIC_AUTH = "true"

Write-Host ""
Write-Host "=== 1) Génération Prisma Postiz ===" -ForegroundColor Cyan
Set-Location -Path $postiz
pnpm -s run prisma-generate

Write-Host ""
Write-Host "=== 2) Démarrage Postiz backend (PORT=3100) ===" -ForegroundColor Cyan
$env:PORT = "3100"
Start-Process -FilePath "pnpm" -ArgumentList "--filter","./apps/backend","run","dev" -WorkingDirectory $postiz -WindowStyle Normal

Write-Host ""
Write-Host "=== 3) Démarrage InfluenceCore (Next) ===" -ForegroundColor Cyan
Set-Location -Path $root
Start-Process -FilePath "npm" -ArgumentList "run","dev" -WorkingDirectory $root -WindowStyle Normal

Write-Host ""
Write-Host "✅ Lance ensuite: http://localhost:3000/messa/workspaces" -ForegroundColor Green


