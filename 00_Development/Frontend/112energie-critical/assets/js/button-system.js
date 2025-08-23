// ===== JS FILE: script.js =====

class ButtonSystem {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initParticles();
        this.initMatrix();
        this.initCursors();
        this.init3DEffects();
        this.initMagneticButtons();
        this.initRipples();
        this.initLiquidEffect();
        this.initAuroraEffect();
        this.initVoidEffect();
    }

    init() {
        // Add loaded class for animations
        document.body.classList.add('loaded');
        
        // Initialize performance monitoring
        this.fps = 60;
        this.fpsInterval = 1000 / this.fps;
        this.then = Date.now();
        
        // Start animation loop
        this.animate();
    }

    setupEventListeners() {
        // Global mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateCursors(e);
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => this.handleButtonEnter(e));
            btn.addEventListener('mouseleave', (e) => this.handleButtonLeave(e));
            btn.addEventListener('click', (e) => this.handleButtonClick(e));
        });
    }

    // Custom Cursor System
    initCursors() {
        this.mouseFollower = document.querySelector('.mouse-follower');
        this.cursorGlow = document.querySelector('.cursor-glow');
        
        if (!this.mouseFollower || !this.cursorGlow) return;
        
        // Hide default cursor on desktop
        if (window.innerWidth > 768) {
            document.body.style.cursor = 'none';
        }
    }

    updateCursors(e) {
        if (!this.mouseFollower || !this.cursorGlow) return;
        
        requestAnimationFrame(() => {
            // Update follower with slight delay
            this.mouseFollower.style.left = `${e.clientX}px`;
            this.mouseFollower.style.top = `${e.clientY}px`;
            
            // Update glow with more delay for trail effect
            setTimeout(() => {
                this.cursorGlow.style.left = `${e.clientX}px`;
                this.cursorGlow.style.top = `${e.clientY}px`;
            }, 50);
        });
    }

    // Particle System for particle button
    initParticles() {
        const particleButtons = document.querySelectorAll('[data-particles]');
        
        particleButtons.forEach(btn => {
            const canvas = btn.querySelector('.particle-canvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            canvas.width = btn.offsetWidth;
            canvas.height = btn.offsetHeight;
            
            const particles = [];
            const particleCount = 30;
            
            // Create particles
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.5
                });
            }
            
            // Animation loop
            const animateParticles = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(p => {
                    // Update position
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    // Wrap around edges
                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;
                    
                    // Draw particle
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
                    ctx.fill();
                });
                
                requestAnimationFrame(animateParticles);
            };
            
            animateParticles();
        });
    }

    // Matrix Rain Effect
    initMatrix() {
        const matrixButtons = document.querySelectorAll('[data-matrix]');
        
        matrixButtons.forEach(btn => {
            const canvas = btn.querySelector('.matrix-bg');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            canvas.width = btn.offsetWidth;
            canvas.height = btn.offsetHeight;
            
            const columns = Math.floor(canvas.width / 20);
            const drops = Array(columns).fill(1);
            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            
            const drawMatrix = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#00ff00';
                ctx.font = '15px monospace';
                
                for (let i = 0; i < drops.length; i++) {
                    const text = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(text, i * 20, drops[i] * 20);
                    
                    if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            };
            
            setInterval(drawMatrix, 50);
        });
    }

    // 3D Tilt Effect
    init3DEffects() {
        const tiltButtons = document.querySelectorAll('[data-tilt]');
        
        tiltButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                btn.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });

        // 3D Hover for quantum button
        const quantumButtons = document.querySelectorAll('[data-hover3d]');
        quantumButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'rotateX(180deg)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'rotateX(0)';
            });
        });
    }

    // Magnetic Button Effect
    initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('[data-magnetic]');
        
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = Math.max(rect.width, rect.height);
                
                if (distance < maxDistance) {
                    const translateX = (x / maxDistance) * 10;
                    const translateY = (y / maxDistance) * 10;
                    
                    btn.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

    // Ripple Effect
    initRipples() {
        const rippleButtons = document.querySelectorAll('[data-ripple]');
        
        rippleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple-animation 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                btn.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // Liquid Effect Enhancement
    initLiquidEffect() {
        const liquidButtons = document.querySelectorAll('[data-liquid]');
        
        liquidButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const liquid = btn.querySelector('.liquid');
                if (liquid) {
                    liquid.style.left = x + 'px';
                    liquid.style.top = y + 'px';
                }
            });
        });
    }

    // Aurora Effect
    initAuroraEffect() {
        const auroraButtons = document.querySelectorAll('[data-aurora]');
        
        auroraButtons.forEach(btn => {
            let animationId;
            
            btn.addEventListener('mouseenter', () => {
                const auroraBg = btn.querySelector('.aurora-bg');
                if (!auroraBg) return;
                
                let hue = 0;
                const animateAurora = () => {
                    hue = (hue + 1) % 360;
                    auroraBg.style.filter = `hue-rotate(${hue}deg)`;
                    animationId = requestAnimationFrame(animateAurora);
                };
                animateAurora();
            });
            
            btn.addEventListener('mouseleave', () => {
                cancelAnimationFrame(animationId);
            });
        });
    }

    // Void Effect
    initVoidEffect() {
        const voidButtons = document.querySelectorAll('[data-void]');
        
        voidButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const voidBg = btn.querySelector('.void-bg');
                if (voidBg) {
                    voidBg.style.left = x + 'px';
                    voidBg.style.top = y + 'px';
                }
            });
        });
    }

    // Button Event Handlers
    handleButtonEnter(e) {
        const btn = e.currentTarget;
        
        // Scale cursor
        if (this.mouseFollower) {
            this.mouseFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            this.mouseFollower.style.borderColor = '#00d4ff';
        }
        
        // Add glow effect
        if (this.cursorGlow) {
            this.cursorGlow.style.opacity = '0.5';
        }
        
        // Trigger button-specific effects
        if (btn.dataset.cyber) {
            this.triggerCyberGlitch(btn);
        }
        
        if (btn.dataset.glow) {
            this.enhanceGlow(btn);
        }
    }

    handleButtonLeave(e) {
        // Reset cursor
        if (this.mouseFollower) {
            this.mouseFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            this.mouseFollower.style.borderColor = '#0094ff';
        }
        
        if (this.cursorGlow) {
            this.cursorGlow.style.opacity = '0.3';
        }
    }

    handleButtonClick(e) {
        const btn = e.currentTarget;
        
        // Create explosion effect
        this.createExplosion(e.clientX, e.clientY);
        
        // Button-specific click effects
        if (btn.classList.contains('btn-emergency')) {
            this.emergencyPulse(btn);
        }
        
        // Haptic feedback simulation (visual)
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }

    // Special Effects
    triggerCyberGlitch(btn) {
        const glitches = btn.querySelectorAll('.btn-glitch');
        glitches.forEach((glitch, i) => {
            setTimeout(() => {
                glitch.style.opacity = '0.8';
                setTimeout(() => {
                    glitch.style.opacity = '0';
                }, 100);
            }, i * 50);
        });
    }

    enhanceGlow(btn) {
        const gradient = btn.querySelector('.btn-gradient');
        if (gradient) {
            gradient.style.opacity = '1';
            gradient.style.filter = 'blur(20px)';
            
            setTimeout(() => {
                gradient.style.filter = 'blur(0)';
            }, 300);
        }
    }

    emergencyPulse(btn) {
        const lightning = btn.querySelector('.btn-lightning');
        if (lightning) {
            lightning.style.animation = 'none';
            setTimeout(() => {
                lightning.style.animation = 'lightning-strike 0.5s';
            }, 10);
        }
    }

    createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.style.position = 'fixed';
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';
        explosion.style.width = '100px';
        explosion.style.height = '100px';
        explosion.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.5), transparent)';
        explosion.style.borderRadius = '50%';
        explosion.style.transform = 'translate(-50%, -50%) scale(0)';
        explosion.style.pointerEvents = 'none';
        explosion.style.zIndex = '10000';
        
        document.body.appendChild(explosion);
        
        // Animate explosion
        explosion.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        }).onfinish = () => explosion.remove();
    }

    // Main Animation Loop
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const now = Date.now();
        const elapsed = now - this.then;
        
        if (elapsed > this.fpsInterval) {
            this.then = now - (elapsed % this.fpsInterval);
            
            // Update any continuous animations here
            this.updateFloatingButtons();
            this.updateGlitchEffects();
        }
    }

    updateFloatingButtons() {
        const floatButtons = document.querySelectorAll('[data-float]');
        floatButtons.forEach(btn => {
            if (!btn.matches(':hover')) {
                const time = Date.now() / 1000;
                const float = Math.sin(time * 2) * 5;
                btn.style.transform = `translateY(${float}px)`;
            }
        });
    }

    updateGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(el => {
            if (Math.random() > 0.99) {
                el.style.animation = 'none';
                setTimeout(() => {
                    el.style.animation = '';
                }, 100);
            }
        });
    }
}

// Initialize the button system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const buttonSystem = new ButtonSystem();
    
    // Add CSS for ripple animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Performance optimization for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
});

// Utility function for throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Intersection Observer for entrance animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all buttons for entrance animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn').forEach(btn => {
        observer.observe(btn);
    });
});