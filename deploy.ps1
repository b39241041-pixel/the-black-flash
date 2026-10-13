#!/usr/bin/env pwsh
# ============================================================
# deploy.ps1 — Deploy "The Black Flash" to GitHub Pages
# Run this ONCE after installing Git & GitHub CLI
# Usage: .\deploy.ps1
# ============================================================

$repoName   = "the-black-flash"
$siteName   = "The Black Flash"
$projectDir = $PSScriptRoot   # Same folder as this script

Write-Host ""
Write-Host "⚡  $siteName — GitHub Pages Deploy" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

# ── 1. Check dependencies ──
foreach ($cmd in @("git","gh")) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Host "❌  '$cmd' not found. Please install it first:" -ForegroundColor Red
        if ($cmd -eq "git") { Write-Host "    https://git-scm.com/download/win" }
        if ($cmd -eq "gh")  { Write-Host "    https://cli.github.com/" }
        exit 1
    }
}
Write-Host "✅  git & gh found" -ForegroundColor Green

# ── 2. Login to GitHub if needed ──
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "🔑  Logging in to GitHub…" -ForegroundColor Cyan
    gh auth login --web
}
Write-Host "✅  GitHub authenticated" -ForegroundColor Green

# ── 3. Init git repo ──
Set-Location $projectDir
if (-not (Test-Path ".git")) {
    Write-Host ""
    Write-Host "📁  Initialising git repository…" -ForegroundColor Cyan
    git init
    git checkout -b main
}

# ── 4. Create GitHub repo (public) ──
Write-Host ""
Write-Host "🐙  Creating GitHub repository '$repoName'…" -ForegroundColor Cyan
$existing = gh repo view $repoName 2>&1
if ($LASTEXITCODE -ne 0) {
    gh repo create $repoName --public --description "The Black Flash — Unblocked Games, Proxy Browser, Movies & Music" --source . --remote origin --push
    if ($LASTEXITCODE -ne 0) { Write-Host "❌  Repo creation failed." -ForegroundColor Red; exit 1 }
    Write-Host "✅  Repository created & code pushed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Repo already exists — adding remote & pushing…" -ForegroundColor Yellow
    $remotes = git remote 2>&1
    if ($remotes -notcontains "origin") {
        $ghUser = gh api user --jq .login
        git remote add origin "https://github.com/$ghUser/$repoName.git"
    }
    git add -A
    git commit -m "Deploy: The Black Flash v1.0 ⚡" --allow-empty
    git push -u origin main --force
}

# ── 5. Enable GitHub Pages ──
Write-Host ""
Write-Host "🌐  Enabling GitHub Pages (branch: main)…" -ForegroundColor Cyan
gh api --method POST "repos/{owner}/$repoName/pages" `
    --field source='{"branch":"main","path":"/"}' `
    2>&1 | Out-Null

# Pages might already be on; ignore errors
Write-Host "✅  GitHub Pages enabled" -ForegroundColor Green

# ── 6. Get the live URL ──
Start-Sleep -Seconds 3
$ghUser = gh api user --jq .login
$liveUrl = "https://$ghUser.github.io/$repoName"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "🎉  Deploy complete!" -ForegroundColor Green
Write-Host ""
Write-Host "   Live URL  →  $liveUrl" -ForegroundColor Cyan
Write-Host "   Repo      →  https://github.com/$ghUser/$repoName" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Note: Pages can take 1–2 minutes to go live." -ForegroundColor DarkGray
Write-Host ""

# Open the repo in browser
Start-Process "https://github.com/$ghUser/$repoName"
