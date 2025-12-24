# Script interactif pour créer le tout premier compte Admin InfluenceCore
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\create-initial-admin.ps1

$ErrorActionPreference = "Stop"

Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "=== InfluenceCore - Création du premier compte administrateur ===" -ForegroundColor Cyan

$email = Read-Host "Email admin"
if ([string]::IsNullOrWhiteSpace($email)) {
  Write-Host "Email requis." -ForegroundColor Red
  exit 1
}

$secure = Read-Host "Mot de passe admin (min 8)" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

if ([string]::IsNullOrWhiteSpace($password) -or $password.Length -lt 8) {
  Write-Host "Mot de passe invalide (min 8 caractères)." -ForegroundColor Red
  exit 1
}

$env:INITIAL_ADMIN_EMAIL = $email
$env:INITIAL_ADMIN_PASSWORD = $password

node .\scripts\create-initial-admin.cjs

Write-Host "Terminé." -ForegroundColor Green


