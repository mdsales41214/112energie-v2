/**
 * 112energie - Main JavaScript Module
 * Modern Energy Platform Core Functionality
 * Version: 2.0.0
 * 
 * Features:
 * - Performance monitoring (Core Web Vitals)
 * - Smooth animations with performance optimization
 * - Real-time stats updates
 * - Particle system management
 * - Progressive enhancement
 * - Accessibility support
 * - Error handling and logging
 */

'use strict';

// ===================================
// Core Application Class
// ===================================

class EnergyApp {
    constructor() {
        this.isInitialized = false;
        this.animationId = null;
        this.observers = new Map();
        this.stats = {
            activeNodes: 127439,
            energySaved: 3859,
            aiAccuracy: 99.7
        };
        this.particles = [];
        this.maxParticles = 50;
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.updateStats = this.updateStats.bind(this);
        this.animateParticles = this.animateParticles.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    // ===================================
    // Initialization
    // ===================================
    
    async init() {
        try {
            console.log('🚀 Initializing 112energie App...');
            
            // Check for required features
            if (!this.checkRequiredFeatures()) {
                console.warn('Some features may not work on this browser');
            }
            
            // Initialize performance monitoring
            this.initPerformanceMonitoring();
            
            // Initialize core features
            await this.initializeCore();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start animations
            this.startAnimations();
            
            this.isInitialized = true;
            console.log('✅ 112energie App initialized successfully');
            
            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('energyAppReady', {
                detail: { app: this }
            }));
            
        } catch (error) {
            console.error('❌ Failed to initialize 112energie App:', error);
            this.handleError(error);
        }
    }
    
    checkRequiredFeatures() {
        const requiredFeatures = {
            'IntersectionObserver': 'IntersectionObserver' in window,
            'requestAnimationFrame': 'requestAnimationFrame' in window,
            'localStorage': this.supportsLocalStorage(),
            'CSS.supports': 'CSS' in window && 'supports' in window.CSS
        };
        
        let allSupported = true;
        
        Object.entries(requiredFeatures).forEach(([feature, supported]) => {
            if (!supported) {
                console.warn(`Feature not supported: ${feature}`);
                allSupported = false;
            }
        });
        
        return allSupported;
    }
    
    supportsLocalStorage() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    async initializeCore() {
        // Initialize particle system
        this.initParticleSystem();
        
        // Initialize stats animation
        this.initStatsAnimation();
        
        // Initialize intersection observers
        this.initIntersectionObservers();
        
        // Initialize smooth scrolling
        this.initSmoothScrolling();
        
        // Initialize form handlers (if forms exist)
        this.initFormHandlers();
        
        // Initialize accessibility features
        this.initAccessibilityFeatures();
    }
    
    // ===================================
    // Performance Monitoring
    // ===================================
    
    initPerformanceMonitoring() {
        // Web Vitals monitoring
        this.monitorWebVitals();
        
        // Resource timing
        this.monitorResourceTiming();
        
        // Error tracking
        this.initErrorTracking();
    }
    
