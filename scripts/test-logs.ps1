# Script de test pour vérifier que le système de logs fonctionne
# Usage: .\scripts\test-logs.ps1

Write-Host "=== Test du Systeme de Logs ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier que le dossier logs existe ou sera créé
Write-Host "1. Verification du dossier logs..." -ForegroundColor Yellow
if (Test-Path "logs") {
    Write-Host "   OK Le dossier logs existe" -ForegroundColor Green
    
    # Compter les fichiers de logs
    $logFiles = Get-ChildItem "logs" -Filter "*.log" -ErrorAction SilentlyContinue
    if ($logFiles) {
        Write-Host "   Fichiers de logs trouves: $($logFiles.Count)" -ForegroundColor Gray
        $logFiles | ForEach-Object {
            $size = [math]::Round($_.Length / 1KB, 2)
            Write-Host "      - $($_.Name) ($size KB)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   Aucun fichier de log pour le moment" -ForegroundColor Gray
        Write-Host "   Les fichiers seront crees automatiquement au premier log" -ForegroundColor Gray
    }
} else {
    Write-Host "   Le dossier logs n'existe pas encore" -ForegroundColor Yellow
    Write-Host "   Il sera cree automatiquement au premier log" -ForegroundColor Gray
}

Write-Host ""
Write-Host "2. Verification des fichiers de code..." -ForegroundColor Yellow
if (Test-Path "lib\file-logger.ts") {
    Write-Host "   OK lib/file-logger.ts existe" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: lib/file-logger.ts manquant" -ForegroundColor Red
}

if (Test-Path "lib\logger.ts") {
    Write-Host "   OK lib/logger.ts existe" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: lib/logger.ts manquant" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Comment tester:" -ForegroundColor Yellow
Write-Host "   - Demarrez le serveur: npm run dev" -ForegroundColor Gray
Write-Host "   - Les logs seront automatiquement enregistres dans logs/" -ForegroundColor Gray
Write-Host "   - Ouvrez logs/app-YYYY-MM-DD.log pour voir les logs du jour" -ForegroundColor Gray
Write-Host "   - Ouvrez logs/errors.log pour voir toutes les erreurs" -ForegroundColor Gray
Write-Host ""

