# Met à jour l'URL du site (NEXTAUTH_URL + URLs publiques) via une seule commande.
# - Écrit dans docker/.env (non versionné) si présent (ou le crée depuis docker/env.example).
# - Affiche aussi un bloc "copier/coller" pour CapRover > App > Env Vars.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\set-site-url.ps1 -Url "https://mon-site.tld"
#
param(
  [Parameter(Mandatory = $false)]
  [string]$Url,

  [Parameter(Mandatory = $false)]
  [string]$KeycloakUrl,

  [Parameter(Mandatory = $false)]
  [string]$HelpdeskUrl,

  [Parameter(Mandatory = $false)]
  [string]$FossbillingUrl,

  [Parameter(Mandatory = $false)]
  [switch]$NonInteractive
)

$ErrorActionPreference = "Stop"

function Normalize-Url([string]$u) {
  $u = ($u ?? "").Trim()
  if ([string]::IsNullOrWhiteSpace($u)) { return "" }
  if ($u -notmatch '^https?://') { $u = "https://$u" }
  $u = $u.TrimEnd('/')
  return $u
}

function Set-OrAdd([string[]]$content, [string]$key, [string]$value) {
  $pattern = "^\s*$([regex]::Escape($key))\s*="
  $idx = -1
  for ($i=0; $i -lt $content.Count; $i++) {
    if ($content[$i] -match $pattern) { $idx = $i; break }
  }
  $newLine = "$key=$value"
  if ($idx -ge 0) { $content[$idx] = $newLine } else { $content += $newLine }
  return ,$content
}

Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not $Url) {
  $Url = Read-Host "URL publique InfluenceCore (ex: https://influencecore.mondomaine.tld)"
}

$siteUrl = Normalize-Url $Url
if ([string]::IsNullOrWhiteSpace($siteUrl)) {
  Write-Host "URL invalide." -ForegroundColor Red
  exit 1
}

$keycloakPublic = Normalize-Url $KeycloakUrl
$helpdeskPublic = Normalize-Url $HelpdeskUrl
$fossbillingPublic = Normalize-Url $FossbillingUrl

if (-not $NonInteractive) {
  if (-not $keycloakPublic) {
    $keycloakPublic = Normalize-Url (Read-Host "URL publique Keycloak (optionnel, Enter pour ignorer)")
  }
  if (-not $helpdeskPublic) {
    $helpdeskPublic = Normalize-Url (Read-Host "URL publique Helpdesk (optionnel, Enter pour ignorer)")
  }
  if (-not $fossbillingPublic) {
    $fossbillingPublic = Normalize-Url (Read-Host "URL publique FOSSBilling (optionnel, Enter pour ignorer)")
  }
}

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

$lines = Get-Content $envPath -ErrorAction SilentlyContinue
if (-not $lines) { $lines = @() }

$lines = Set-OrAdd $lines "NEXTAUTH_URL" $siteUrl

if ($keycloakPublic) {
  $lines = Set-OrAdd $lines "NEXT_PUBLIC_KEYCLOAK_ADMIN_URL" ($keycloakPublic + "/admin/master/console/")
  $lines = Set-OrAdd $lines "KEYCLOAK_ISSUER" ($keycloakPublic + "/realms/influencecore")
}
if ($helpdeskPublic) {
  $lines = Set-OrAdd $lines "NEXT_PUBLIC_HELPDESK_DASHBOARD_URL" $helpdeskPublic
}
if ($fossbillingPublic) {
  $lines = Set-OrAdd $lines "NEXT_PUBLIC_FOSSBILLING_DASHBOARD_URL" $fossbillingPublic
}

Set-Content -Path $envPath -Value $lines -Encoding UTF8

Write-Host ""
Write-Host "✅ docker/.env mis à jour." -ForegroundColor Green
Write-Host ""
Write-Host "CapRover (copier/coller dans InfluenceCore > Env Vars) :" -ForegroundColor Cyan
Write-Host ("NEXTAUTH_URL={0}" -f $siteUrl) -ForegroundColor Gray
if ($keycloakPublic) {
  Write-Host ("KEYCLOAK_ISSUER={0}" -f ($keycloakPublic + "/realms/influencecore")) -ForegroundColor Gray
  Write-Host ("NEXT_PUBLIC_KEYCLOAK_ADMIN_URL={0}" -f ($keycloakPublic + "/admin/master/console/")) -ForegroundColor Gray
}
if ($helpdeskPublic) {
  Write-Host ("NEXT_PUBLIC_HELPDESK_DASHBOARD_URL={0}" -f $helpdeskPublic) -ForegroundColor Gray
}
if ($fossbillingPublic) {
  Write-Host ("NEXT_PUBLIC_FOSSBILLING_DASHBOARD_URL={0}" -f $fossbillingPublic) -ForegroundColor Gray
}

Write-Host ""
Write-Host "➡️ Ensuite: redémarre l’app InfluenceCore dans CapRover (Restart App)." -ForegroundColor Yellow


