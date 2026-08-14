/**
 * Offers Scene Controller
 * Handles the special offers section with countdown timers
 */

const OffersScene = {
    elements: {
        scene: null,
        cards: [],
        title: null,
        subtitle: null,
        timer1: null,
        timer2: null,
        sparkles: []
    },

    config: {
        endTime1: null,
        endTime2: null,
        timerInterval: null,
        autoHighlightDelay: 8000,
        highlightTimer: null,
        currentHighlight: 0
    },

    /**
     * Initialize offers scene elements
     */
    init() {
        this.elements.scene = document.querySelector('.scene-offers');
        this.elements.cards = document.querySelectorAll('.offer-card');
        this.elements.title = document.querySelector('.scene-offers .section-title');
        this.elements.subtitle = document.querySelector('.scene-offers .section-subtitle');
        this.elements.timer1 = document.getElementById('timer-1');
        this.elements.timer2 = document.getElementById('timer-2');
        this.elements.sparkles = document.querySelectorAll('.sparkle');
        
        this.setupTimers();
        this.bindEvents();
        return this;
    },

    /**
     * Setup countdown timers
     */
    setupTimers() {
        // Timer 1: Countdown timer (2 hours 45 minutes from now)
        const now1 = new Date();
        now1.setHours(now1.getHours() + 2);
        now1.setMinutes(now1.getMinutes() + 45);
        this.config.endTime1 = now1.getTime();
        
        // Timer 2: End of month
        const now2 = new Date();
        const lastDayOfMonth = new Date(now2.getFullYear(), now2.getMonth() + 1, 0);
        this.config.endTime2 = lastDayOfMonth.getTime();
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Hover effects
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
        
        gsap.to(card, {
            scale: 1.02,
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
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        this.startAutoHighlight();
    },

    /**
     * Update countdown timer display
     */
    updateTimers() {
        const now = new Date().getTime();
        
        // Timer 1: Hours:Minutes:Seconds
        if (this.elements.timer1) {
            const distance1 = this.config.endTime1 - now;
            
            if (distance1 > 0) {
                const hours = Math.floor(distance1 / (1000 * 60 * 60));
                const minutes = Math.floor((distance1 % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance1 % (1000 * 60)) / 1000);
                
                const hoursEl = this.elements.timer1.querySelector('.time-unit:first-child .num');
                const minutesEl = this.elements.timer1.querySelectorAll('.time-unit .num')[1];
                const secondsEl = this.elements.timer1.querySelector('.time-unit:last-child .num');
                
                if (hoursEl) hoursEl.textContent = Helpers.padZero(hours);
                if (minutesEl) minutesEl.textContent = Helpers.padZero(minutes);
                if (secondsEl) secondsEl.textContent = Helpers.padZero(seconds);
            } else {
                // Reset timer when expired
                const newEnd = new Date().getTime() + (3 * 60 * 60 * 1000); // 3 hours from now
                this.config.endTime1 = newEnd;
            }
        }
        
        // Timer 2: Day + Month
        if (this.elements.timer2) {
            const distance2 = this.config.endTime2 - now;
            
            if (distance2 > 0) {
                const endDate = new Date(this.config.endTime2);
                const dayEl = this.elements.timer2.querySelector('.date-unit');
                const monthEl = this.elements.timer2.querySelector('.date-label');
                
                if (dayEl) {
                    dayEl.querySelector('.date-unit')?.textContent || 
                    (dayEl.firstChild.textContent = Helpers.padZero(endDate.getDate()));
                }
                if (monthEl) {
                    const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                                   'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
                    monthEl.textContent = months[endDate.getMonth()];
                }
            } else {
                // Reset to end of next month
                const newDate = new Date();
                newDate.setMonth(newDate.getMonth() + 1);
                const lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
                this.config.endTime2 = lastDay.getTime();
            }
        }
    },

    /**
     * Start timer interval
     */
    startTimers() {
        this.updateTimers(); // Initial update
        this.config.timerInterval = setInterval(() => {
            this.updateTimers();
        }, 1000);
    },

    /**
     * Stop timer interval
     */
    stopTimers() {
        if (this.config.timerInterval) {
            clearInterval(this.config.timerInterval);
            this.config.timerInterval = null;
        }
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
        
        // Animate sparkles
        this.elements.sparkles.forEach((sparkle, index) => {
            gsap.from(sparkle, {
                scale: 0,
                opacity: 0,
                rotation: Helpers.random(0, 360),
                duration: 0.8,
                ease: 'back.out(1.7)',
                delay: 0.3 + index * 0.15
            });
        });
        
        // Animate offer cards
        tl.from(this.elements.cards, {
            y: 100,
            scale: 0.9,
            opacity: 0,
            stagger: {
                each: 0.25,
                from: 'start'
            },
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.4');
        
        // Animate timer displays
        this.elements.cards.forEach((card, index) => {
            const timer = card.querySelector('.offer-timer');
            const badge = card.querySelector('.offer-badge');
            const title = card.querySelector('.offer-title');
            const desc = card.querySelector('.offer-desc');
            const cta = card.querySelector('.offer-cta');
            
            if (timer) {
                gsap.from(timer, {
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    delay: 0.6 + index * 0.25
                });
            }
            
            if (badge) {
                gsap.from(badge, {
                    scale: 0,
                    rotation: -15,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    delay: 0.7 + index * 0.25
                });
            }
            
            if (title) {
                gsap.from(title, {
                    y: 20,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    delay: 0.8 + index * 0.25
                });
            }
            
            if (desc) {
                gsap.from(desc, {
                    y: 20,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    delay: 0.9 + index * 0.25
                });
            }
            
            if (cta) {
                gsap.from(cta, {
                    scale: 0,
                    rotation: -10,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    delay: 1 + index * 0.25
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
        
        this.stopTimers();
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
     * Highlight next card
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
                borderColor: 'rgba(255, 71, 87, 0.6)',
                boxShadow: '0 0 60px rgba(255, 71, 87, 0.3)',
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
        this.startTimers();
        this.startAutoHighlight();
    },

    /**
     * Cleanup when scene deactivates
     */
    onDeactivate() {
        this.stopTimers();
        this.stopAutoHighlight();
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OffersScene;
}