    monitorWebVitals() {
        // LCP (Largest Contentful Paint)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    const lcp = lastEntry.renderTime || lastEntry.loadTime;
                    this.reportMetric('LCP', lcp);
                });
                lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            } catch (error) {
                console.warn('LCP monitoring failed:', error);
            }
            
            // FID (First Input Delay)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entry = list.getEntries()[0];
                    const fid = entry.processingStart - entry.startTime;
                    this.reportMetric('FID', fid);
                });
                fidObserver.observe({ type: 'first-input', buffered: true });
            } catch (error) {
                console.warn('FID monitoring failed:', error);
            }
            
            // CLS (Cumulative Layout Shift)
            let clsValue = 0;
            try {
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.reportMetric('CLS', clsValue);
                });
                clsObserver.observe({ type: 'layout-shift', buffered: true });
            } catch (error) {
                console.warn('CLS monitoring failed:', error);
            }
        }
    }
    
    reportMetric(metricName, value) {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 ${metricName}: ${value.toFixed(2)}ms`);
        }
        
        // Send to analytics (implement your analytics solution)
        if (typeof gtag !== 'undefined') {
            gtag('event', metricName, {
                value: Math.round(metricName === 'CLS' ? value * 1000 : value),
                custom_parameter_1: value,
            });
        }
        
        // Store locally for debugging
        if (this.supportsLocalStorage()) {
            const metrics = JSON.parse(localStorage.getItem('energy_metrics') || '{}');
            metrics[metricName] = { value, timestamp: Date.now() };
            localStorage.setItem('energy_metrics', JSON.stringify(metrics));
        }
    }
    
    monitorResourceTiming() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 1000) { // Log slow resources
                        console.warn(`🐌 Slow resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
                    }
                });
            });
            resourceObserver.observe({ type: 'resource', buffered: true });
        }
    }
    
    initErrorTracking() {
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'JavaScript Error');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
        });
    }
    
    handleError(error, context = '') {
        const errorInfo = {
            message: error.message || error,
            stack: error.stack || 'No stack trace',
            context: context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.error('💥 Error:', errorInfo);
        
        // Send to error tracking service
        // Example: Sentry, LogRocket, or custom endpoint
        if (typeof window.errorTracker !== 'undefined') {
            window.errorTracker.captureError(errorInfo);
        }
    }
    
    // ===================================
    // Particle System
    // ===================================
    
    initParticleSystem() {
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;
        
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        this.particlesContainer = particlesContainer;
        this.createParticles();
    }
    
    createParticles() {
        const containerRect = this.particlesContainer.getBoundingClientRect();
        
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random starting position
            const x = Math.random() * containerRect.width;
            const y = containerRect.height + Math.random() * 100;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 15}s`;
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.8 + 0.2;
            
            this.particlesContainer.appendChild(particle);
            this.particles.push({
                element: particle,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2 - 1
            });
        }
    }
    
    animateParticles() {
        if (!this.particlesContainer || this.particles.length === 0) return;
        
        const containerRect = this.particlesContainer.getBoundingClientRect();
        
        this.particles.forEach(particle => {
            // Update position
            particle.y += particle.vy;
            particle.x += particle.vx;
            
            // Reset if particle goes off screen
            if (particle.y < -50) {
                particle.y = containerRect.height + 50;
                particle.x = Math.random() * containerRect.width;
            }
            
            // Keep within horizontal bounds
            if (particle.x < 0 || particle.x > containerRect.width) {
                particle.vx *= -1;
            }
            
            // Apply position
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
        
        // Continue animation
        if (this.animationId) {
            this.animationId = requestAnimationFrame(this.animateParticles);
        }
    }
    
    // ===================================
    // Stats Animation
    // ===================================
    
    initStatsAnimation() {
        this.startStatsUpdate();
    }
    
    startStatsUpdate() {
        // Update stats every 3 seconds
        setInterval(this.updateStats, 3000);
        
        // Initial animation
        this.animateStatsOnLoad();
    }
    
    animateStatsOnLoad() {
        const statElements = {
            activeNodes: document.getElementById('activeNodes'),
            energySaved: document.getElementById('energySaved'),
            aiAccuracy: document.getElementById('aiAccuracy')
        };
        
        Object.entries(statElements).forEach(([key, element]) => {
            if (element) {
                this.animateNumber(element, this.stats[key], key);
            }
        });
    }
    
    animateNumber(element, targetValue, type) {
        const startValue = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOut;
            
            // Format the value based on type
            let displayValue;
            if (type === 'activeNodes') {
                displayValue = Math.floor(currentValue).toLocaleString();
            } else if (type === 'energySaved') {
                displayValue = `€${Math.floor(currentValue).toLocaleString()}`;
            } else if (type === 'aiAccuracy') {
                displayValue = `${currentValue.toFixed(1)}%`;
            }
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    updateStats() {
        // Simulate real-time stats updates
        this.stats.activeNodes += Math.floor(Math.random() * 100) - 50;
        this.stats.energySaved += Math.floor(Math.random() * 50);
        this.stats.aiAccuracy = 99.7 + (Math.random() - 0.5) * 0.2;
        
        // Ensure reasonable bounds
        this.stats.activeNodes = Math.max(100000, this.stats.activeNodes);
        this.stats.aiAccuracy = Math.min(99.9, Math.max(99.5, this.stats.aiAccuracy));
        
        // Update DOM elements
        const activeNodesEl = document.getElementById('activeNodes');
        const energySavedEl = document.getElementById('energySaved');
        const aiAccuracyEl = document.getElementById('aiAccuracy');
        
        if (activeNodesEl) {
            this.smoothUpdateText(activeNodesEl, this.stats.activeNodes.toLocaleString());
        }
        
        if (energySavedEl) {
            this.smoothUpdateText(energySavedEl, `€${this.stats.energySaved.toLocaleString()}`);
        }
        
        if (aiAccuracyEl) {
            this.smoothUpdateText(aiAccuracyEl, `${this.stats.aiAccuracy.toFixed(1)}%`);
        }
    }
    
    smoothUpdateText(element, newText) {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0.7';
        
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
        }, 150);
    }
    
    // ===================================
    // Intersection Observers
    // ===================================
    
    initIntersectionObservers() {
        // Lazy loading observer
        this.initLazyLoadingObserver();
        
        // Animation observer
        this.initAnimationObserver();
        
        // Performance observer for images
        this.initImagePerformanceObserver();
    }
    
    initLazyLoadingObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        });
        
        // Observe all images with data-src
        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
        
        this.observers.set('images', imageObserver);
    }
    
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const src = img.dataset.src || img.src;
            
            if (!src) {
                resolve(img);
                return;
            }
            
            const newImg = new Image();
            
            newImg.onload = () => {
                img.src = src;
                img.classList.add('loaded');
                
                // Remove data-src after loading
                if (img.dataset.src) {
                    delete img.dataset.src;
                }
                
                resolve(img);
            };
            
            newImg.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
                img.classList.add('error');
                reject(new Error(`Failed to load image: ${src}`));
            };
            
            newImg.src = src;
        });
    }
    
    initAnimationObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe elements that should animate on scroll
        document.querySelectorAll('.feature-card, .metric-card, .chart-stat').forEach(el => {
            animationObserver.observe(el);
        });
        
        this.observers.set('animations', animationObserver);
    }
    
    initImagePerformanceObserver() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const imgPerfObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
                        if (entry.duration > 500) {
                            console.warn(`🖼️ Slow image load: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
                        }
                    }
                });
            });
            
            imgPerfObserver.observe({ type: 'resource', buffered: true });
            this.observers.set('imagePerf', imgPerfObserver);
        } catch (error) {
            console.warn('Image performance monitoring failed:', error);
        }
    }
    
    // ===================================
    // Smooth Scrolling
    // ===================================
    
    initSmoothScrolling() {
        // Handle anchor links with smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }
    
    smoothScrollTo(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Focus management for accessibility
        setTimeout(() => {
            element.focus({ preventScroll: true });
        }, 500);
    }
    
    // ===================================
    // Form Handlers
    // ===================================
    
    initFormHandlers() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        try {
            // Show loading state
            this.setFormLoading(form, true);
            
            // Validate form
            const isValid = this.validateForm(form);
            if (!isValid) {
                this.setFormLoading(form, false);
                return;
            }
            
            // Submit form data
            const formData = new FormData(form);
            const response = await this.submitForm(formData);
            
            if (response.success) {
                this.showFormSuccess(form);
            } else {
                throw new Error(response.message || 'Form submission failed');
            }
            
        } catch (error) {
            this.showFormError(form, error.message);
        } finally {
            this.setFormLoading(form, false);
        }
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let message = '';
        
        // Required check
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Dit veld is verplicht';
        }
        
        // Type-specific validation
        if (value && type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Voer een geldig e-mailadres in';
            }
        }
        
        if (value && type === 'tel') {
            const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Voer een geldig telefoonnummer in';
            }
        }
        
        // Show/hide error
        if (isValid) {
            this.clearFieldError(input);
        } else {
            this.showFieldError(input, message);
        }
        
        return isValid;
    }
    
    showFieldError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.setAttribute('role', 'alert');
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.setAttribute('aria-describedby', errorElement.id || 'field-error');
    }
    
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        input.removeAttribute('aria-describedby');
    }
    
    setFormLoading(form, isLoading) {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Bezig...';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = submitBtn.dataset.originalText || 'Versturen';
        }
    }
    
    async submitForm(formData) {
        // Implement your form submission logic here
        // This is a placeholder
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }
    
    showFormSuccess(form) {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.textContent = 'Bedankt! We nemen zo snel mogelijk contact met je op.';
        
        form.parentNode.insertBefore(successMessage, form);
        form.style.display = 'none';
    }
    
    showFormError(form, message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error';
        errorMessage.textContent = message || 'Er is een fout opgetreden. Probeer het opnieuw.';
        
        const existingError = form.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        form.parentNode.insertBefore(errorMessage, form);
    }
    
    // ===================================
    // Accessibility Features
    // ===================================
    
    initAccessibilityFeatures() {
        // Skip links
        this.initSkipLinks();
        
        // Keyboard navigation
        this.initKeyboardNavigation();
        
        // Focus management
        this.initFocusManagement();
        
        // ARIA live regions
        this.initLiveRegions();
    }
    
    initSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    initKeyboardNavigation() {
        // Enhanced keyboard navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            // ESC key handling
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
            
            // Tab trapping in modals (if any)
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }
    
    handleEscapeKey() {
        // Close any open modals or dropdowns
        const openModals = document.querySelectorAll('.modal.open, .dropdown.open');
        openModals.forEach(modal => {
            modal.classList.remove('open');
        });
    }
    
    handleTabNavigation(e) {
        const activeElement = document.activeElement;
        const modal = activeElement.closest('.modal');
        
        if (modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    }
    
    initFocusManagement() {
        // Ensure interactive elements have proper focus styles
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        
        interactiveElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focused');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('focused');
            });
        });
    }
    
    initLiveRegions() {
        // Create live regions for dynamic content updates
        if (!document.querySelector('.sr-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.className = 'sr-only sr-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        }
    }
    
    announceToScreenReader(message) {
        const liveRegion = document.querySelector('.sr-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    // ===================================
    // Event Listeners
    // ===================================
    
    setupEventListeners() {
        // Window events
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('orientationchange', this.handleResize);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // User interaction events
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        
        // Performance monitoring
        window.addEventListener('load', () => {
            this.reportMetric('PageLoad', performance.now());
        });
    }
    
    handleResize() {
        // Debounce resize handler
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            this.onResize();
        }, 250);
    }
    
    onResize() {
        // Update particle system
        if (this.particles.length > 0) {
            this.recreateParticles();
        }
        
        // Update any size-dependent calculations
        this.updateLayout();
    }
    
    recreateParticles() {
        // Clear existing particles
        this.particles.forEach(particle => {
            particle.element.remove();
        });
        this.particles = [];
        
        // Create new particles with updated dimensions
        this.createParticles();
    }
    
    updateLayout() {
        // Recalculate any layout-dependent features
        console.log('Layout updated');
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause animations
            this.pauseAnimations();
        } else {
            // Page is visible - resume animations
            this.resumeAnimations();
        }
    }
    
    handleDocumentClick(e) {
        // Close dropdowns when clicking outside
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown.open').forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    }
    
    // ===================================
    // Animation Control
    // ===================================
    
    startAnimations() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.animateParticles);
        }
    }
    
    pauseAnimations() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Pause CSS animations
        document.body.classList.add('animations-paused');
    }
    
    resumeAnimations() {
        this.startAnimations();
        
        // Resume CSS animations
        document.body.classList.remove('animations-paused');
    }
    
    // ===================================
    // Utility Methods
    // ===================================
    
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ===================================
    // Public API
    // ===================================
    
    // Method to update stats externally
    setStats(newStats) {
        Object.assign(this.stats, newStats);
        this.animateStatsOnLoad();
    }
    
    // Method to add announcement
    announce(message) {
        this.announceToScreenReader(message);
    }
    
    // Method to get current performance metrics
    getMetrics() {
        if (this.supportsLocalStorage()) {
            return JSON.parse(localStorage.getItem('energy_metrics') || '{}');
        }
        return {};
    }
    
    // Cleanup method
    destroy() {
        // Cancel animations
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Clear intervals
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        
        // Disconnect observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        console.log('🧹 EnergyApp cleaned up');
    }
}

// ===================================
// Initialize Application
// ===================================

// Create global instance
window.EnergyApp = new EnergyApp();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnergyApp;
}

// ===================================
// Additional Utility Functions
// ===================================

// Lazy loading utility
function lazyLoad(element, callback) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(element);
    } else {
        // Fallback for older browsers
        callback(element);
    }
}

// Format number with Dutch locale
function formatNumber(number, options = {}) {
    return new Intl.NumberFormat('nl-NL', options).format(number);
}

// Format currency
function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Format percentage
function formatPercentage(value, decimals = 1) {
    return new Intl.NumberFormat('nl-NL', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
}

// Check if device supports touch
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Get device type
function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
}

// Add device class to body
document.body.classList.add(getDeviceType());
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

console.log('🔋 112energie Core JS Loaded');