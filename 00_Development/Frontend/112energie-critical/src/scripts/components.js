/**
 * Component Loader and Manager
 * Handles dynamic loading of HTML components
 */

'use strict';

class ComponentManager {
    constructor() {
        this.loadedComponents = new Set();
        this.componentCache = new Map();
        this.observers = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🧩 Initializing Component Manager...');
        
        this.setupComponentLoading();
        this.initializeExistingComponents();
        
        console.log('✅ Component Manager initialized');
    }
    
    setupComponentLoading() {
        // Auto-load components with data-component attribute
        this.loadAutoComponents();
        
        // Setup component observer for dynamic components
        this.setupComponentObserver();
    }
    
    loadAutoComponents() {
        const autoComponents = document.querySelectorAll('[data-component]');
        autoComponents.forEach(element => {
            const componentPath = element.dataset.component;
            this.loadComponent(element, componentPath);
        });
    }
    
    setupComponentObserver() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const componentElements = node.querySelectorAll('[data-component]');
                            componentElements.forEach(element => {
                                const componentPath = element.dataset.component;
                                this.loadComponent(element, componentPath);
                            });
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            this.observers.set('component', observer);
        }
    }
    
    async loadComponent(container, componentPath, options = {}) {
        try {
            // Check if already loaded
            const componentId = `${componentPath}-${container.id || Math.random()}`;
            if (this.loadedComponents.has(componentId)) {
                return;
            }
            
            // Show loading state
            if (options.showLoading !== false) {
                this.showLoadingState(container);
            }
            
            // Check cache
            let html;
            if (this.componentCache.has(componentPath)) {
                html = this.componentCache.get(componentPath);
            } else {
                // Fetch component
                const response = await fetch(componentPath);
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${response.status}`);
                }
                
                html = await response.text();
                
                // Cache the component
                this.componentCache.set(componentPath, html);
            }
            
            // Insert HTML
            container.innerHTML = html;
            
            // Initialize component scripts
            await this.initializeComponentScripts(container);
            
            // Initialize component styles
            this.initializeComponentStyles(container);
            
            // Mark as loaded
            this.loadedComponents.add(componentId);
            
            // Dispatch loaded event
            container.dispatchEvent(new CustomEvent('componentLoaded', {
                detail: { path: componentPath, container }
            }));
            
            console.log(`✅ Component loaded: ${componentPath}`);
            
        } catch (error) {
            console.error(`❌ Failed to load component ${componentPath}:`, error);
            this.showErrorState(container, error.message);
        }
    }
    
    showLoadingState(container) {
        container.innerHTML = `
            <div class="component-loading">
                <div class="loading-spinner"></div>
                <span class="loading-text">Laden...</span>
            </div>
        `;
    }
    
    showErrorState(container, message) {
        container.innerHTML = `
            <div class="component-error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">
                    <strong>Component Load Error</strong>
                    <p>${message}</p>
                </div>
            </div>
        `;
    }
    
    async initializeComponentScripts(container) {
        const scriptElements = container.querySelectorAll('script');
        
        for (const scriptElement of scriptElements) {
            if (scriptElement.src) {
                // External script
                await this.loadExternalScript(scriptElement.src);
            } else {
                // Inline script
                this.executeInlineScript(scriptElement.textContent);
            }
        }
    }
    
    loadExternalScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            
            document.head.appendChild(script);
        });
    }
    
    executeInlineScript(scriptContent) {
        try {
            const script = document.createElement('script');
            script.textContent = scriptContent;
            document.head.appendChild(script);
            document.head.removeChild(script);
        } catch (error) {
            console.error('Error executing inline script:', error);
        }
    }
    
    initializeComponentStyles(container) {
        const styleElements = container.querySelectorAll('style, link[rel="stylesheet"]');
        
        styleElements.forEach(styleElement => {
            if (styleElement.tagName === 'LINK') {
                // External stylesheet
                if (!document.querySelector(`link[href="${styleElement.href}"]`)) {
                    document.head.appendChild(styleElement.cloneNode(true));
                }
            } else {
                // Inline styles
                if (!document.querySelector(`style[data-component="${styleElement.dataset.component}"]`)) {
                    const clonedStyle = styleElement.cloneNode(true);
                    document.head.appendChild(clonedStyle);
                }
            }
        });
    }
    
    initializeExistingComponents() {
        // Initialize header component functionality
        this.initializeHeader();
        
        // Initialize footer component functionality  
        this.initializeFooter();
        
        // Initialize other existing components
        this.initializeNavigation();
    }
    
    initializeHeader() {
        const header = document.querySelector('.main-header');
        if (!header) return;
        
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navOverlay = document.getElementById('navOverlay');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.contains('active');
                
                if (isOpen) {
                    this.closeNavigation();
                } else {
                    this.openNavigation();
                }
            });
        }
        
        if (navOverlay) {
            navOverlay.addEventListener('click', () => {
                this.closeNavigation();
            });
        }
        
        // Scroll behavior
        this.setupHeaderScrollBehavior();
        
        console.log('✅ Header component initialized');
    }
    
    openNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navOverlay = document.getElementById('navOverlay');
        
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        
        navToggle.setAttribute('aria-expanded', 'true');
        navOverlay.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstLink = navMenu.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }
    }
    
    closeNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navOverlay = document.getElementById('navOverlay');
        
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        
        navToggle.setAttribute('aria-expanded', 'false');
        navOverlay.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        navToggle.focus();
    }
    
    setupHeaderScrollBehavior() {
        const header = document.querySelector('.main-header');
        if (!header) return;
        
        let lastScrollY = window.scrollY;
        let scrollTimer = null;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDifference = Math.abs(currentScrollY - lastScrollY);
            
            // Add scrolled class when scrolled down
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on desktop
            if (window.innerWidth > 768 && scrollDifference > 5) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling down
                    header.classList.add('hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('hidden');
                }
            }
            
            lastScrollY = currentScrollY;
        };
        
        window.addEventListener('scroll', () => {
            if (scrollTimer) {
                cancelAnimationFrame(scrollTimer);
            }
            scrollTimer = requestAnimationFrame(handleScroll);
        }, { passive: true });
    }
    
    initializeFooter() {
        const footer = document.querySelector('.main-footer');
        if (!footer) return;
        
        // Initialize footer interactions
        this.setupFooterAnimations();
        
        console.log('✅ Footer component initialized');
    }
    
    setupFooterAnimations() {
        const footer = document.querySelector('.main-footer');
        if (!footer || !('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        const footerSections = footer.querySelectorAll('.footer-section');
        footerSections.forEach(section => {
            observer.observe(section);
        });
        
        this.observers.set('footer', observer);
    }
    
    initializeNavigation() {
        // Close mobile menu on link click
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeNavigation();
                }
            });
        });
        
        // ESC key to close navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeNavigation();
            }
        });
    }
    
    // Public API
    async load(selector, componentPath, options = {}) {
        const container = document.querySelector(selector);
        if (!container) {
            throw new Error(`Container not found: ${selector}`);
        }
        
        return this.loadComponent(container, componentPath, options);
    }
    
    unload(selector) {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = '';
            // Remove from loaded components
            this.loadedComponents.forEach(componentId => {
                if (componentId.includes(selector)) {
                    this.loadedComponents.delete(componentId);
                }
            });
        }
    }
    
    reload(selector, componentPath, options = {}) {
        this.unload(selector);
        return this.load(selector, componentPath, options);
    }
    
    clearCache(componentPath = null) {
        if (componentPath) {
            this.componentCache.delete(componentPath);
        } else {
            this.componentCache.clear();
        }
    }
    
    // Cleanup
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.componentCache.clear();
        this.loadedComponents.clear();
    }
}

// Global component loading function
window.loadComponent = async function(containerId, componentPath) {
    if (!window.componentManager) {
        window.componentManager = new ComponentManager();
    }
    
    return window.componentManager.load(`#${containerId}`, componentPath);
};

// Component loading CSS
const componentCSS = `
.component-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    color: var(--text-secondary);
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-top: 2px solid var(--neural-blue);
    border-radius: 50%;
    animation: component-spinner 1s linear infinite;
}

@keyframes component-spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.component-error {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.3);
    border-radius: 8px;
    color: #dc3545;
}

.error-icon {
    font-size: 1.5rem;
}

.error-message strong {
    display: block;
    margin-bottom: 0.25rem;
}

.error-message p {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.8;
}

.footer-section.animate-in {
    animation: footer-section-in 0.6s ease-out;
}

@keyframes footer-section-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = componentCSS;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.componentManager = new ComponentManager();
});

console.log('🔗 Components JS Loaded');