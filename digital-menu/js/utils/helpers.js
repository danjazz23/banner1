/**
 * Helper Utilities
 * Common functions used across the application
 */

const Helpers = {
    /**
     * Wait for a specified time
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise<void>}
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Get random number between min and max
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Get random integer between min and max
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Clamp a value between min and max
     * @param {number} value 
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     * @param {number} start 
     * @param {number} end 
     * @param {number} t - Progress (0-1)
     * @returns {number}
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Map a value from one range to another
     * @param {number} value 
     * @param {number} inMin 
     * @param {number} inMax 
     * @param {number} outMin 
     * @param {number} outMax 
     * @returns {number}
     */
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },

    /**
     * Debounce function
     * @param {Function} func 
     * @param {number} wait 
     * @returns {Function}
     */
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

    /**
     * Throttle function
     * @param {Function} func 
     * @param {number} limit 
     * @returns {Function}
     */
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

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element 
     * @param {number} offset 
     * @returns {boolean}
     */
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= offset
        );
    },

    /**
     * Format price with euro symbol
     * @param {number} price 
     * @returns {string}
     */
    formatPrice(price) {
        return `${price.toFixed(2)}€`;
    },

    /**
     * Create SVG element
     * @param {string} tagName 
     * @param {object} attributes 
     * @returns {SVGElement}
     */
    createSVG(tagName, attributes = {}) {
        const elem = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        Object.entries(attributes).forEach(([key, value]) => {
            elem.setAttribute(key, value);
        });
        return elem;
    },

    /**
     * Get CSS variable value
     * @param {string} name 
     * @returns {string}
     */
    getCSSVariable(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },

    /**
     * Set CSS variable value
     * @param {string} name 
     * @param {string} value 
     */
    setCSSVariable(name, value) {
        document.documentElement.style.setProperty(name, value);
    },

    /**
     * Detect reduced motion preference
     * @returns {boolean}
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Detect dark mode preference
     * @returns {boolean}
     */
    prefersDarkMode() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    /**
     * Check if device is mobile
     * @returns {boolean}
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Check if device is touch device
     * @returns {boolean}
     */
    isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    },

    /**
     * Generate unique ID
     * @returns {string}
     */
    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Pad number with zeros
     * @param {number} num 
     * @param {number} size 
     * @returns {string}
     */
    padZero(num, size = 2) {
        return num.toString().padStart(size, '0');
    },

    /**
     * Split text into characters for animation
     * @param {HTMLElement} element 
     * @param {string} wrapperTag - Tag to wrap characters (default: 'span')
     */
    splitText(element, wrapperTag = 'span') {
        const text = element.textContent;
        element.textContent = '';
        
        [...text].forEach(char => {
            const span = document.createElement(wrapperTag);
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = char === ' ' ? 'space' : 'char';
            element.appendChild(span);
        });
    },

    /**
     * Split text into words for animation
     * @param {HTMLElement} element 
     * @param {string} wrapperTag 
     */
    splitWords(element, wrapperTag = 'span') {
        const words = element.textContent.split(' ');
        element.textContent = '';
        
        words.forEach((word, index) => {
            const span = document.createElement(wrapperTag);
            span.textContent = word;
            span.className = 'word';
            if (index < words.length - 1) {
                span.appendChild(document.createTextNode(' '));
            }
            element.appendChild(span);
        });
    },

    /**
     * Preload images
     * @param {string[]} sources 
     * @returns {Promise<void>}
     */
    preloadImages(sources) {
        const promises = sources.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        });
        
        return Promise.all(promises);
    },

    /**
     * Add class when element is in viewport
     * @param {HTMLElement} element 
     * @param {string} className 
     * @param {IntersectionObserverInit} options 
     */
    addClassOnView(element, className, options = { threshold: 0.1 }) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    element.classList.add(className);
                    observer.unobserve(element);
                }
            });
        }, options);
        
        observer.observe(element);
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Helpers;
}
