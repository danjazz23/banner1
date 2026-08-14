/**
 * Burgers Scene Controller
 * Handles the burger showcase carousel with auto-rotation
 */

const BurgersScene = {
    elements: {
        scene: null,
        cards: [],
        prevBtn: null,
        nextBtn: null,
        title: null,
        subtitle: null
    },

    config: {
        currentIndex: 0,
        totalCards: 6,
        autoRotateDelay: 2500,
        isAnimating: false,
        autoRotateTimer: null
    },

    /**
     * Initialize burgers scene elements
     */
    init() {
        this.elements.scene = document.querySelector('.scene-burgers');
        this.elements.cards = document.querySelectorAll('.burger-card');
        this.elements.prevBtn = document.querySelector('.burger-nav .prev');
        this.elements.nextBtn = document.querySelector('.burger-nav .next');
        this.elements.title = document.querySelector('.scene-burgers .section-title');
        this.elements.subtitle = document.querySelector('.scene-burgers .section-subtitle');
        
        this.config.totalCards = this.elements.cards.length;
        this.bindEvents();
        return this;
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation buttons
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', () => this.previous());
        }
        
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.elements.scene.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.elements.scene.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    },

    /**
     * Handle swipe gesture
     * @param {number} startX 
     * @param {number} endX 
     */
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.previous();
            }
        }
    },

    /**
     * Show specific burger card
     * @param {number} index 
     */
    showCard(index) {
        if (this.config.isAnimating) return;
        this.config.isAnimating = true;
        
        // Normalize index
        if (index < 0) index = this.config.totalCards - 1;
        if (index >= this.config.totalCards) index = 0;
        
        const currentCard = this.elements.cards[this.config.currentIndex];
        const nextCard = this.elements.cards[index];
        
        // Determine direction
        const direction = index > this.config.currentIndex ? 1 : -1;
        
        const tl = gsap.timeline({
            onComplete: () => {
                this.config.currentIndex = index;
                this.config.isAnimating = false;
                this.resetAutoRotate();
            }
        });
        
        // Animate out current card
        tl.to(currentCard, {
            x: direction * -200,
            scale: 0.8,
            opacity: 0,
            rotation: direction * -15,
            duration: 0.5,
            ease: 'power2.in'
        });
        
        // Prepare next card
        gsap.set(nextCard, {
            x: direction * 200,
            scale: 0.8,
            opacity: 0,
            rotation: direction * 15
        });
        
        // Animate in next card
        tl.to(nextCard, {
            x: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '<');
        
        // Animate badge if exists
        const badge = nextCard.querySelector('.card-badge');
        if (badge) {
            gsap.from(badge, {
                scale: 0,
                rotation: -180,
                duration: 0.5,
                ease: 'back.out(1.7)',
                delay: 0.3
            });
        }
        
        // Animate image
        const image = nextCard.querySelector('.burger-image');
        if (image) {
            gsap.from(image, {
                y: 50,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                delay: 0.2
            });
        }
        
        // Animate text content
        const name = nextCard.querySelector('.burger-name');
        const desc = nextCard.querySelector('.burger-desc');
        const price = nextCard.querySelector('.burger-price');
        
        tl.from([name, desc, price], {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: 'power2.out'
        }, '<0.3');
    },

    /**
     * Go to next burger
     */
    next() {
        this.showCard(this.config.currentIndex + 1);
    },

    /**
     * Go to previous burger
     */
    previous() {
        this.showCard(this.config.currentIndex - 1);
    },

    /**
     * Start auto-rotation timer
     */
    startAutoRotate() {
        this.stopAutoRotate();
        
        this.config.autoRotateTimer = setInterval(() => {
            if (!this.config.isAnimating && document.visibilityState === 'visible') {
                this.next();
            }
        }, this.config.autoRotateDelay);
    },

    /**
     * Stop auto-rotation timer
     */
    stopAutoRotate() {
        if (this.config.autoRotateTimer) {
            clearInterval(this.config.autoRotateTimer);
            this.config.autoRotateTimer = null;
        }
    },

    /**
     * Reset auto-rotation timer
     */
    resetAutoRotate() {
        this.startAutoRotate();
    },

    /**
     * Play entrance animation
     * @returns {gsap.core.Timeline}
     */
    playEntrance() {
        const tl = gsap.timeline();
        
        // Animate title and subtitle
        tl.from([this.elements.title, this.elements.subtitle], {
            y: -50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        // Set initial state of cards
        this.elements.cards.forEach((card, index) => {
            if (index !== this.config.currentIndex) {
                gsap.set(card, { opacity: 0, visibility: 'hidden' });
            }
        });
        
        // Animate active card
        const activeCard = this.elements.cards[this.config.currentIndex];
        if (activeCard) {
            tl.from(activeCard, {
                y: 100,
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.4');
            
            // Animate card children
            const badge = activeCard.querySelector('.card-badge');
            const image = activeCard.querySelector('.burger-image');
            const name = activeCard.querySelector('.burger-name');
            const desc = activeCard.querySelector('.burger-desc');
            const price = activeCard.querySelector('.burger-price');
            
            if (badge) {
                gsap.from(badge, {
                    scale: 0,
                    rotation: -180,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                });
            }
            
            if (image) {
                gsap.from(image, {
                    y: 50,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
            
            tl.from([name, desc, price], {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.4,
                ease: 'power2.out'
            }, '<0.2');
        }
        
        // Animate navigation buttons
        tl.from(this.elements.prevBtn, {
            x: -50,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.3');
        
        tl.from(this.elements.nextBtn, {
            x: 50,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, '<');
        
        return tl;
    },

    /**
     * Play exit animation
     * @returns {gsap.core.Timeline}
     */
    playExit() {
        const tl = gsap.timeline();
        
        this.stopAutoRotate();
        
        tl.to([this.elements.title, this.elements.subtitle], {
            y: -50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: 'power2.in'
        });
        
        const activeCard = this.elements.cards[this.config.currentIndex];
        if (activeCard) {
            tl.to(activeCard, {
                scale: 1.1,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, '<');
        }
        
        return tl;
    },

    /**
     * Refresh scene when it becomes active
     */
    onActivate() {
        this.startAutoRotate();
    },

    /**
     * Cleanup when scene deactivates
     */
    onDeactivate() {
        this.stopAutoRotate();
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BurgersScene;
}
