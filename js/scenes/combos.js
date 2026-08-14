/**
 * Combos Scene Controller
 * Handles the combos section with staggered animations
 */

const CombosScene = {
    elements: {
        scene: null,
        cards: [],
        title: null,
        subtitle: null,
        floatingElements: []
    },

    config: {
        autoHighlightDelay: 3000,
        highlightTimer: null,
        currentHighlight: 0
    },

    /**
     * Initialize combos scene elements
     */
    init() {
        this.elements.scene = document.querySelector('.scene-combos');
        this.elements.cards = document.querySelectorAll('.combo-card');
        this.elements.title = document.querySelector('.scene-combos .section-title');
        this.elements.subtitle = document.querySelector('.scene-combos .section-subtitle');
        this.elements.floatingElements = document.querySelectorAll('.floating-element');
        
        this.bindEvents();
        return this;
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Hover effects enhancement
        this.elements.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onCardHover(card));
            card.addEventListener('mouseleave', () => this.onCardLeave(card));
        });
    },

    /**
     * Handle card hover
     * @param {HTMLElement} card 
     */
    onCardHover(card) {
        this.stopAutoHighlight();
        
        // Subtle lift animation
        gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
        });
    },

    /**
     * Handle card leave
     * @param {HTMLElement} card 
     */
    onCardLeave(card) {
        gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        this.startAutoHighlight();
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
        
        // Animate floating background elements
        this.elements.floatingElements.forEach((elem, index) => {
            gsap.from(elem, {
                scale: 0,
                rotation: Helpers.random(-180, 180),
                opacity: 0,
                duration: 1,
                ease: 'back.out(1.7)',
                delay: 0.5 + index * 0.2
            });
        });
        
        // Animate combo cards with stagger
        tl.from(this.elements.cards, {
            y: 100,
            scale: 0.9,
            opacity: 0,
            stagger: {
                each: 0.2,
                from: 'start'
            },
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.4');
        
        // Animate card contents
        this.elements.cards.forEach((card, index) => {
            const tag = card.querySelector('.combo-tag');
            const image = card.querySelector('.combo-main-img');
            const name = card.querySelector('.combo-name');
            const items = card.querySelectorAll('.combo-items li');
            const price = card.querySelector('.new-price');
            
            if (tag) {
                gsap.from(tag, {
                    scale: 0,
                    rotation: -10,
                    duration: 0.4,
                    ease: 'back.out(1.7)',
                    delay: 0.8 + index * 0.2
                });
            }
            
            if (image) {
                gsap.from(image, {
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    delay: 0.7 + index * 0.2
                });
            }
            
            if (name) {
                gsap.from(name, {
                    y: 20,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    delay: 0.9 + index * 0.2
                });
            }
            
            if (items.length) {
                gsap.from(items, {
                    x: -20,
                    opacity: 0,
                    stagger: 0.08,
                    duration: 0.3,
                    ease: 'power2.out',
                    delay: 1 + index * 0.2
                });
            }
            
            if (price) {
                gsap.from(price, {
                    scale: 0,
                    rotation: -15,
                    duration: 0.4,
                    ease: 'back.out(1.7)',
                    delay: 1.2 + index * 0.2
                });
            }
        });
        
        return tl;
    },

    /**
     * Play exit animation
     * @returns {gsap.core.Timeline}
     */
    playExit() {
        const tl = gsap.timeline();
        
        this.stopAutoHighlight();
        
        tl.to([this.elements.title, this.elements.subtitle], {
            y: -50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: 'power2.in'
        });
        
        tl.to(this.elements.cards, {
            y: 100,
            scale: 0.9,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.in'
        }, '<');
        
        return tl;
    },

    /**
     * Start auto-highlight cycle
     */
    startAutoHighlight() {
        this.stopAutoHighlight();
        
        this.config.highlightTimer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.highlightNextCard();
            }
        }, this.config.autoHighlightDelay);
    },

    /**
     * Stop auto-highlight cycle
     */
    stopAutoHighlight() {
        if (this.config.highlightTimer) {
            clearInterval(this.config.highlightTimer);
            this.config.highlightTimer = null;
        }
    },

    /**
     * Highlight next card in sequence
     */
    highlightNextCard() {
        // Remove highlight from all cards
        this.elements.cards.forEach(card => {
            card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        // Add highlight to current card
        const currentCard = this.elements.cards[this.config.currentHighlight];
        if (currentCard) {
            gsap.to(currentCard, {
                borderColor: 'rgba(255, 107, 0, 0.5)',
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        
        // Move to next
        this.config.currentHighlight = (this.config.currentHighlight + 1) % this.elements.cards.length;
    },

    /**
     * Refresh scene when it becomes active
     */
    onActivate() {
        this.startAutoHighlight();
    },

    /**
     * Cleanup when scene deactivates
     */
    onDeactivate() {
        this.stopAutoHighlight();
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CombosScene;
}
