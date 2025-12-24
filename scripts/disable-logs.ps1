# Script pour désactiver les logs de débogage
# Usage: .\scripts\disable-logs.ps1

Write-Host "=== Désactivation des Logs de Débogage ===" -ForegroundColor Cyan
Write-Host ""

# Modifier le fichier .env.local
$envFile = ".env.local"
if (Test-Path $envFile) {
    $content = Get-Content $envFile -ErrorAction SilentlyContinue
    $content = $content | ForEach-Object {
        if ($_ -match "^ENABLE_LOGS=") {
            "ENABLE_LOGS=false"
        } else {
            $_
        }
    }
    $content | Set-Content $envFile
    Write-Host "✅ Logs désactivés dans .env.local" -ForegroundColor Green
} else {
    Write-Host "⚠️ Fichier .env.local non trouvé" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Redémarrez le serveur pour appliquer les changements." -ForegroundColor Yellow

