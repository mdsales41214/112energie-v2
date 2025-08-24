/**
 * Hero Section Interactive Controller
 * Advanced animations and interactions for the hero section
 */

'use strict';

class HeroController {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.glitchElements = document.querySelectorAll('.glitch');
        this.particleContainer = document.getElementById('particles-container');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        if (!this.hero) return;
        
        console.log('🎯 Initializing Hero Controller...');
        
        this.setupEventListeners();
        this.initializeGlitchEffect();
        this.initializeParallaxEffect();
        this.initializeTypewriterEffect();
        
        console.log('✅ Hero Controller initialized');
    }
    
    setupEventListeners() {
        // Mouse movement for parallax
        this.hero.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        // Glitch on click
        this.glitchElements.forEach(element => {
            element.addEventListener('click', () => {
                this.triggerGlitch(element);
            });
        });
        
        // Intersection observer for hero reveal
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateHeroReveal();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(this.hero);
        }
    }
    
    handleMouseMove(e) {
        const rect = this.hero.getBoundingClientRect();
        this.mousePosition = {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height
        };
        
        this.updateParallaxLayers();
    }
    
    updateParallaxLayers() {
        const gridPlane = this.hero.querySelector('.grid-plane');
        const heroVisual = this.hero.querySelector('.hero-visual');
        
        if (gridPlane) {
            const translateX = (this.mousePosition.x - 0.5) * 20;
            const translateY = (this.mousePosition.y - 0.5) * 20;
            gridPlane.style.transform = `rotateX(60deg) translateZ(-100px) translate(${translateX}px, ${translateY}px)`;
        }
        
        if (heroVisual) {
            const translateX = (this.mousePosition.x - 0.5) * 10;
            const translateY = (this.mousePosition.y - 0.5) * 10;
            heroVisual.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    }
    
    initializeGlitchEffect() {
        this.glitchElements.forEach(element => {
            // Random glitch triggers
            setInterval(() => {
                if (Math.random() < 0.1) { // 10% chance every interval
                    this.triggerGlitch(element, 'subtle');
                }
            }, 5000);
        });
    }
    
    triggerGlitch(element, intensity = 'normal') {
        const glitchClass = intensity === 'subtle' ? 'glitch-subtle' : 'glitch-intense';
        
        element.classList.add(glitchClass);
        
        setTimeout(() => {
            element.classList.remove(glitchClass);
        }, intensity === 'subtle' ? 200 : 500);
    }
    
    initializeParallaxEffect() {
        // Additional parallax layers can be added here
        const metricCards = this.hero.querySelectorAll('.metric-card');
        
        metricCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.animateMetricCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateMetricCard(card, 'leave');
            });
        });
    }
    
    animateMetricCard(card, action) {
        if (action === 'enter') {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(10, 132, 255, 0.3)';
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    }
    
    initializeTypewriterEffect() {
        const subtitle = this.hero.querySelector('.subtitle');
        if (!subtitle) return;
        
        // Store original text
        const originalText = subtitle.innerHTML;
        
        // Only run typewriter on first load
        if (sessionStorage.getItem('hero-typewriter-shown')) {
            return;
        }
        
        // Clear text and start typewriter
        subtitle.innerHTML = '';
        this.typeWriter(subtitle, originalText, 0, 30);
        
        // Mark as shown
        sessionStorage.setItem('hero-typewriter-shown', 'true');
    }
    
    typeWriter(element, html, index, speed) {
        if (index < html.length) {
            element.innerHTML += html.charAt(index);
            setTimeout(() => {
                this.typeWriter(element, html, index + 1, speed);
            }, speed);
        }
    }
    
    animateHeroReveal() {
        const heroContent = this.hero.querySelector('.hero-content');
        const heroVisual = this.hero.querySelector('.hero-visual');
        
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }
        
        if (heroVisual) {
            heroVisual.style.opacity = '0';
            heroVisual.style.transform = 'translateX(40px)';
            
            setTimeout(() => {
                heroVisual.style.transition = 'opacity 1s ease, transform 1s ease';
                heroVisual.style.opacity = '1';
                heroVisual.style.transform = 'translateX(0)';
            }, 300);
        }
    }
    
    // Method to update live stats with animation
    updateLiveStat(statId, newValue) {
        const element = document.getElementById(statId);
        if (!element) return;
        
        // Add pulse effect
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.heroController = new HeroController();
});

// Add CSS for additional glitch classes
const additionalCSS = `
.glitch-subtle::before {
    animation-duration: 0.2s !important;
}

.glitch-subtle::after {
    animation-duration: 0.2s !important;
}

.glitch-intense::before {
    animation-duration: 0.1s !important;
}

.glitch-intense::after {
    animation-duration: 0.1s !important;
}

.animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

console.log('🦾 Hero JS Loaded');