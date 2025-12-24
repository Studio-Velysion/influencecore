# Lance tous les services avec Docker (MariaDB unique + Keycloak + InfluenceCore + Helpdesk + FOSSBilling)
# + détecte automatiquement des ports libres et les écrit dans docker/.env
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\start-all-services-docker.ps1

$ErrorActionPreference = "Stop"

Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host "Docker n'est pas installé ou pas dans le PATH. Installe Docker Desktop puis réessaye." -ForegroundColor Red
  exit 1
}

Write-Host "=== InfluenceCore: lancement Docker (tous services) ===" -ForegroundColor Cyan

# 1) Détection ports + docker/.env
powershell -ExecutionPolicy Bypass -File .\scripts\detect-docker-ports.ps1

$envFile = Join-Path (Get-Location) "docker/.env"
if (-not (Test-Path $envFile)) {
  Write-Host "docker/.env introuvable. Copie docker/env.example -> docker/.env et mets tes secrets." -ForegroundColor Red
  exit 1
}

# 2) Lancer la stack
Write-Host "Démarrage des conteneurs (build)..." -ForegroundColor Yellow
docker compose --env-file $envFile -f docker/docker-compose.local.yml up -d --build

Write-Host ""
Write-Host "✅ Stack démarrée." -ForegroundColor Green
Write-Host "Lis docker/.env pour voir les ports choisis." -ForegroundColor Gray


