# Lance la stack Docker locale: MariaDB (unique) + Keycloak + InfluenceCore
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\start-docker-stack.ps1

$ErrorActionPreference = "Stop"

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "=== InfluenceCore Docker Stack (local) ===" -ForegroundColor Cyan
Write-Host "Démarrage: MariaDB + Keycloak + InfluenceCore..." -ForegroundColor Yellow

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host "Docker n'est pas installé ou pas dans le PATH. Installe Docker Desktop puis réessaye." -ForegroundColor Red
  exit 1
}

# Option: utiliser docker/.env si présent
$envFile = Join-Path (Get-Location) "docker/.env"
if (Test-Path $envFile) {
  docker compose --env-file $envFile -f docker/docker-compose.local.yml up -d --build
} else {
  Write-Host "Attention: docker/.env manquant. Copie docker/env.example -> docker/.env et mets tes secrets." -ForegroundColor Yellow
  docker compose -f docker/docker-compose.local.yml up -d --build
}

Write-Host ""
Write-Host "URLs:" -ForegroundColor Green
Write-Host " - InfluenceCore: http://localhost:3000" -ForegroundColor Gray
Write-Host " - Keycloak:      http://localhost:8080" -ForegroundColor Gray
Write-Host " - MariaDB:       localhost:3306" -ForegroundColor Gray


