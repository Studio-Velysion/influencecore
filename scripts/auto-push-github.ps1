# Script automatique pour pousser sur GitHub
# Ce script va essayer plusieurs methodes d'authentification

$repoUrl = "https://github.com/Studio-Velysion/influencecore.git"
$oldToken = "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"

Write-Host "🚀 Push automatique vers GitHub..." -ForegroundColor Cyan
Write-Host ""

# Configurer le remote
git remote set-url origin $repoUrl
Write-Host "✅ Remote configure: $repoUrl" -ForegroundColor Green
Write-Host ""

# Methode 1: Essayer avec le token dans l'URL
Write-Host "📡 Tentative 1: Authentification avec token..." -ForegroundColor Yellow
git remote set-url origin "https://$oldToken@github.com/Studio-Velysion/influencecore.git"
$result = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Projet pousse sur GitHub avec succes!" -ForegroundColor Green
    Write-Host "🌐 Repository: $repoUrl" -ForegroundColor Cyan
    exit 0
}

Write-Host "❌ Echec avec le token actuel" -ForegroundColor Red
Write-Host ""

# Methode 2: Demander un nouveau token
Write-Host "⚠️  Le token actuel n'a pas les permissions d'ecriture." -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour creer un nouveau token avec les bonnes permissions:" -ForegroundColor Cyan
Write-Host "1. Ouvrez: https://github.com/settings/tokens/new" -ForegroundColor Gray
Write-Host "2. Note: InfluenceCore Deploy" -ForegroundColor Gray
Write-Host "3. Expiration: 90 jours (ou plus)" -ForegroundColor Gray
Write-Host "4. Scopes: COCHEZ 'repo' (acces complet)" -ForegroundColor Gray
Write-Host "5. Cliquez sur 'Generate token'" -ForegroundColor Gray
Write-Host "6. COPIEZ le token immediatement" -ForegroundColor Gray
Write-Host ""

$newToken = Read-Host "Collez votre nouveau token ici (ou appuyez sur Entree pour annuler)"

if ([string]::IsNullOrWhiteSpace($newToken)) {
    Write-Host ""
    Write-Host "❌ Operation annulee" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour pousser plus tard, utilisez:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Gray
    Write-Host "  (Git vous demandera vos identifiants)" -ForegroundColor Gray
    exit 1
}

# Essayer avec le nouveau token
Write-Host ""
Write-Host "📡 Tentative avec le nouveau token..." -ForegroundColor Yellow
git remote set-url origin "https://$newToken@github.com/Studio-Velysion/influencecore.git"
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Projet pousse sur GitHub avec succes!" -ForegroundColor Green
    Write-Host "🌐 Repository: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💾 Le token sera sauvegarde dans Git Credential Manager" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Echec. Verifiez:" -ForegroundColor Red
    Write-Host "   - Le token a le scope 'repo' complet" -ForegroundColor Gray
    Write-Host "   - Le repository existe: $repoUrl" -ForegroundColor Gray
    Write-Host "   - Votre connexion internet" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Alternative: Utilisez GitHub CLI (plus simple)" -ForegroundColor Yellow
    Write-Host "  winget install GitHub.cli" -ForegroundColor Gray
    Write-Host "  gh auth login" -ForegroundColor Gray
    Write-Host "  git push -u origin main" -ForegroundColor Gray
}

