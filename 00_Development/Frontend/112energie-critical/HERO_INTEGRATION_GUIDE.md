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
