/**
 * Main Application Controller
 * Manages scene transitions and global state
 */

const App = {
    elements: {
        app: null,
        scenes: []
    },

    config: {
        currentSceneIndex: 0,
        totalScenes: 4,
        isTransitioning: false,
        autoAdvanceDelay: 12000, // 12 seconds per scene
        autoAdvanceTimer: null,
        scenes: {}
    },

    /**
     * Initialize the application
     */
    init() {
        console.log('🍔 Burger Kingdom Digital Menu - Initializing...');
        
        this.elements.app = document.getElementById('app');
        this.elements.scenes = document.querySelectorAll('.scene');
        this.config.totalScenes = this.elements.scenes.length;
        
        // Initialize all scene controllers
        this.config.scenes = {
            hero: Object.create(HeroScene).init(),
            burgers: Object.create(BurgersScene).init(),
            combos: Object.create(CombosScene).init(),
            offers: Object.create(OffersScene).init()
        };
        
        // Make goToScene available globally for indicator clicks
        window.App = this;
        
        // Start the experience
        this.start();
        
        return this;
    },

    /**
     * Start the application
     */
    async start() {
        // Run loader animation
        const loader = Object.create(LoaderScene).init();
        await loader.run();
        
        // Show first scene
        this.goToScene(1, false);
        
        // Start auto-advance cycle
        this.startAutoAdvance();
        
        console.log('✨ Application started successfully');
    },

    /**
     * Navigate to a specific scene
     * @param {number} targetIndex - Scene number (1-based)
     * @param {boolean} animate - Whether to animate transition
     */
    goToScene(targetIndex, animate = true) {
        if (this.config.isTransitioning) return;
        if (targetIndex < 1 || targetIndex > this.config.totalScenes) return;
        if (targetIndex === this.config.currentSceneIndex) return;
        
        this.config.isTransitioning = true;
        
        const currentIndex = this.config.currentSceneIndex;
        const currentScene = this.elements.scenes[currentIndex - 1];
        const nextScene = this.elements.scenes[targetIndex - 1];
        
        // Get scene names for controllers
        const sceneNames = ['hero', 'burgers', 'combos', 'offers'];
        const currentName = sceneNames[currentIndex - 1];
        const nextName = sceneNames[targetIndex - 1];
        
        // Deactivate current scene
        if (currentScene && this.config.scenes[currentName]) {
            this.config.scenes[currentName].onDeactivate();
        }
        
        if (animate) {
            // Animate transition
            this.animateSceneChange(currentScene, nextScene, currentIndex, targetIndex);
        } else {
            // Instant change (for initial load)
            gsap.set(currentScene, { opacity: 0, visibility: 'hidden' });
            gsap.set(nextScene, { opacity: 1, visibility: 'visible' });
            nextScene.classList.add('active');
            
            // Activate next scene
            if (this.config.scenes[nextName]) {
                this.config.scenes[nextName].onActivate();
            }
            
            this.config.isTransitioning = false;
        }
        
        this.config.currentSceneIndex = targetIndex;
        this.resetAutoAdvance();
    },

    /**
     * Animate scene transition
     * @param {HTMLElement} currentScene 
     * @param {HTMLElement} nextScene 
     * @param {number} currentIndex 
     * @param {number} targetIndex 
     */
    animateSceneChange(currentScene, nextScene, currentIndex, targetIndex) {
        const direction = targetIndex > currentIndex ? 1 : -1;
        const sceneNames = ['hero', 'burgers', 'combos', 'offers'];
        const currentName = sceneNames[currentIndex - 1];
        const nextName = sceneNames[targetIndex - 1];
        
        const tl = gsap.timeline({
            onComplete: () => {
                currentScene.classList.remove('active');
                this.config.isTransitioning = false;
                
                // Activate next scene controller
                if (this.config.scenes[nextName]) {
                    this.config.scenes[nextName].onActivate();
                }
            }
        });
        
        // Exit animation for current scene
        if (this.config.scenes[currentName]) {
            const exitTl = this.config.scenes[currentName].playExit();
            tl.add(exitTl, 0);
        } else {
            tl.to(currentScene.querySelectorAll('.scene-content > *'), {
                x: direction * -100,
                opacity: 0,
                stagger: 0.1,
                duration: 0.5,
                ease: 'power2.in'
            }, 0);
        }
        
        // Prepare next scene
        gsap.set(nextScene, { 
            opacity: 1, 
            visibility: 'visible',
            x: direction * 100
        });
        
        // Enter animation for next scene
        tl.to(nextScene, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
        }, 0.2);
        
        // Play entrance animation for next scene
        if (this.config.scenes[nextName]) {
            const entranceTl = this.config.scenes[nextName].playEntrance();
            tl.add(entranceTl, 0.3);
        }
        
        // Update indicators
        this.updateIndicators(targetIndex);
    },

    /**
     * Go to next scene
     */
    nextScene() {
        const nextIndex = this.config.currentSceneIndex >= this.config.totalScenes 
            ? 1 
            : this.config.currentSceneIndex + 1;
        this.goToScene(nextIndex);
    },

    /**
     * Start auto-advance timer
     */
    startAutoAdvance() {
        this.stopAutoAdvance();
        
        this.config.autoAdvanceTimer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.nextScene();
            }
        }, this.config.autoAdvanceDelay);
        
        console.log(`⏱️ Auto-advance started (${this.config.autoAdvanceDelay / 1000}s per scene)`);
    },

    /**
     * Stop auto-advance timer
     */
    stopAutoAdvance() {
        if (this.config.autoAdvanceTimer) {
            clearInterval(this.config.autoAdvanceTimer);
            this.config.autoAdvanceTimer = null;
        }
    },

    /**
     * Reset auto-advance timer
     */
    resetAutoAdvance() {
        this.startAutoAdvance();
    },

    /**
     * Update scene indicators
     * @param {number} activeIndex 
     */
    updateIndicators(activeIndex) {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 === activeIndex);
        });
        
        // Also update hero scene indicators
        if (this.config.scenes.hero) {
            this.config.scenes.hero.updateIndicators(activeIndex);
        }
    },

    /**
     * Pause the presentation
     */
    pause() {
        this.stopAutoAdvance();
        console.log('⏸️ Presentation paused');
    },

    /**
     * Resume the presentation
     */
    resume() {
        this.startAutoAdvance();
        console.log('▶️ Presentation resumed');
    },

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            this.resume();
        } else {
            this.pause();
        }
    },

    /**
     * Setup keyboard navigation (optional, for testing)
     */
    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    this.nextScene();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    const prevIndex = this.config.currentSceneIndex <= 1 
                        ? this.config.totalScenes 
                        : this.config.currentSceneIndex - 1;
                    this.goToScene(prevIndex);
                    break;
                case ' ':
                    e.preventDefault();
                    if (this.config.autoAdvanceTimer) {
                        this.pause();
                    } else {
                        this.resume();
                    }
                    break;
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    
    // Setup optional keyboard navigation
    App.setupKeyboardNav();
    
    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        App.handleVisibilityChange();
    });
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
