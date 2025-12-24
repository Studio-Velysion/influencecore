# Script pour activer les logs de débogage
# Usage: .\scripts\enable-logs.ps1

Write-Host "=== Activation des Logs de Débogage ===" -ForegroundColor Cyan
Write-Host ""

# Créer le fichier .env.local s'il n'existe pas
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Création du fichier .env.local..." -ForegroundColor Yellow
    New-Item -Path $envFile -ItemType File -Force | Out-Null
}

# Ajouter ou mettre à jour ENABLE_LOGS
$content = Get-Content $envFile -ErrorAction SilentlyContinue
$hasEnableLogs = $content | Where-Object { $_ -match "^ENABLE_LOGS=" }

if ($hasEnableLogs) {
    Write-Host "Mise à jour de ENABLE_LOGS dans .env.local..." -ForegroundColor Yellow
    $content = $content | ForEach-Object {
        if ($_ -match "^ENABLE_LOGS=") {
            "ENABLE_LOGS=true"
        } else {
            $_
        }
    }
    $content | Set-Content $envFile
} else {
    Write-Host "Ajout de ENABLE_LOGS dans .env.local..." -ForegroundColor Yellow
    Add-Content -Path $envFile -Value "ENABLE_LOGS=true"
}

Write-Host ""
Write-Host "✅ Logs activés !" -ForegroundColor Green
Write-Host ""
Write-Host "Pour utiliser les logs dans le navigateur :" -ForegroundColor Cyan
Write-Host "1. Ouvrez la console (F12)" -ForegroundColor White
Write-Host "2. Tapez : logger.enable()" -ForegroundColor White
Write-Host "3. Tapez : showLogs() pour voir tous les logs" -ForegroundColor White
Write-Host "4. Tapez : downloadLogs() pour télécharger les logs" -ForegroundColor White
Write-Host "5. Tapez : getLogStats() pour voir les statistiques" -ForegroundColor White
Write-Host ""
Write-Host "Redémarrez le serveur pour appliquer les changements." -ForegroundColor Yellow

