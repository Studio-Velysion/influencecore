# Script PowerShell pour initialiser et pousser le projet sur GitHub
# Usage: .\scripts\setup-github.ps1

Write-Host "🚀 Configuration GitHub pour InfluenceCore" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est initialisé
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

# Vérifier si un remote existe déjà
$remoteExists = git remote | Select-String -Pattern "origin"
if ($remoteExists) {
    Write-Host "⚠️  Un remote 'origin' existe déjà" -ForegroundColor Yellow
    $currentUrl = git remote get-url origin
    Write-Host "   URL actuelle: $currentUrl" -ForegroundColor Gray
    $replace = Read-Host "Voulez-vous le remplacer? (O/N)"
    if ($replace -eq "O" -or $replace -eq "o") {
        $repoUrl = Read-Host "Entrez l'URL du repository GitHub (ex: https://github.com/username/influencecore.git)"
        git remote set-url origin $repoUrl
        Write-Host "✅ Remote mis à jour" -ForegroundColor Green
    }
} else {
    Write-Host "📡 Configuration du remote GitHub..." -ForegroundColor Yellow
    $repoUrl = Read-Host "Entrez l'URL du repository GitHub (ex: https://github.com/username/influencecore.git)"
    
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "❌ URL requise. Créez d'abord un repository sur GitHub." -ForegroundColor Red
        exit 1
    }
    
    git remote add origin $repoUrl
    Write-Host "✅ Remote ajouté" -ForegroundColor Green
}

# Ajouter tous les fichiers
Write-Host ""
Write-Host "📝 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Vérifier s'il y a des changements
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  Aucun changement à commiter" -ForegroundColor Gray
} else {
    Write-Host "💾 Création du commit..." -ForegroundColor Yellow
    git commit -m "Initial commit - InfluenceCore V1 avec Stripe"
    Write-Host "✅ Commit créé" -ForegroundColor Green
}

# Demander confirmation avant de pousser
Write-Host ""
$push = Read-Host "Voulez-vous pousser sur GitHub maintenant? (O/N)"
if ($push -eq "O" -or $push -eq "o") {
    Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow
    git branch -M main
    git push -u origin main
    Write-Host ""
    Write-Host "✅ Projet poussé sur GitHub avec succès!" -ForegroundColor Green
    Write-Host ""
    $remoteUrl = git remote get-url origin
    Write-Host "🌐 Votre repository: $remoteUrl" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "ℹ️  Pour pousser plus tard, exécutez:" -ForegroundColor Gray
    Write-Host "   git branch -M main" -ForegroundColor Gray
    Write-Host "   git push -u origin main" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✨ Configuration terminée!" -ForegroundColor Green

