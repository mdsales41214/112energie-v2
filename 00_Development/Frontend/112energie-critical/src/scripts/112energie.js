// ==================== PARTICLE WAVE ANIMATION ====================
class ParticleWave {
    constructor() {
        this.canvas = document.getElementById('particle-wave');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = window.innerWidth < 768 ? 40 : 60;
        this.waveAmplitude = 80;
        this.waveFrequency = 0.008;
        this.waveSpeed = 0.015;
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseRadius = 120;
        this.isActive = true;
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerY = this.canvas.height / 2;
    }
    
    createParticles() {
        this.particles = [];
        const spacing = this.canvas.width / (this.numberOfParticles - 1);
        
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push({
                x: i * spacing,
                y: this.centerY,
                baseY: this.centerY,
                size: Math.random() * 2 + 1.5,
                speed: Math.random() * 0.3 + 0.3,
                offset: Math.random() * Math.PI * 2,
                originalX: i * spacing
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', Utils.debounce(() => {
            this.resize();
            this.createParticles();
        }, 250));
        
        if ('ontouchstart' in window) {
            // Touch events
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = touch.clientX - rect.left;
                this.mouseY = touch.clientY - rect.top;
            });
            
            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = touch.clientX - rect.left;
                this.mouseY = touch.clientY - rect.top;
            });
            
            this.canvas.addEventListener('touchend', () => {
                this.mouseX = 0;
                this.mouseY = 0;
            });
        } else {
            // Mouse events
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            });
            
            this.canvas.addEventListener('mouseleave', () => {
                this.mouseX = 0;
                this.mouseY = 0;
            });
        }

        // Pause animation when not visible for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isActive = entry.isIntersecting;
            });
        }, { threshold: 0.1 });

        observer.observe(this.canvas);
    }
    
    updateParticles() {
        if (!this.isActive) return;
        
        this.particles.forEach((particle, index) => {
            // Base wave motion
            const waveOffset = Math.sin(index * this.waveFrequency + this.time) * this.waveAmplitude;
            particle.y = particle.baseY + waveOffset;
            
            // Mouse/touch interaction
            if (this.mouseX && this.mouseY) {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouseRadius) {
                    const force = (1 - distance / this.mouseRadius) * 40;
                    const angle = Math.atan2(dy, dx);
                    particle.x -= Math.cos(angle) * force * 0.5;
                    particle.y -= Math.sin(angle) * force;
                }
            }
            
            // Return to original position
            particle.x += (particle.originalX - particle.x) * 0.05;
            
            // Add subtle floating motion
            particle.y += Math.sin(this.time * particle.speed + particle.offset) * 1;
        });
    }
    
    drawParticles() {
        if (!this.isActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connecting lines
        this.ctx.strokeStyle = 'rgba(0, 166, 81, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            if (i === 0) {
                this.ctx.moveTo(particle.x, particle.y);
            } else {
                // Create smooth curves between particles
                const prevParticle = this.particles[i - 1];
                const cpx = (prevParticle.x + particle.x) / 2;
                const cpy = (prevParticle.y + particle.y) / 2;
                this.ctx.quadraticCurveTo(cpx, cpy, particle.x, particle.y);
            }
        }
        
        this.ctx.stroke();
        
        // Draw particles with glow effect
        this.particles.forEach((particle, index) => {
            // Main glow
            const glowGradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 4
            );
            glowGradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
            glowGradient.addColorStop(0.5, 'rgba(0, 166, 81, 0.4)');
            glowGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core particle
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.9 + Math.sin(this.time * 2 + index) * 0.1})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Add floating particles for extra effect
        this.drawFloatingParticles();
    }
    
    drawFloatingParticles() {
        const floatingCount = 15;
        for (let i = 0; i < floatingCount; i++) {
            const x = (this.time * 20 + i * 100) % (this.canvas.width + 100) - 50;
            const y = this.centerY + Math.sin(this.time + i) * 200;
            const opacity = Math.sin(this.time * 2 + i) * 0.3 + 0.2;
            
            this.ctx.fillStyle = `rgba(0, 212, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    animate() {
        this.time += this.waveSpeed;
        this.updateParticles();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        this.isActive = false;
    }
}

// ==================== ENHANCED ENERGY CALCULATOR ====================
class EnergyCalculator {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.results = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStepIndicators();
        this.updateNavigationButtons();
    }

    bindEvents() {
        // Input change listeners for real-time updates
        const inputs = document.querySelectorAll('#householdSize, #homeType, #electricityUsage, #gasUsage');
        inputs.forEach(input => {
            input.addEventListener('change', Utils.debounce(() => this.estimateUsage(), 500));
        });
    }

    estimateUsage() {
        const householdSize = parseInt(document.getElementById('householdSize')?.value || 2);
        const homeType = document.getElementById('homeType')?.value || 'row-house';
        
        // Base consumption values
        const baseElectricity = 2800;
        const baseGas = 1200;
        
        // Household size multiplier
        const sizeMultiplier = 1 + ((householdSize - 2) * 0.25);
        
        // Home type multipliers
        const homeMultipliers = {
            'apartment': 0.6,
            'row-house': 1.0,
            'corner-house': 1.1,
            'semi-detached': 1.2,
            'detached': 1.4,
            'villa': 1.6
        };
        
        const homeMultiplier = homeMultipliers[homeType] || 1.0;
        
        // Calculate estimated usage
        const estimatedElectricity = Math.round(baseElectricity * sizeMultiplier * homeMultiplier);
        const estimatedGas = Math.round(baseGas * sizeMultiplier * homeMultiplier);
        
        // Update inputs if they haven't been manually changed
        const electricityInput = document.getElementById('electricityUsage');
        const gasInput = document.getElementById('gasUsage');
        
        if (electricityInput && !electricityInput.dataset.manuallySet) {
            electricityInput.value = estimatedElectricity;
        }
        
        if (gasInput && !gasInput.dataset.manuallySet) {
            gasInput.value = estimatedGas;
        }
    }

    calculate() {
        const data = this.gatherData();
        
        // Enhanced calculation with AI optimization factors
        const electricityRate = data.greenEnergy ? 0.24 : 0.28;
        const gasRate = 1.45;
        const networkCosts = 456; // Fixed annual network costs
        
        // Calculate base costs
        let electricityCost = data.electricityUsage * electricityRate;
        let gasCost = data.gasUsage * gasRate;
        
        // Apply solar panel discount
        if (data.solarPanels) {
            electricityCost *= 0.3; // 70% reduction for solar
        }
        
        // AI optimization discount (smart meter required)
        let aiDiscount = 0;
        if (data.smartMeter) {
            aiDiscount = (electricityCost + gasCost) * 0.08; // 8% AI optimization
        }
        
        const totalYearly = electricityCost + gasCost + networkCosts - aiDiscount;
        const totalMonthly = totalYearly / 12;
        
        // Calculate savings compared to market average
        const marketAverage = (data.electricityUsage * 0.32 + data.gasUsage * 1.65 + 520);
        const savings = marketAverage - totalYearly;
        
        // CO2 calculations
        const co2Electricity = data.greenEnergy ? 0 : data.electricityUsage * 0.392; // kg CO2 per kWh
        const co2Gas = data.gasUsage * 1.784; // kg CO2 per m³
        const co2Total = (co2Electricity + co2Gas) / 1000; // Convert to tons
        const co2Reduction = data.greenEnergy ? co2Total : co2Total * 0.8; // 80% reduction with green energy
        
        this.results = {
            monthlyAmount: Math.round(totalMonthly),
            yearlyAmount: Math.round(totalYearly),
            savingsAmount: Math.round(Math.max(0, savings)),
            electricityCost: Math.round(electricityCost),
            gasCost: Math.round(gasCost),
            networkCost: networkCosts,
            aiDiscount: Math.round(aiDiscount),
            co2Reduction: co2Reduction.toFixed(1),
            data: data
        };
        
        return this.results;
    }

    gatherData() {
        return {
            householdSize: parseInt(document.getElementById('householdSize')?.value || 2),
            homeType: document.getElementById('homeType')?.value || 'row-house',
            electricityUsage: parseInt(document.getElementById('electricityUsage')?.value || 2800),
            gasUsage: parseInt(document.getElementById('gasUsage')?.value || 1200),
            greenEnergy: document.getElementById('greenEnergy')?.checked || false,
            solarPanels: document.getElementById('solarPanels')?.checked || false,
            smartMeter: document.getElementById('smartMeter')?.checked || false
        };
    }

    update() {
        this.estimateUsage();
    }
}

// ==================== ENHANCED APP INITIALIZATION ====================
class App112Energie {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('112Energie Application Starting...');
        
        // Initialize modules with error handling
        try {
            this.modules.particleWave = new ParticleWave();
            this.modules.navigation = new Navigation();
            this.modules.energyMonitor = new EnergyMonitor();
            this.modules.calculator = new EnergyCalculator();
            this.modules.formHandler = new FormHandler();
            this.modules.animations = new AnimationController();
            this.modules.cookieConsent = new CookieConsent();
        } catch (error) {
            console.warn('Some modules failed to initialize:', error);
        }
        
        this.bindGlobalFunctions();
        this.initEnhancedFeatures();
        
        console.log('112Energie Application Started Successfully');
    }

    initEnhancedFeatures() {
        // Initialize enhanced counter animations
        this.initLiveCounters();
        
        // Performance monitoring
        this.initPerformanceMonitoring();
        
        // Enhanced mobile experience
        this.initMobileEnhancements();
    }

    initLiveCounters() {
        // Animate live stats in hero section
        const liveStats = document.querySelectorAll('#activeConnections, #dailySavings, #systemEfficiency');
        
        liveStats.forEach(stat => {
            const baseValue = parseInt(stat.textContent.replace(/[^\d]/g, ''));
            
            setInterval(() => {
                const variation = Math.floor(Math.random() * 10) - 5;
                let newValue = baseValue + variation;
                
                if (stat.id === 'systemEfficiency') {
                    newValue = Math.max(98.5, Math.min(99.9, baseValue + (Math.random() - 0.5)));
                    stat.textContent = newValue.toFixed(1) + '%';
                } else if (stat.id === 'dailySavings') {
                    stat.textContent = '€' + Utils.formatNumber(newValue);
                } else {
                    stat.textContent = Utils.formatNumber(newValue);
                }
            }, 5000 + Math.random() * 3000);
        });
    }

    initPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'navigation') {
                            console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
                        }
                    }
                });
                observer.observe({ entryTypes: ['navigation'] });
            } catch (error) {
                console.warn('Performance monitoring not available:', error);
            }
        }
    }

    initMobileEnhancements() {
        // Add mobile-specific optimizations
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Reduce particle count on mobile for performance
            if (this.modules.particleWave) {
                this.modules.particleWave.numberOfParticles = Math.min(30, this.modules.particleWave.numberOfParticles);
            }
        }

        // Handle viewport changes on mobile
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', Utils.throttle(() => {
                document.documentElement.style.setProperty('--vh', `${window.visualViewport.height * 0.01}px`);
            }, 250));
        }
    }

    bindGlobalFunctions() {
        // Calculator functions
        window.calcNextStep = calcNextStep;
        window.calcPrevStep = calcPrevStep;
        window.stepperIncrease = (inputId) => {
            const input = document.getElementById(inputId);
            if (input) {
                const max = parseInt(input.getAttribute('max')) || 10;
                const current = parseInt(input.value) || 0;
                if (current < max) {
                    input.value = current + 1;
                    this.modules.calculator?.update();
                }
            }
        };
        window.stepperDecrease = (inputId) => {
            const input = document.getElementById(inputId);
            if (input) {
                const min = parseInt(input.getAttribute('min')) || 1;
                const current = parseInt(input.value) || 0;
                if (current > min) {
                    input.value = current - 1;
                    this.modules.calculator?.update();
                }
            }
        };
        
        // Service selection
        window.selectService = (service) => this.selectService(service);
        
        // Modal functions
        window.openLoginModal = () => this.openModal('loginModal');
        window.closeLoginModal = () => this.closeModal('loginModal');
        window.handleLogin = (e) => this.handleLogin(e);
        
        // Utility functions
        window.proceedWithCalculation = () => this.proceedWithCalculation();
        window.closeEmergencyBanner = () => this.closeEmergencyBanner();
        window.cookieConsent = this.modules.cookieConsent;
    }

    selectService(service) {
        sessionStorage.setItem('selectedService', service);
        
        const messages = {
            'no-deposit': 'Energie zonder borg geselecteerd',
            'emergency': '24h spoedaansluiting wordt voorbereid',
            'smart-green': 'Smart groene energie optie geselecteerd'
        };
        
        if (this.modules.formHandler) {
            this.modules.formHandler.showNotification(messages[service] || 'Service geselecteerd', 'success');
        }
        
        // Scroll to calculator
        setTimeout(() => {
            document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    }

    proceedWithCalculation() {
        if (!this.modules.calculator) return;
        
        const results = this.modules.calculator.calculate();
        sessionStorage.setItem('calculationResults', JSON.stringify(results));
        
        if (this.modules.formHandler) {
            this.modules.formHandler.showNotification(
                'Berekening opgeslagen! U wordt doorgestuurd naar de aanvraag...', 
                'success'
            );
        }
        
        // Simulate navigation to application form
        setTimeout(() => {
            window.location.hash = 'aanvraag';
        }, 2000);
    }

    closeEmergencyBanner() {
        const banner = document.getElementById('emergencyBanner');
        if (banner) {
            banner.style.transform = 'translateY(-100%)';
            setTimeout(() => banner.style.display = 'none', 300);
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        
        // Simulate login process
        const submitBtn = e.target.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Bezig met inloggen...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            this.closeModal('loginModal');
            
            if (this.modules.formHandler) {
                this.modules.formHandler.showNotification('Succesvol ingelogd!', 'success');
            }
        }, 1500);
    }

    destroy() {
        Object.values(this.modules).forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });
    }
}

// Initialize the enhanced application
const app = new App112Energie();

// Export for debugging
if (typeof window !== 'undefined') {
    window.app112Energie = app;
}