Write-Host '🚀 112 Energie Development Environment' -ForegroundColor Cyan
Write-Host '======================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Opening VS Code workspace...' -ForegroundColor Yellow
code 112energie.code-workspace

Write-Host 'Git Status:' -ForegroundColor Yellow
git status --short

Write-Host ''
Write-Host 'Quick Commands:' -ForegroundColor Green
Write-Host '  git st                 - Check status' -ForegroundColor White
Write-Host '  git co development     - Switch to dev branch' -ForegroundColor White
Write-Host '  .\nav.ps1 front       - Navigate to frontend' -ForegroundColor White
Write-Host '  code .                - Open current folder in VS Code' -ForegroundColor White
Write-Host ''
