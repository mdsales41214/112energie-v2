console.log('112 Energie Platform Loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Ready - Initializing 112 Energie');
    
    // CTA Button handler
    const ctaButton = document.querySelector('.cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            alert('Welkom bij 112 Energie! Bel ons voor direct hulp.');
        });
    }
});
