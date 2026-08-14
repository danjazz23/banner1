/**
 * Loader Scene Controller
 * Handles the initial loading animation
 */

const LoaderScene = {
    elements: {
        loader: null,
        progress: null,
        logo: null
    },

    config: {
        minDuration: 1500,
        maxDuration: 3000,
        stages: [30, 60, 85, 100]
    },

    /**
     * Initialize loader elements
     */
    init() {
        this.elements.loader = document.getElementById('loader');
        this.elements.progress = document.querySelector('.loader-progress');
        this.elements.logo = document.querySelector('.loader-logo');
        
        return this;
    },

    /**
     * Run the loading animation
     * @returns {Promise<void>}
     */
    async run() {
        const tl = gsap.timeline();
        
        // Initial state
        gsap.set(this.elements.progress, { width: '0%' });
        gsap.set(this.elements.logo, { opacity: 0, y: 20 });
        
        // Animate logo in
        tl.to(this.elements.logo, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Simulate loading progress through stages
        for (let i = 0; i < this.config.stages.length; i++) {
            const targetWidth = this.config.stages[i];
            const delay = Helpers.random(300, 600);
            
            await Helpers.wait(delay);
            
            tl.to(this.elements.progress, {
                width: `${targetWidth}%`,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
        
        // Hold at 100% briefly
        await Helpers.wait(300);
        
        // Fade out loader
        tl.to(this.elements.loader, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                this.elements.loader.style.display = 'none';
            }
        });
        
        // Minimum duration check
        const elapsed = tl.time();
        if (elapsed < this.config.minDuration / 1000) {
            await Helpers.wait(this.config.minDuration / 1000 - elapsed);
        }
        
        return tl;
    },

    /**
     * Skip loader immediately
     */
    skip() {
        gsap.set(this.elements.loader, { 
            opacity: 0, 
            display: 'none',
            immediateRender: true 
        });
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoaderScene;
}
