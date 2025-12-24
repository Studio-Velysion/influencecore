# Script pour pousser le projet sur GitHub avec le token
# Usage: .\scripts\push-to-github.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubUsername = "",
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "influencecore"
)

$token = "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"

Write-Host "🚀 Configuration GitHub pour InfluenceCore" -ForegroundColor Cyan
Write-Host ""

# Demander le nom d'utilisateur si non fourni
if ([string]::IsNullOrWhiteSpace($GitHubUsername)) {
    $GitHubUsername = Read-Host "Entrez votre nom d'utilisateur GitHub"
}

if ([string]::IsNullOrWhiteSpace($GitHubUsername)) {
    Write-Host "❌ Nom d'utilisateur requis" -ForegroundColor Red
    exit 1
}

$repoUrl = "https://github.com/$GitHubUsername/$RepoName.git"
$repoUrlWithToken = "https://$token@github.com/$GitHubUsername/$RepoName.git"

Write-Host "📡 Configuration du remote GitHub..." -ForegroundColor Yellow
Write-Host "   Repository: $repoUrl" -ForegroundColor Gray

# Vérifier si le remote existe déjà
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Un remote 'origin' existe déjà: $existingRemote" -ForegroundColor Yellow
    $replace = Read-Host "Voulez-vous le remplacer? (O/N)"
    if ($replace -eq "O" -or $replace -eq "o") {
        git remote remove origin
        git remote add origin $repoUrlWithToken
        Write-Host "✅ Remote mis à jour" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Utilisation du remote existant" -ForegroundColor Gray
    }
} else {
    git remote add origin $repoUrlWithToken
    Write-Host "✅ Remote ajouté" -ForegroundColor Green
}

# Renommer la branche en 'main'
Write-Host ""
Write-Host "🔄 Renommage de la branche en 'main'..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ Branche renommée" -ForegroundColor Green

# Pousser le code
Write-Host ""
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Projet poussé sur GitHub avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Votre repository: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  SÉCURITÉ: Le token a été utilisé temporairement." -ForegroundColor Yellow
    Write-Host "   Pour les prochains pushs, configurez Git Credential Manager:" -ForegroundColor Yellow
    Write-Host "   git config --global credential.helper manager-core" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du push. Vérifiez:" -ForegroundColor Red
    Write-Host "   1. Le repository existe sur GitHub" -ForegroundColor Gray
    Write-Host "   2. Le token a les permissions 'repo'" -ForegroundColor Gray
    Write-Host "   3. Votre connexion internet" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "✨ Configuration terminée!" -ForegroundColor Green

