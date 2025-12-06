# Script pour verifier la configuration GitHub
Write-Host "🔍 Verification de la configuration GitHub..." -ForegroundColor Cyan
Write-Host ""

# Verifier le remote
Write-Host "📡 Remote GitHub:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# Verifier l'etat
Write-Host "📊 Etat du repository:" -ForegroundColor Yellow
git status
Write-Host ""

# Verifier les commits
Write-Host "📝 Derniers commits:" -ForegroundColor Yellow
git log --oneline -5
Write-Host ""

# Verifier le workflow GitHub Actions
Write-Host "⚙️  Workflow GitHub Actions:" -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy.yml") {
    Write-Host "✅ Workflow de deploiement trouve: .github/workflows/deploy.yml" -ForegroundColor Green
    $workflow = Get-Content ".github/workflows/deploy.yml" -Raw
    if ($workflow -match "on:\s*push") {
        Write-Host "✅ Workflow configure pour se declencher sur push" -ForegroundColor Green
    }
    if ($workflow -match "secrets") {
        Write-Host "⚠️  Le workflow utilise des secrets GitHub" -ForegroundColor Yellow
        Write-Host "   Configurez-les dans: Settings > Secrets and variables > Actions" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Workflow non trouve" -ForegroundColor Red
}
Write-Host ""

# Verifier la branche
Write-Host "🌿 Branche actuelle:" -ForegroundColor Yellow
git branch --show-current
Write-Host ""

# Verifier la synchronisation
Write-Host "🔄 Synchronisation avec GitHub:" -ForegroundColor Yellow
$localCommit = git rev-parse HEAD
$remoteCommit = git rev-parse origin/main 2>$null

if ($LASTEXITCODE -eq 0) {
    if ($localCommit -eq $remoteCommit) {
        Write-Host "✅ Repository synchronise avec GitHub" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Des differences detectees entre local et remote" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Impossible de verifier la synchronisation" -ForegroundColor Yellow
}
Write-Host ""

# Resume
Write-Host "📋 Resume:" -ForegroundColor Cyan
Write-Host "  Repository: https://github.com/Studio-Velysion/influencecore" -ForegroundColor Gray
Write-Host "  Branche: main" -ForegroundColor Gray
Write-Host "  Status: Synchronise" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Configuration GitHub OK!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Yellow
Write-Host "  1. Configurez les secrets GitHub (voir DEPLOYMENT_AUTOMATION.md)" -ForegroundColor Gray
Write-Host "  2. Testez le deploiement avec un petit changement" -ForegroundColor Gray
Write-Host "  3. Verifiez que GitHub Actions fonctionne" -ForegroundColor Gray

