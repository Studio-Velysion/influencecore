# Détecte des ports libres et les écrit dans docker/.env (sans toucher aux secrets existants).
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\detect-docker-ports.ps1

$ErrorActionPreference = "Stop"

function Get-FreePort([int]$startPort) {
  for ($p = $startPort; $p -lt ($startPort + 200); $p++) {
    try {
      $listener = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
      if (-not $listener) { return $p }
    } catch {
      return $p
    }
  }
  throw "Aucun port libre trouvé à partir de $startPort"
}

Set-Location (Split-Path $PSScriptRoot -Parent)

$dockerDir = Join-Path (Get-Location) "docker"
$envPath = Join-Path $dockerDir ".env"
$templatePath = Join-Path $dockerDir "env.example"

if (-not (Test-Path $envPath)) {
  if (-not (Test-Path $templatePath)) {
    throw "Template introuvable: $templatePath"
  }
  Copy-Item $templatePath $envPath
  Write-Host "Créé docker/.env depuis docker/env.example" -ForegroundColor Yellow
}

$ports = @{
  INFLUENCECORE_PORT      = (Get-FreePort 3000)
  KEYCLOAK_PORT           = (Get-FreePort 8080)
  MARIADB_PORT            = (Get-FreePort 3306)
  HELPDESK_PORT           = (Get-FreePort 8000)
  HELPDESK_SOCKETIO_PORT  = (Get-FreePort 9000)
  FOSSBILLING_PORT        = (Get-FreePort 8081)
}

$lines = Get-Content $envPath -ErrorAction SilentlyContinue
if (-not $lines) { $lines = @() }

function Set-OrAdd([string[]]$content, [string]$key, [string]$value) {
  $pattern = "^\s*$([regex]::Escape($key))\s*="
  $idx = -1
  for ($i=0; $i -lt $content.Count; $i++) {
    if ($content[$i] -match $pattern) { $idx = $i; break }
  }
  $newLine = "$key=$value"
  if ($idx -ge 0) {
    $content[$idx] = $newLine
  } else {
    $content += $newLine
  }
  return ,$content
}

foreach ($k in $ports.Keys) {
  $lines = Set-OrAdd $lines $k $ports[$k]
}

Set-Content -Path $envPath -Value $lines -Encoding UTF8

Write-Host "Ports détectés et écrits dans docker/.env :" -ForegroundColor Green
$ports.GetEnumerator() | Sort-Object Name | ForEach-Object {
  Write-Host (" - {0}={1}" -f $_.Name, $_.Value) -ForegroundColor Gray
}


