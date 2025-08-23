// Component Loader for Header and Footer
async function loadComponents() {
    // Load Header
    const headerResponse = await fetch('components/header.html');
    const headerHTML = await headerResponse.text();
    document.getElementById('header-placeholder').innerHTML = headerHTML;
    
    // Load Footer
    const footerResponse = await fetch('components/footer.html');
    const footerHTML = await footerResponse.text();
    document.getElementById('footer-placeholder').innerHTML = footerHTML;
    
    // Initialize navigation
    initializeNavigation();
}

function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

function closeBanner() {
    const banner = document.getElementById('emergencyBanner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents);
