/**
 * Button Component Controller
 * Interactive button behaviors and enhancements
 */

'use strict';

class ButtonController {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.rippleButtons = document.querySelectorAll('[data-ripple]');
        this.glitchButtons = document.querySelectorAll('.btn-glitch');
        
        this.init();
    }
    
    init() {
        console.log('🔘 Initializing Button Controller...');
        
        this.setupRippleEffect();
        this.setupLoadingStates();
        this.setupGlitchEffects();
        this.setupAccessibilityFeatures();
        this.setupFormSubmissions();
        
        console.log('✅ Button Controller initialized');
    }
    
    // Ripple Effect
    setupRippleEffect() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }
    
    createRipple(event, element) {
        // Check if ripple is disabled
        if (element.hasAttribute('data-no-ripple')) return;
        
        const button = element;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Remove existing ripples
        const existingRipple = button.querySelector('.ripple-effect');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }
    
    // Loading States
    setupLoadingStates() {
        document.addEventListener('click', async (e) => {
            const button = e.target.closest('[data-loading]');
            if (!button) return;
            
            e.preventDefault();
            await this.handleLoadingButton(button);
        });
    }
    
    async handleLoadingButton(button) {
        const originalText = button.textContent;
        const loadingText = button.dataset.loading || 'Bezig...';
        
        // Set loading state
        this.setButtonLoading(button, true, loadingText);
        
        try {
            // Simulate or execute actual operation
            const duration = parseInt(button.dataset.duration) || 2000;
            await this.sleep(duration);
            
            // Success state
            this.setButtonSuccess(button, 'Voltooid!');
            
            // Reset after delay
            setTimeout(() => {
                this.resetButton(button, originalText);
            }, 1500);
            
        } catch (error) {
            // Error state
            this.setButtonError(button, 'Fout opgetreden');
            
            setTimeout(() => {
                this.resetButton(button, originalText);
            }, 2000);
        }
    }
    
    setButtonLoading(button, isLoading, text = 'Bezig...') {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
            if (text) button.textContent = text;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.removeAttribute('aria-busy');
        }
    }
    
    setButtonSuccess(button, text = 'Voltooid!') {
        button.classList.remove('loading');
        button.classList.add('success');
        button.textContent = text;
        
        // Add success icon
        const icon = document.createElement('span');
        icon.innerHTML = '✓';
        icon.className = 'success-icon';
        button.appendChild(icon);
    }
    
    setButtonError(button, text = 'Fout') {
        button.classList.remove('loading');
        button.classList.add('error');
        button.textContent = text;
        button.disabled = false;
    }
    
    resetButton(button, originalText) {
        button.classList.remove('loading', 'success', 'error');
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = originalText;
        
        // Remove any icons
        const icons = button.querySelectorAll('.success-icon, .error-icon');
        icons.forEach(icon => icon.remove());
    }
    
    // Glitch Effects
    setupGlitchEffects() {
        this.glitchButtons.forEach(button => {
            // Add data-text attribute if not present
            if (!button.hasAttribute('data-text')) {
                button.setAttribute('data-text', button.textContent);
            }
            
            // Random glitch effect
            setInterval(() => {
                if (Math.random() < 0.05) { // 5% chance
                    this.triggerGlitch(button);
                }
            }, 3000);
        });
    }
    
    triggerGlitch(button, duration = 300) {
        button.classList.add('glitching');
        
        setTimeout(() => {
            button.classList.remove('glitching');
        }, duration);
    }
    
    // Accessibility Features
    setupAccessibilityFeatures() {
        this.buttons.forEach(button => {
            // Add proper ARIA attributes
            if (!button.hasAttribute('role') && button.tagName !== 'BUTTON') {
                button.setAttribute('role', 'button');
            }
            
            // Handle keyboard navigation
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
            
            // Focus management
            button.addEventListener('focus', () => {
                button.classList.add('focused');
            });
            
            button.addEventListener('blur', () => {
                button.classList.remove('focused');
            });
        });
    }
    
    // Form Submission Handling
    setupFormSubmissions() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            
            if (submitButton && !submitButton.hasAttribute('data-no-loading')) {
                this.handleFormSubmission(form, submitButton);
            }
        });
    }
    
    handleFormSubmission(form, button) {
        const originalText = button.textContent || button.value;
        
        // Set loading state
        this.setButtonLoading(button, true, 'Versturen...');
        
        // Reset on form completion (success or error)
        const resetButton = () => {
            this.resetButton(button, originalText);
        };
        
        // Listen for form events
        form.addEventListener('formdata', resetButton, { once: true });
        form.addEventListener('invalid', resetButton, { once: true });
        
        // Fallback timeout
        setTimeout(resetButton, 10000);
    }
    
    // Utility Methods
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public API
    showLoading(selector, text) {
        const button = document.querySelector(selector);
        if (button) {
            this.setButtonLoading(button, true, text);
        }
    }
    
    hideLoading(selector) {
        const button = document.querySelector(selector);
        if (button) {
            this.setButtonLoading(button, false);
        }
    }
    
    showSuccess(selector, text) {
        const button = document.querySelector(selector);
        if (button) {
            this.setButtonSuccess(button, text);
        }
    }
    
    showError(selector, text) {
        const button = document.querySelector(selector);
        if (button) {
            this.setButtonError(button, text);
        }
    }
}

// CSS for button effects
const buttonEffectsCSS = `
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    pointer-events: none;
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    z-index: 1;
}

@keyframes ripple-animation {
    to {
        transform: scale(2);
        opacity: 0;
    }
}

.btn.success {
    background: linear-gradient(135deg, var(--quantum-green), #28a745) !important;
    animation: success-pulse 0.3s ease;
}

.btn.error {
    background: linear-gradient(135deg, #dc3545, #c82333) !important;
    animation: error-shake 0.5s ease;
}

@keyframes success-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes error-shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.success-icon {
    margin-left: 8px;
    animation: success-icon-pop 0.3s ease;
}

@keyframes success-icon-pop {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.btn.focused {
    outline: 2px solid var(--neural-blue);
    outline-offset: 2px;
}

.btn.glitching::before,
.btn.glitching::after {
    opacity: 0.8 !important;
    animation-duration: 0.1s !important;
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = buttonEffectsCSS;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.buttonController = new ButtonController();
});

console.log('🎛️ Button JS Loaded');