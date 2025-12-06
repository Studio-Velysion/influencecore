# Script pour pousser avec le token - Format alternatif
# Ce script utilise le token directement dans la commande git

$token = "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"
$repoUrl = "https://github.com/Studio-Velysion/influencecore.git"

Write-Host "🚀 Configuration et push vers GitHub..." -ForegroundColor Cyan
Write-Host ""

# Configurer le remote
Write-Host "📡 Configuration du remote..." -ForegroundColor Yellow
git remote set-url origin $repoUrl

# Configurer Git pour utiliser le token
$env:GIT_ASKPASS = "echo"
$env:GIT_TERMINAL_PROMPT = "0"

# Créer un fichier temporaire avec les credentials
$credFile = "$env:TEMP\git-cred.txt"
"https://$token@github.com" | Out-File -FilePath $credFile -Encoding ASCII

# Configurer Git credential helper
git config --global credential.helper "store --file=$credFile"

Write-Host "✅ Configuration terminée" -ForegroundColor Green
Write-Host ""

# Essayer de pousser
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Projet poussé sur GitHub avec succès!" -ForegroundColor Green
    Write-Host "🌐 Repository: $repoUrl" -ForegroundColor Cyan
    
    # Nettoyer le fichier de credentials
    Remove-Item $credFile -ErrorAction SilentlyContinue
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du push" -ForegroundColor Red
    Write-Host ""
    Write-Host "Le token n'a probablement pas les permissions nécessaires." -ForegroundColor Yellow
    Write-Host "Vérifiez que le token a le scope 'repo' complet." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour creer un nouveau token avec les bonnes permissions:" -ForegroundColor Cyan
    Write-Host "1. Allez sur: https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host "2. Generate new token (classic)" -ForegroundColor Gray
    Write-Host "3. Cochez 'repo' (acces complet)" -ForegroundColor Gray
    Write-Host "4. Generez et copiez le nouveau token" -ForegroundColor Gray
}

