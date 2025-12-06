# Script sécurisé pour pousser le projet sur GitHub
# Le token est passé en paramètre ou via variable d'environnement
# Usage: .\scripts\push-to-github-secure.ps1 -GitHubUsername "VOTRE_USERNAME" -Token "VOTRE_TOKEN"

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    [Parameter(Mandatory=$false)]
    [string]$Token = $env:GITHUB_TOKEN,
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "influencecore"
)

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host "❌ Token GitHub requis" -ForegroundColor Red
    Write-Host "   Utilisez: -Token 'VOTRE_TOKEN' ou définissez la variable GITHUB_TOKEN" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Configuration GitHub pour InfluenceCore" -ForegroundColor Cyan
Write-Host ""

$repoUrl = "https://github.com/$GitHubUsername/$RepoName.git"
$repoUrlWithToken = "https://$Token@github.com/$GitHubUsername/$RepoName.git"

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
        # Mettre à jour l'URL avec le token
        git remote set-url origin $repoUrlWithToken
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
    Write-Host "✨ Configuration terminée!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du push. Vérifiez:" -ForegroundColor Red
    Write-Host "   1. Le repository existe sur GitHub: $repoUrl" -ForegroundColor Gray
    Write-Host "   2. Le token a les permissions 'repo'" -ForegroundColor Gray
    Write-Host "   3. Votre connexion internet" -ForegroundColor Gray
    exit 1
}

