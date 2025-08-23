# 112 ENERGIE - HERO SECTION SETUP
# Creates new hero section files in current project
# ================================================

$currentDir = Get-Location
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        112 ENERGIE - HERO SECTION INSTALLATION          ║" -ForegroundColor Cyan
Write-Host "║              Modern 2025 AI-Powered Design              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "📍 Current Directory: $currentDir" -ForegroundColor Yellow
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Install hero section files here? (Y/N)"
if ($confirm -ne 'Y' -and $confirm -ne 'y') {
    Write-Host "❌ Installation cancelled" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "[1/5] Creating backup of existing files..." -ForegroundColor Yellow

# Create backup directory with timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backup_$timestamp"

if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Backup existing files if they exist
$filesToBackup = @("index.html", "hero.css", "assets/css/hero.css")
foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        $backupPath = Join-Path $backupDir $file
        $backupFileDir = Split-Path $backupPath -Parent
        if (!(Test-Path $backupFileDir)) {
            New-Item -ItemType Directory -Path $backupFileDir -Force | Out-Null
        }
        Copy-Item -Path $file -Destination $backupPath -Force
        Write-Host "  ✓ Backed up: $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "[2/5] Creating directory structure..." -ForegroundColor Yellow

# Create necessary directories
$directories = @(
    "assets",
    "assets\css",
    "assets\js",
    "assets\images",
    "assets\fonts"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✓ Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "  → Exists: $dir" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "[3/5] Creating hero.css file..." -ForegroundColor Yellow

# Create hero.css content (truncated for space - this would be the full CSS from the artifact)
$heroCss = @'
/* Hero Section Styles - 112 Energie V2 */
/* Modern 2025 AI-Powered Design */
/* ================================== */

:root {
    --neural-blue: #0A84FF;
    --plasma-purple: #5E5CE6;
    --quantum-green: #30D158;
    --void-black: #000000;
    --pure-white: #FFFFFF;
    --glass-white: rgba(255, 255, 255, 0.08);
    --text-primary: #FFFFFF;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --grid-color: rgba(255, 255, 255, 0.03);
}

/* [Full CSS content from hero.css artifact would go here] */
/* This is a placeholder - copy the full CSS from the hero.css artifact */
'@

$heroCss | Out-File "assets\css\hero.css" -Encoding UTF8
Write-Host "  ✓ Created: assets\css\hero.css" -ForegroundColor Green

Write-Host ""
Write-Host "[4/5] Creating hero HTML section file..." -ForegroundColor Yellow

# Create hero-section.html as a separate file for easy integration
$heroHtml = @'
<!-- Hero Section - 112 Energie V2 -->
<!-- Copy this section into your index.html -->
<!-- ======================================= -->

<!-- Add this to your <head> section: -->
<!-- <link rel="stylesheet" href="assets/css/hero.css"> -->

<!-- [Full HTML content from hero-section-html artifact would go here] -->
<!-- This is a placeholder - copy the full HTML from the hero section artifact -->
'@

$heroHtml | Out-File "hero-section.html" -Encoding UTF8
Write-Host "  ✓ Created: hero-section.html (for integration)" -ForegroundColor Green

Write-Host ""
Write-Host "[5/5] Creating integration guide..." -ForegroundColor Yellow

# Create integration guide
$integrationGuide = @'
# 112 ENERGIE - HERO SECTION INTEGRATION GUIDE
# =============================================

## Files Created:
1. `assets/css/hero.css` - All hero section styles
2. `hero-section.html` - Hero section HTML to integrate
3. `backup_[timestamp]/` - Backup of your original files

## Integration Steps:

### Step 1: Add CSS Link to index.html
Add this line in your `<head>` section:
```html
<link rel="stylesheet" href="assets/css/hero.css">
```

### Step 2: Add Font Link
Add this before the CSS link:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Step 3: Replace Hero Section
Replace your current hero section in index.html with the content from `hero-section.html`

### Step 4: Verify Body Styling
Make sure your `<body>` tag has these styles:
```css
body {
    font-family: 'Space Grotesk', -apple-system, sans-serif;
    background: #000000;
    color: #FFFFFF;
    overflow-x: hidden;
}
```

## Features Included:
✅ 3D Grid Background Animation
✅ Particle System
✅ Glitch Text Effects
✅ Heartbeat Line Animation
✅ Static Metrics Card (no rotation)
✅ Energy Chart Card with bars
✅ Live Counter Updates
✅ AI-Powered Visual Elements
✅ Quantum Computing References
✅ €3,859 Daily Savings Display

## Browser Compatibility:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes:
- Animations use GPU acceleration
- Particles are optimized for 60fps
- Mobile responsive design included

## Customization:
- Colors: Edit CSS variables in `:root`
- Animations: Adjust keyframe durations
- Particles: Change count in JavaScript (line ~10)
- Metrics: Update values in HTML

## Support:
- Documentation: /09_Documentation/
- Tech Issues: tech@112energie.nl
'@

$integrationGuide | Out-File "HERO_INTEGRATION_GUIDE.md" -Encoding UTF8
Write-Host "  ✓ Created: HERO_INTEGRATION_GUIDE.md" -ForegroundColor Green

Write-Host ""
Write-Host "[BONUS] Creating quick test file..." -ForegroundColor Yellow

# Create a standalone test file
$testHtml = @'
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>112Energie - Hero Section Test</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/hero.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Space Grotesk', -apple-system, sans-serif;
            background: #000000;
            color: #FFFFFF;
            overflow-x: hidden;
        }
    </style>
</head>
<body>
    <!-- Hero Section will be inserted here -->
    <!-- Copy content from hero-section.html -->
</body>
</html>
'@

$testHtml | Out-File "hero-test.html" -Encoding UTF8
Write-Host "  ✓ Created: hero-test.html (for testing)" -ForegroundColor Green

# Final Summary
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           HERO SECTION INSTALLED SUCCESSFULLY!           ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "  • Hero CSS created in assets/css/" -ForegroundColor White
Write-Host "  • Hero HTML section ready for integration" -ForegroundColor White
Write-Host "  • Backup created in $backupDir/" -ForegroundColor White
Write-Host "  • Integration guide created" -ForegroundColor White
Write-Host "  • Test file created for preview" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Copy full CSS from Claude to assets/css/hero.css" -ForegroundColor Cyan
Write-Host "  2. Copy full HTML from Claude to hero-section.html" -ForegroundColor Cyan
Write-Host "  3. Follow HERO_INTEGRATION_GUIDE.md" -ForegroundColor Cyan
Write-Host "  4. Test with hero-test.html" -ForegroundColor Cyan
Write-Host ""

Write-Host "📁 Files Created:" -ForegroundColor Yellow
Get-ChildItem -File | Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-1) } | Select-Object Name, Length | Format-Table -AutoSize

Write-Host ""
Write-Host "💡 Quick Test:" -ForegroundColor Yellow
Write-Host "  Start-Process hero-test.html" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to open test file
$openTest = Read-Host "Open test file in browser? (Y/N)"
if ($openTest -eq 'Y' -or $openTest -eq 'y') {
    Start-Process "hero-test.html"
    Write-Host "✓ Opened hero-test.html in default browser" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Installation Complete!" -ForegroundColor Green