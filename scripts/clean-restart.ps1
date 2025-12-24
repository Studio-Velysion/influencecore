# Script pour nettoyer le cache Next.js et redémarrer
# Usage: .\scripts\clean-restart.ps1

Write-Host "=== Nettoyage et Redemarrage ===" -ForegroundColor Cyan
Write-Host ""

# 1. Arrêter tous les processus Node.js liés à Next.js
Write-Host "1. Arret des processus Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   Trouve $($nodeProcesses.Count) processus Node.js" -ForegroundColor Gray
    foreach ($proc in $nodeProcesses) {
        try {
            $procPath = $proc.Path
            if ($procPath -and $procPath -like "*InfluenceCore*") {
                Write-Host "   Arret du processus PID $($proc.Id)" -ForegroundColor Gray
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            }
        } catch {
            # Ignorer les erreurs
        }
    }
    Start-Sleep -Seconds 2
    Write-Host "   OK Processus arretes" -ForegroundColor Green
} else {
    Write-Host "   Aucun processus Node.js trouve" -ForegroundColor Gray
}

# 2. Supprimer le dossier .next
Write-Host "2. Suppression du dossier .next..." -ForegroundColor Yellow
if (Test-Path ".next") {
    try {
        Remove-Item -Recurse -Force ".next" -ErrorAction Stop
        Write-Host "   OK Dossier .next supprime" -ForegroundColor Green
    } catch {
        Write-Host "   ERREUR: Impossible de supprimer .next" -ForegroundColor Red
        Write-Host "   Essayez de fermer tous les processus Node.js manuellement" -ForegroundColor Yellow
        Write-Host "   Puis supprimez manuellement le dossier .next" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   Le dossier .next n'existe pas" -ForegroundColor Gray
}

# 3. Vérifier les dépendances
Write-Host "3. Verification des dependances..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules\next")) {
    Write-Host "   ATTENTION: Next.js non installe" -ForegroundColor Yellow
    Write-Host "   Installation des dependances..." -ForegroundColor Yellow
    npm install
}

# 4. Redémarrer le serveur
Write-Host ""
Write-Host "4. Demarrage du serveur..." -ForegroundColor Yellow
Write-Host "   Executez: npm run dev" -ForegroundColor Cyan
Write-Host ""

