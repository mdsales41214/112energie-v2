/**
 * 112Energie Main JavaScript File
 * Version: 2.0
 * Updated: 2025
 * Description: Core functionality for 112Energie website
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    API_ENDPOINT: 'https://api.112energie.nl/v2',
    WEBSOCKET_URL: 'wss://ws.112energie.nl',
    UPDATE_INTERVAL: 5000, // 5 seconds
    ANIMATION_DURATION: 300,
    SESSION_TIMEOUT: 1800000, // 30 minutes
    DEBUG_MODE: false
};

// ==================== UTILITIES ====================
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    },

    // Format number
    formatNumber(number, decimals = 0) {
        return new Intl.NumberFormat('nl-NL', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    },

    // Generate unique ID
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ==================== ENERGY MONITOR ====================
class EnergyMonitor {
    constructor() {
        this.ws = null;
        this.chart = null;
        this.data = {
            usage: [],
            production: [],
            timestamps: []
        };
        this.maxDataPoints = 60;
        this.init();
    }

    init() {
        this.connectWebSocket();
        this.initChart();
        this.startSimulation(); // For demo purposes
    }

    connectWebSocket() {
        if ('WebSocket' in window) {
            try {
                this.ws = new WebSocket(CONFIG.WEBSOCKET_URL);
                
                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.updateStatus('online');
                };

                this.ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    this.handleRealtimeData(data);
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.updateStatus('offline');
                };

                this.ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    this.updateStatus('offline');
                    // Attempt reconnection after 5 seconds
                    setTimeout(() => this.connectWebSocket(), 5000);
                };
            } catch (error) {
                console.error('WebSocket connection failed:', error);
                this.startSimulation();
            }
        } else {
            this.startSimulation();
        }
    }

    handleRealtimeData(data) {
        // Update UI with real-time data
        if (data.currentUsage !== undefined) {
            this.updateDisplay('currentUsage', data.currentUsage);
        }
        if (data.solarProduction !== undefined) {
            this.updateDisplay('solarProduction', data.solarProduction);
        }
        if (data.dailyCost !== undefined) {
            this.updateDisplay('dailyCost', data.dailyCost);
        }

        // Update chart data
        this.updateChartData(data);
    }

    updateDisplay(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            const formattedValue = typeof value === 'number' ? 
                Utils.formatNumber(value, 2) : value;
            
            // Animate value change
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'scale(1.1)';
            element.textContent = formattedValue;
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        }
    }

    updateStatus(status) {
        const indicator = document.querySelector('.status-indicator');
        if (indicator) {
            indicator.classList.remove('online', 'offline');
            indicator.classList.add(status);
            indicator.textContent = status === 'online' ? '● Online' : '● Offline';
        }
    }

    initChart() {
        const canvas = document.getElementById('energyChart');
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');
            
            // Simple line chart implementation
            this.chart = {
                ctx: ctx,
                width: canvas.width,
                height: canvas.height,
                padding: 20
            };

            this.drawChart();
        }
    }

    drawChart() {
        if (!this.chart) return;

        const { ctx, width, height, padding } = this.chart;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set styles
        ctx.strokeStyle = '#00A651';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(0, 166, 81, 0.1)';
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - 2 * padding) * i / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw data
        if (this.data.usage.length > 1) {
            // Draw usage line
            ctx.strokeStyle = '#00A651';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const xStep = (width - 2 * padding) / (this.maxDataPoints - 1);
            const yScale = (height - 2 * padding) / 10; // Max 10kW
            
            this.data.usage.forEach((value, index) => {
                const x = padding + index * xStep;
                const y = height - padding - value * yScale;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Fill area under curve
            ctx.lineTo(width - padding, height - padding);
            ctx.lineTo(padding, height - padding);
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 166, 81, 0.1)';
            ctx.fill();
            
            // Draw production line if available
            if (this.data.production.length > 1) {
                ctx.strokeStyle = '#FFB700';
                ctx.beginPath();
                
                this.data.production.forEach((value, index) => {
                    const x = padding + index * xStep;
                    const y = height - padding - value * yScale;
                    
                    if (index === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                
                ctx.stroke();
            }
        }
    }

    updateChartData(newData) {
        // Add new data points
        this.data.usage.push(newData.currentUsage || 0);
        this.data.production.push(newData.solarProduction || 0);
        this.data.timestamps.push(new Date());
        
        // Remove old data points if exceeding max
        if (this.data.usage.length > this.maxDataPoints) {
            this.data.usage.shift();
            this.data.production.shift();
            this.data.timestamps.shift();
        }
        
        // Redraw chart
        this.drawChart();
    }

    startSimulation() {
        // Simulate real-time data for demo
        setInterval(() => {
            const simulatedData = {
                currentUsage: 2 + Math.random() * 3,
                solarProduction: Math.max(0, 1 + Math.random() * 2 - 0.5),
                dailyCost: 10 + Math.random() * 10
            };
            
            this.handleRealtimeData(simulatedData);
        }, CONFIG.UPDATE_INTERVAL);
    }

    destroy() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// ==================== CALCULATOR ====================
class EnergyCalculator {
    constructor() {
        this.rates = {
            electricity: 0.45, // EUR per kWh
            gas: 1.50, // EUR per m³
            solarDiscount: 0.15 // 15% discount with solar panels
        };
        
        this.consumption = {
            1: { power: 1800, gas: 800 },
            2: { power: 2800, gas: 1200 },
            3: { power: 3500, gas: 1400 },
            4: { power: 4200, gas: 1600 },
            5: { power: 5000, gas: 1800 }
        };
        
        this.homeTypeMultiplier = {
            'apartment': 0.8,
            'row-house': 1.0,
            'corner-house': 1.1,
            'detached': 1.3
        };
    }

    calculate() {
        const householdSize = document.getElementById('householdSize').value;
        const homeType = document.getElementById('homeType').value;
        const hasSolar = document.getElementById('solarPanels').checked;
        
        // Get base consumption
        const baseConsumption = this.consumption[householdSize];
        const multiplier = this.homeTypeMultiplier[homeType];
        
        // Calculate adjusted consumption
        const powerConsumption = baseConsumption.power * multiplier;
        const gasConsumption = baseConsumption.gas * multiplier;
        
        // Calculate costs
        let electricityCost = powerConsumption * this.rates.electricity;
        const gasCost = gasConsumption * this.rates.gas;
        
        // Apply solar discount
        if (hasSolar) {
            electricityCost *= (1 - this.rates.solarDiscount);
        }
        
        // Calculate monthly amount
        const yearlyTotal = electricityCost + gasCost;
        const monthlyAmount = yearlyTotal / 12;
        
        return {
            power: Math.round(powerConsumption),
            gas: Math.round(gasConsumption),
            monthly: Math.round(monthlyAmount)
        };
    }

    update() {
        const results = this.calculate();
        
        // Update display with animation
        this.animateValue('estimatedPower', results.power);
        this.animateValue('estimatedGas', results.gas);
        this.animateValue('monthlyAmount', results.monthly);
    }

    animateValue(elementId, endValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startValue = parseInt(element.textContent) || 0;
        const duration = 500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuad = progress * (2 - progress);
            
            const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuad);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ==================== NAVIGATION ====================
class Navigation {
    constructor() {
        this.header = document.getElementById('mainHeader');
        this.mobileToggle = document.getElementById('mobileMenuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.lastScroll = 0;
        
        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.smoothScroll(e));
        });
        
        // Header scroll behavior
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 100));
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && this.navMenu?.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Handle dropdown menus
        this.initDropdowns();
    }

    toggleMobileMenu() {
        this.navMenu?.classList.toggle('active');
        this.mobileToggle?.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = this.mobileToggle?.querySelectorAll('span');
        if (spans && this.navMenu?.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else if (spans) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    closeMobileMenu() {
        this.navMenu?.classList.remove('active');
        this.mobileToggle?.classList.remove('active');
        
        const spans = this.mobileToggle?.querySelectorAll('span');
        if (spans) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = this.header?.offsetHeight || 0;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu after navigation
            this.closeMobileMenu();
        }
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for header styling
        if (currentScroll > 50) {
            this.header?.classList.add('scrolled');
        } else {
            this.header?.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll > this.lastScroll && currentScroll > 200) {
            this.header?.classList.add('hidden');
        } else {
            this.header?.classList.remove('hidden');
        }
        
        this.lastScroll = currentScroll;
    }

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.nav-item.dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (link && menu) {
                // Touch device support
                link.addEventListener('touchstart', (e) => {
                    if (!dropdown.classList.contains('active')) {
                        e.preventDefault();
                        dropdown.classList.add('active');
                    }
                });
                
                // Close on outside click
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove('active');
                    }
                });
            }
        });
    }
}

// ==================== FORM HANDLING ====================
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', Utils.debounce(() => this.validateField(input), 500));
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        // Validate all fields
        const isValid = this.validateForm(form);
        
        if (isValid) {
            // Show loading state
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Bezig...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                this.showNotification('Formulier succesvol verzonden!', 'success');
            }, 1500);
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Remove existing error
        this.removeError(field);
        
        // Check if required
        if (required && !value) {
            this.showError(field, 'Dit veld is verplicht');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Voer een geldig e-mailadres in');
                return false;
            }
        }
        
        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(value)) {
                this.showError(field, 'Voer een geldig telefoonnummer in');
                return false;
            }
        }
        
        // Password validation
        if (type === 'password' && value) {
            if (value.length < 8) {
                this.showError(field, 'Wachtwoord moet minimaal 8 karakters bevatten');
                return false;
            }
        }
        
        // Add success state
        field.classList.add('valid');
        return true;
    }

    showError(field, message) {
        field.classList.add('error');
        field.classList.remove('valid');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentElement.appendChild(errorElement);
    }

    removeError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ==================== ANIMATION CONTROLLER ====================
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.init();
    }

    init() {
        // Animate elements on scroll
        this.initScrollAnimations();
        
        // Counter animations
        this.initCounterAnimations();
        
        // Parallax effects
        this.initParallaxEffects();
    }

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const animation = element.dataset.animate;
                        element.classList.add(`animate-${animation}`);
                        observer.unobserve(element);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            animatedElements.forEach(element => {
                observer.observe(element);
            });
            
            this.observers.set('scroll', observer);
        }
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.count);
                    this.animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
        
        this.observers.set('counter', observer);
    }

    animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const current = Math.round(start + (target - start) * easeOutQuart);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', Utils.throttle(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = element.dataset.parallax || 0.5;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
            }, 10));
        }
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// ==================== COOKIE CONSENT ====================
class CookieConsent {
    constructor() {
        this.cookieName = '112energie_consent';
        this.cookieExpiry = 365; // days
        
        if (!this.hasConsent()) {
            this.showBanner();
        }
    }

    hasConsent() {
        return document.cookie.includes(this.cookieName + '=true');
    }

    showBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>Wij gebruiken cookies om je ervaring te verbeteren. Door verder te gaan, accepteer je ons cookiebeleid.</p>
                <div class="cookie-actions">
                    <button class="btn btn-secondary" onclick="cookieConsent.reject()">Weigeren</button>
                    <button class="btn btn-primary" onclick="cookieConsent.accept()">Accepteren</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Animate in
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    accept() {
        this.setCookie(true);
        this.hideBanner();
        this.initAnalytics();
    }

    reject() {
        this.setCookie(false);
        this.hideBanner();
    }

    setCookie(value) {
        const date = new Date();
        date.setTime(date.getTime() + (this.cookieExpiry * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + date.toUTCString();
        document.cookie = `${this.cookieName}=${value};${expires};path=/;SameSite=Strict`;
    }

    hideBanner() {
        const banner = document.querySelector('.cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }

    initAnalytics() {
        // Initialize Google Analytics or other tracking
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }
}

// ==================== MAIN APPLICATION ====================
class App112Energie {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('112Energie Application Starting...');
        
        // Initialize modules
        this.modules.navigation = new Navigation();
        this.modules.energyMonitor = new EnergyMonitor();
        this.modules.calculator = new EnergyCalculator();
        this.modules.formHandler = new FormHandler();
        this.modules.animations = new AnimationController();
        this.modules.cookieConsent = new CookieConsent();
        
        // Bind global functions
        this.bindGlobalFunctions();
        
        // Initialize emergency banner check
        this.checkEmergencyStatus();
        
        // Log successful initialization
        console.log('112Energie Application Started Successfully');
    }

    bindGlobalFunctions() {
        // Make functions available globally for onclick handlers
        window.updateCalculation = () => this.modules.calculator.update();
        window.proceedWithCalculation = () => this.proceedWithCalculation();
        window.startCalculator = () => this.startCalculator();
        window.selectService = (service) => this.selectService(service);
        window.openLoginModal = () => this.openModal('loginModal');
        window.closeLoginModal = () => this.closeModal('loginModal');
        window.handleLogin = (e) => this.handleLogin(e);
        window.startDirectAanvraag = () => this.startDirectAanvraag();
        window.showDemo = () => this.showDemo();
        window.closeEmergencyBanner = () => this.closeEmergencyBanner();
        window.cookieConsent = this.modules.cookieConsent;
    }

    checkEmergencyStatus() {
        // Check for emergency situations (mock API call)
        setTimeout(() => {
            const hasEmergency = Math.random() > 0.8; // 20% chance for demo
            if (hasEmergency) {
                const banner = document.getElementById('emergencyBanner');
                if (banner) {
                    banner.style.display = 'block';
                }
            }
        }, 2000);
    }

    closeEmergencyBanner() {
        const banner = document.getElementById('emergencyBanner');
        if (banner) {
            banner.style.animation = 'slideUp 0.5s ease-out';
            setTimeout(() => {
                banner.style.display = 'none';
            }, 500);
        }
    }

    proceedWithCalculation() {
        const results = this.modules.calculator.calculate();
        
        // Store in session
        sessionStorage.setItem('calculationResults', JSON.stringify(results));
        
        // Navigate to sign-up or next step
        console.log('Proceeding with calculation:', results);
        this.modules.formHandler.showNotification('Berekening opgeslagen! Je wordt doorgestuurd...', 'success');
        
        // Simulate navigation
        setTimeout(() => {
            window.location.href = '#aanvraag';
        }, 2000);
    }

    startCalculator() {
        const calculatorSection = document.getElementById('tarieven');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    selectService(service) {
        console.log('Service selected:', service);
        
        // Store selected service
        sessionStorage.setItem('selectedService', service);
        
        // Show appropriate next step
        switch(service) {
            case 'no-deposit':
                this.modules.formHandler.showNotification('Energie zonder borg geselecteerd', 'info');
                break;
            case 'emergency':
                this.modules.formHandler.showNotification('Spoedaansluiting wordt gestart', 'warning');
                break;
            case 'green':
                this.modules.formHandler.showNotification('Groene energie optie geselecteerd', 'success');
                break;
        }
        
        // Navigate to calculator
        this.startCalculator();
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
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        
        // Simulate login
        console.log('Login attempt:', { email });
        
        // Show loading
        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.textContent = 'Bezig met inloggen...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = 'Inloggen';
            submitBtn.disabled = false;
            
            // Success
            this.closeModal('loginModal');
            this.modules.formHandler.showNotification('Succesvol ingelogd!', 'success');
            
            // Update UI
            const loginBtn = document.querySelector('.btn-login');
            if (loginBtn) {
                loginBtn.innerHTML = '<svg>...</svg> Mijn Dashboard';
            }
        }, 1500);
    }

    startDirectAanvraag() {
        console.log('Starting direct application...');
        
        // Check if user has calculation results
        const results = sessionStorage.getItem('calculationResults');
        
        if (results) {
            // Proceed with saved data
            window.location.href = '#aanvraag-form';
        } else {
            // Start with calculator
            this.startCalculator();
            this.modules.formHandler.showNotification('Vul eerst de calculator in voor een persoonlijk aanbod', 'info');
        }
    }

    showDemo() {
        console.log('Showing demo...');
        
        // Create demo video modal
        const demoModal = document.createElement('div');
        demoModal.className = 'modal active';
        demoModal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <span class="modal-close" onclick="this.closest('.modal').remove()">×</span>
                <h2>112Energie Demo</h2>
                <div style="position: relative; padding-bottom: 56.25%; height: 0;">
                    <iframe 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
        
        document.body.appendChild(demoModal);
    }

    destroy() {
        // Clean up all modules
        Object.values(this.modules).forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });
    }
}

// ==================== INITIALIZE APPLICATION ====================
const app = new App112Energie();

// Export for debugging
if (CONFIG.DEBUG_MODE) {
    window.app112Energie = app;
}
// Enhanced JavaScript for 112Energie

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization
function initializeApp() {
    // Initialize components
    initializeHeader();
    initializeHeroAnimations();
    initializeEnergyMonitor();
    initializeCalculator();
    initializeTestimonials();
    initializeFAQ();
    initializeChat();
    initializeCookies();
    
    // Start real-time updates
    startRealtimeUpdates();
}

// Header functionality
function initializeHeader() {
    const header = document.getElementById('mainHeader');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    mobileToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

// Hero animations
function initializeHeroAnimations() {
    // Animate stats on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
}

// Animate counter
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Energy Monitor
class EnergyMonitor {
    constructor() {
        this.canvas = document.getElementById('liveEnergyChart');
        this.ctx = this.canvas?.getContext('2d');
        this.data = [];
        this.maxDataPoints = 60;
        
        if (this.canvas) {
            this.initChart();
            this.startSimulation();
        }
    }
    
    initChart() {
        // Setup canvas
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        // Generate initial data
        for (let i = 0; i < this.maxDataPoints; i++) {
            this.data.push(Math.random() * 3 + 2);
        }
    }
    
    startSimulation() {
        setInterval(() => {
            // Add new data point
            this.data.push(Math.random() * 3 + 2);
            if (this.data.length > this.maxDataPoints) {
                this.data.shift();
            }
            
            // Update display values
            this.updateValues();
            
            // Redraw chart
            this.drawChart();
        }, 1000);
    }
    
    updateValues() {
        const current = this.data[this.data.length - 1];
        
        // Update DOM elements
        document.getElementById('currentUsageValue').textContent = current.toFixed(1);
        document.getElementById('currentPower').textContent = current.toFixed(1);
        document.getElementById('solarPower').textContent = (current * 0.6).toFixed(1);
        document.getElementById('gridPower').textContent = (current * 0.4).toFixed(1);
        document.getElementById('currentCost').textContent = (current * 0.25).toFixed(2);
    }
    
    drawChart() {
        if (!this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        this.ctx.strokeStyle = '#e5e7eb';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= 4; i++) {
            const y = (height / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        // Draw data line
        this.ctx.strokeStyle = '#00A651';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const stepX = width / (this.maxDataPoints - 1);
        const maxValue = Math.max(...this.data);
        const minValue = Math.min(...this.data);
        const range = maxValue - minValue;
        
        this.data.forEach((value, index) => {
            const x = index * stepX;
            const y = height - ((value - minValue) / range) * height * 0.8 - height * 0.1;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
        
        // Draw gradient fill
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0, 166, 81, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 166, 81, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
}

// Initialize energy monitor
let energyMonitor = new EnergyMonitor();

// Calculator functionality
let currentCalcStep = 1;

function calcNextStep() {
    if (currentCalcStep < 3) {
        document.querySelector(`.calc-step[data-step="${currentCalcStep}"]`).classList.remove('active');
        currentCalcStep++;
        document.querySelector(`.calc-step[data-step="${currentCalcStep}"]`).classList.add('active');
        updateStepIndicators();
        updateNavigationButtons();
    } else {
        showCalculationResults();
    }
}

function calcPrevStep() {
    if (currentCalcStep > 1) {
        document.querySelector(`.calc-step[data-step="${currentCalcStep}"]`).classList.remove('active');
        currentCalcStep--;
        document.querySelector(`.calc-step[data-step="${currentCalcStep}"]`).classList.add('active');
        updateStepIndicators();
        updateNavigationButtons();
    }
}

function updateStepIndicators() {
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        if (index < currentCalcStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('calcPrev');
    const nextBtn = document.getElementById('calcNext');
    
    prevBtn.style.display = currentCalcStep === 1 ? 'none' : 'block';
    nextBtn.textContent = currentCalcStep === 3 ? 'Bereken' : 'Volgende';
}

function showCalculationResults() {
    // Hide steps
    document.querySelectorAll('.calc-step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Calculate values
    calculateEnergyCosts();
    
    // Show results
    document.getElementById('calcResults').style.display = 'block';
    document.querySelector('.calc-navigation').style.display = 'none';
}

function calculateEnergyCosts() {
    // Get input values
    const householdSize = parseInt(document.getElementById('householdSize').value);
    const homeType = document.getElementById('homeType').value;
    const hasGreenEnergy = document.getElementById('greenEnergy').checked;
    const hasSolarPanels = document.getElementById('solarPanels').checked;
    
    // Calculate estimated usage
    let electricityUsage = 2800; // Base usage
    let gasUsage = 1200; // Base usage
    
    // Adjust based on household size
    electricityUsage += (householdSize - 2) * 500;
    gasUsage += (householdSize - 2) * 200;
    
    // Adjust based on home type
    const homeMultipliers = {
        'apartment': 0.7,
        'row-house': 1.0,
        'corner-house': 1.2,
        'semi-detached': 1.3,
        'detached': 1.5,
        'villa': 2.0
    };
    
    electricityUsage *= homeMultipliers[homeType];
    gasUsage *= homeMultipliers[homeType];
    
    // Apply solar panel reduction
    if (hasSolarPanels) {
        electricityUsage *= 0.6;
    }
    
    // Calculate costs
    const electricityRate = hasGreenEnergy ? 0.28 : 0.26; // EUR per kWh
    const gasRate = 1.45; // EUR per m3
    
    const monthlyCost = (electricityUsage * electricityRate + gasUsage * gasRate) / 12;
    const yearlyCost = monthlyCost * 12;
    const savings = yearlyCost * 0.15; // 15% savings compared to market average
    
    // Update display
    document.getElementById('monthlyAmount').textContent = Math.round(monthlyCost);
    document.getElementById('yearlyAmount').textContent = Math.round(yearlyCost);
    document.getElementById('savingsAmount').textContent = Math.round(savings);
}

// Stepper controls
function stepperIncrease(inputId) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value);
    const maxValue = parseInt(input.max);
    
    if (currentValue < maxValue) {
        input.value = currentValue + 1;
        updateCalculation();
    }
}

function stepperDecrease(inputId) {
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value);
    const minValue = parseInt(input.min);
    
    if (currentValue > minValue) {
        input.value = currentValue - 1;
        updateCalculation();
    }
}

// Update calculation
function updateCalculation() {
    // Trigger recalculation
    // This would update the preview values in real-time
}

// Testimonials
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
    });
    
    document.querySelectorAll('.testimonial-dots .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

// Initialize testimonials
function initializeTestimonials() {
    if (testimonials.length > 0) {
        showTestimonial(0);
        
        // Auto-rotate
        setInterval(() => {
            nextTestimonial();
        }, 5000);
    }
}

// FAQ functionality
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Open clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Category filter
    document.querySelectorAll('.faq-category').forEach(category => {
        category.addEventListener('click', () => {
            const targetCategory = category.dataset.category;
            
            // Update active category
            document.querySelectorAll('.faq-category').forEach(c => {
                c.classList.remove('active');
            });
            category.classList.add('active');
            
            // Filter FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (targetCategory === 'all' || item.dataset.category === targetCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Chat functionality
let chatOpen = false;

function toggleChat() {
    chatOpen = !chatOpen;
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = chatOpen ? 'flex' : 'none';
}

function closeChat() {
    chatOpen = false;
    document.getElementById('chatWindow').style.display = 'none';
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addChatMessage(message, 'user');
        
        // Clear input
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addChatMessage(response, 'bot');
        }, 1000);
    }
}

function addChatMessage(message, sender) {
    const chatBody = document.querySelector('.chat-body');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('borg')) {
        return 'Bij 112Energie betaal je geen borg! Je kunt direct starten met alleen je maandelijkse termijnbedrag.';
    } else if (lowerMessage.includes('aansluiting')) {
        return 'We garanderen aansluiting binnen 24 uur, ook in het weekend. Voor spoedgevallen kunnen we zelfs sneller schakelen!';
    } else if (lowerMessage.includes('prijs') || lowerMessage.includes('kosten')) {
        return 'Onze prijzen zijn zeer competitief. Gebruik onze calculator voor een persoonlijk tarief of bel 0800-112-3637 voor advies.';
    } else {
        return 'Bedankt voor je vraag! Een van onze medewerkers neemt zo snel mogelijk contact met je op. Je kunt ook bellen naar 0800-112-3637.';
    }
}

function initializeChat() {
    // Enter key to send
    document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Cookie management
function initializeCookies() {
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            document.getElementById('cookieBanner').style.display = 'block';
        }, 2000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieBanner').style.display = 'none';
}

function manageCookies() {
    // Open cookie preferences modal
    alert('Cookie voorkeuren worden binnenkort toegevoegd');
}

// Service selection
function selectService(service) {
    // Store selected service
    sessionStorage.setItem('selectedService', service);
    
    // Redirect to application form
    window.location.href = '#aanvraag';
}

// Start direct application
function startDirectAanvraag() {
    window.location.href = '#aanvraag';
}

// Real-time updates
function startRealtimeUpdates() {
    // Update current time
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('nl-NL');
        
        // Update any time displays
        document.querySelectorAll('.current-time').forEach(el => {
            el.textContent = timeString;
        });
    }, 1000);
}

// Utility functions
function closeAnnouncement() {
    document.getElementById('announcementBar').style.display = 'none';
}

function closeEmergencyBanner() {
    document.getElementById('emergencyBanner').style.display = 'none';
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Back to top button visibility
window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 500) {
        backToTop?.classList.add('visible');
    } else {
        backToTop?.classList.remove('visible');
    }
});

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Simulate API call
    console.log('Subscribing:', email);
    
    // Show success message
    alert('Bedankt voor je aanmelding! Je ontvangt een bevestiging per e-mail.');
    
    // Clear form
    event.target.reset();
}

// Export functions for global use
window.calcNextStep = calcNextStep;
window.calcPrevStep = calcPrevStep;
window.selectService = selectService;
window.startDirectAanvraag = startDirectAanvraag;
window.toggleChat = toggleChat;
window.closeChat = closeChat;
window.sendChatMessage = sendChatMessage;
window.acceptCookies = acceptCookies;
window.manageCookies = manageCookies;
window.closeAnnouncement = closeAnnouncement;
window.closeEmergencyBanner = closeEmergencyBanner;
window.scrollToTop = scrollToTop;
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.subscribeNewsletter = subscribeNewsletter;
window.stepperIncrease = stepperIncrease;
window.stepperDecrease = stepperDecrease;
window.updateCalculation = updateCalculation;
window.showCalculationResults = showCalculationResults;
window.proceedWithOffer = function() {
    window.location.href = '#aanvraag';
};
window.downloadCalculation = function() {
    alert('Download functie komt binnenkort beschikbaar');
};