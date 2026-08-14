/**
 * Hero Scene Controller
 * Handles the hero/intro scene animations
 */

const HeroScene = {
    elements: {
        scene: null,
        title: null,
        subtitle: null,
        burger: null,
        rings: [],
        orbs: [],
        indicators: []
    },

    config: {
        autoRotateTime: 8000,
        floatAmplitude: 30,
        floatSpeed: 6
    },

    /**
     * Initialize hero scene elements
     */
    init() {
        this.elements.scene = document.querySelector('.scene-hero');
        this.elements.title = document.querySelector('.hero-title');
        this.elements.subtitle = document.querySelector('.hero-subtitle');
        this.elements.burger = document.querySelector('.hero-burger');
        this.elements.rings = document.querySelectorAll('.product-ring');
        this.elements.orbs = document.querySelectorAll('.gradient-orb');
        this.elements.indicators = document.querySelectorAll('.indicator');
        
        this.bindEvents();
        return this;
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Indicator clicks for manual navigation
        this.elements.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const targetScene = parseInt(indicator.dataset.target);
                if (window.App && window.App.goToScene) {
                    window.App.goToScene(targetScene);
                }
            });
        });
    },

    /**
     * Play entrance animation
     * @returns {gsap.core.Timeline}
     */
    playEntrance() {
        const tl = gsap.timeline();
        
        // Animate orbs
        this.elements.orbs.forEach((orb, index) => {
            gsap.from(orb, {
                scale: 0,
                opacity: 0,
                duration: 1.5,
                ease: 'elastic.out(1, 0.5)',
                delay: index * 0.2
            });
        });
        
        // Animate rings
        this.elements.rings.forEach((ring, index) => {
            gsap.from(ring, {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                delay: 0.5 + index * 0.15
            });
        });
        
        // Animate burger
        tl.from(this.elements.burger, {
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.7)'
        }, '-=1');
        
        // Animate title lines
        if (this.elements.title) {
            const lines = this.elements.title.querySelectorAll('.line');
            lines.forEach((line, index) => {
                tl.from(line, {
                    y: 100,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power4.out',
                    delay: index * 0.1
                }, '-=0.8');
            });
        }
        
        // Animate subtitle
        tl.from(this.elements.subtitle, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4');
        
        // Animate indicators
        tl.from(this.elements.indicators, {
            x: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3');
        
        return tl;
    },

    /**
     * Play exit animation
     * @returns {gsap.core.Timeline}
     */
    playExit() {
        const tl = gsap.timeline();
        
        // Animate out
        tl.to(this.elements.scene.querySelectorAll('.hero-text > *'), {
            y: -50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.in'
        });
        
        tl.to(this.elements.burger, {
            scale: 1.5,
            rotation: 45,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.in'
        }, '<');
        
        tl.to(this.elements.rings, {
            scale: 1.5,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.in'
        }, '<');
        
        return tl;
    },

    /**
     * Create continuous floating animation
     */
    startContinuousAnimations() {
        // Continuous subtle floating for burger
        gsap.to(this.elements.burger, {
            y: Helpers.random(-10, 10),
            rotation: Helpers.random(-3, 3),
            duration: Helpers.random(3, 5),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
        
        // Subtle orb movement
        this.elements.orbs.forEach((orb, index) => {
            gsap.to(orb, {
                x: Helpers.random(-30, 30),
                y: Helpers.random(-30, 30),
                duration: Helpers.random(15, 25),
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: index * 2
            });
        });
    },

    /**
     * Update active indicator
     * @param {number} sceneIndex 
     */
    updateIndicators(sceneIndex) {
        this.elements.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 === sceneIndex);
        });
    },

    /**
     * Refresh scene when it becomes active
     */
    onActivate() {
        this.updateIndicators(1);
        this.startContinuousAnimations();
    },

    /**
     * Cleanup when scene deactivates
     */
    onDeactivate() {
        // Kill any running tweens if needed
        gsap.killTweensOf(this.elements.burger);
        gsap.killTweensOf(this.elements.orbs);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroScene;
}
