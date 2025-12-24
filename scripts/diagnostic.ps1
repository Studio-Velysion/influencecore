# Script de diagnostic complet pour InfluenceCore
# Usage: .\scripts\diagnostic.ps1

Write-Host "=== Diagnostic InfluenceCore ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verifier Node.js
Write-Host "1. Verification de Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "   OK Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: Node.js n'est pas installe" -ForegroundColor Red
    exit 1
}

# 2. Verifier npm
Write-Host "2. Verification de npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "   OK npm: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: npm n'est pas installe" -ForegroundColor Red
    exit 1
}

# 3. Verifier les dependances
Write-Host "3. Verification des dependances..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   OK node_modules existe" -ForegroundColor Green
    
    if (Test-Path "node_modules\next") {
        Write-Host "   OK Next.js installe" -ForegroundColor Green
    } else {
        Write-Host "   ERREUR: Next.js non installe" -ForegroundColor Red
        Write-Host "   Executez: npm install" -ForegroundColor Yellow
    }
    
    if (Test-Path "node_modules\@chakra-ui\react") {
        Write-Host "   OK Chakra UI installe" -ForegroundColor Green
    } else {
        Write-Host "   ATTENTION: Chakra UI non installe" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ERREUR: node_modules n'existe pas" -ForegroundColor Red
    Write-Host "   Executez: npm install" -ForegroundColor Yellow
}

# 4. Verifier les fichiers de configuration
Write-Host "4. Verification des fichiers de configuration..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "   OK package.json existe" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: package.json manquant" -ForegroundColor Red
    exit 1
}

if (Test-Path "next.config.js") {
    Write-Host "   OK next.config.js existe" -ForegroundColor Green
} else {
    Write-Host "   ATTENTION: next.config.js manquant" -ForegroundColor Yellow
}

# 5. Verifier les fichiers d'environnement
Write-Host "5. Verification des fichiers d'environnement..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   OK .env.local existe" -ForegroundColor Green
    $envContent = Get-Content ".env.local" -ErrorAction SilentlyContinue
    if ($envContent -match "ENABLE_LOGS=true") {
        Write-Host "   OK Logs actives dans .env.local" -ForegroundColor Green
    } else {
        Write-Host "   ATTENTION: Logs non actives dans .env.local" -ForegroundColor Yellow
        Write-Host "   Executez: .\scripts\enable-logs.ps1" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ATTENTION: .env.local n'existe pas" -ForegroundColor Yellow
    Write-Host "   Executez: .\scripts\enable-logs.ps1" -ForegroundColor Yellow
}

# 6. Verifier le dossier .next
Write-Host "6. Verification du cache Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Write-Host "   OK Dossier .next existe" -ForegroundColor Green
    try {
        $nextSize = (Get-ChildItem ".next" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "   Taille: $([math]::Round($nextSize, 2)) MB" -ForegroundColor Gray
    } catch {
        Write-Host "   Impossible de calculer la taille" -ForegroundColor Gray
    }
} else {
    Write-Host "   ATTENTION: Dossier .next n'existe pas" -ForegroundColor Yellow
}

# 7. Verifier les processus Node.js
Write-Host "7. Verification des processus Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   OK $($nodeProcesses.Count) processus Node.js actifs" -ForegroundColor Green
    $nodeProcesses | ForEach-Object {
        Write-Host "      PID: $($_.Id) | Demarrage: $($_.StartTime)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ATTENTION: Aucun processus Node.js actif" -ForegroundColor Yellow
    Write-Host "   Le serveur n'est peut-etre pas demarre" -ForegroundColor Yellow
}

# 8. Verifier les ports
Write-Host "8. Verification des ports..." -ForegroundColor Yellow
try {
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    $port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

    if ($port3000) {
        Write-Host "   OK Port 3000 est utilise" -ForegroundColor Green
    } else {
        Write-Host "   Port 3000 est libre" -ForegroundColor Gray
    }

    if ($port3001) {
        Write-Host "   OK Port 3001 est utilise" -ForegroundColor Green
    } else {
        Write-Host "   Port 3001 est libre" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Impossible de verifier les ports" -ForegroundColor Gray
}

# 9. Resume
Write-Host ""
Write-Host "=== Resume ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour demarrer le serveur:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour tester si Next.js fonctionne:" -ForegroundColor White
Write-Host "  Ouvrez: http://localhost:3001/test" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour activer les logs:" -ForegroundColor White
Write-Host "  .\scripts\enable-logs.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour voir les logs dans le navigateur (F12):" -ForegroundColor White
Write-Host '  showLogs()' -ForegroundColor Gray
Write-Host ""
