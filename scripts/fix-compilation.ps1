# Script pour corriger les problèmes de compilation Next.js
# Usage: .\scripts\fix-compilation.ps1

Write-Host "=== Correction des Problemes de Compilation ===" -ForegroundColor Cyan
Write-Host ""

# Fonction pour supprimer .next de manière robuste (Windows: fichiers verrouillés / EPERM)
function Remove-NextCache {
    param(
        [string]$Path = ".next",
        [int]$Retries = 3
    )

    if (-not (Test-Path $Path)) {
        Write-Host "   Dossier $Path non trouve, pas de suppression necessaire" -ForegroundColor Yellow
        return $true
    }

    for ($i = 1; $i -le $Retries; $i++) {
        try {
            Write-Host "   Tentative $i/${Retries}: suppression $Path (Remove-Item)..." -ForegroundColor Yellow
            # Retirer les attributs lecture seule (sinon EPERM)
            cmd /c "attrib -R /S /D `"$Path\*`"" | Out-Null
            Remove-Item -Recurse -Force $Path -ErrorAction Stop
            Write-Host "   OK $Path supprime" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "   AVERTISSEMENT: suppression via Remove-Item a echoue: $($_.Exception.Message)" -ForegroundColor Yellow
            Write-Host "   Fallback: rmdir /s /q $Path" -ForegroundColor Yellow
            cmd /c "rmdir /s /q `"$Path`"" | Out-Null
            Start-Sleep -Seconds 2
            if (-not (Test-Path $Path)) {
                Write-Host "   OK $Path supprime (fallback rmdir)" -ForegroundColor Green
                return $true
            }
        }
    }

    Write-Host "   ERREUR: Impossible de supprimer $Path (EPERM/Acces refuse probable)." -ForegroundColor Red
    Write-Host "   Conseils:" -ForegroundColor Yellow
    Write-Host "    - Fermez tous les onglets/navigateurs ouverts sur localhost:3000" -ForegroundColor Gray
    Write-Host "    - Relancez PowerShell en Administrateur" -ForegroundColor Gray
    Write-Host "    - Ajoutez une exception Antivirus pour le dossier du projet" -ForegroundColor Gray
    return $false
}

# 1. Arrêter tous les processus Node.js
Write-Host "1. Arret des processus Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   Trouve $($nodeProcesses.Count) processus Node.js" -ForegroundColor Green
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "   OK Processus arretes" -ForegroundColor Green
} else {
    Write-Host "   Aucun processus Node.js actif" -ForegroundColor Yellow
}

# 2. Supprimer le dossier .next
Write-Host "2. Suppression du dossier .next..." -ForegroundColor Yellow
$ok = Remove-NextCache -Path ".next" -Retries 4
if (-not $ok) { exit 1 }

# 3. Vérifier que les composants d'erreur existent
Write-Host "3. Verification des composants d'erreur..." -ForegroundColor Yellow
$requiredFiles = @(
    "app\error.tsx",
    "app\global-error.tsx",
    "app\not-found.tsx",
    "app\loading.tsx"
)

$allExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   OK $file" -ForegroundColor Green
    } else {
        Write-Host "   ERREUR: $file manquant" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host "   Certains fichiers requis sont manquants!" -ForegroundColor Red
    exit 1
}

# 4. Vérifier le middleware
Write-Host "4. Verification du middleware..." -ForegroundColor Yellow
if (Test-Path "middleware.ts") {
    Write-Host "   OK middleware.ts existe" -ForegroundColor Green
} else {
    Write-Host "   ATTENTION: middleware.ts manquant" -ForegroundColor Yellow
}

# 5. Redémarrer le serveur
Write-Host ""
Write-Host "5. Demarrage du serveur..." -ForegroundColor Yellow
Write-Host "   Le serveur va demarrer dans quelques secondes..." -ForegroundColor Cyan
Write-Host "   Attendez que vous voyiez 'Compiled successfully' avant d'ouvrir le navigateur" -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 2

# Démarrer le serveur
npm run dev

