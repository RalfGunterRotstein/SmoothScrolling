/**
 * Uses the scrollToTargetY method to scroll window to a given Y position.
 * @author Ralf Gunter Rotstein <ralf.rotstein@gmail.com>
 * @copyright Copyright (c) 2021, Ralf Gunter Rotstein
 * @license https://www.gnu.org/licenses/gpl-3.0.html GNU General Public License
 * 
 * @category SmoothScrolling
 * @package SmoothScrolling
 * @version 1.0.0
 */
class SmoothScrolling {
    /**
     * Sets instance ready to use.
     * @param {number} scrollMaxTimeDuration Max waiting time in milliseconds.
	 * @constructor
     */
    constructor(scrollMaxTimeDuration) {
        this.maxDuration = scrollMaxTimeDuration;
        this.loopGap = 10;
        this.timeLimit = this.maxDuration + this.loopGap * 2;

        jQuery(window).on("wheel touchstart", this.lockScrolling.bind(this));
    }

    /**
     * Scrolls window to the given position in pixels.
     * @param {number} targetY The scroll bar will scroll unto this height in pixels.
	 * @returns {void}
     */
    scrollToTargetY(targetY) {
        this.unlockScrolling();

        const initialTime = Date.now();
        
        const initialYPosition = window.scrollY;
        const distanceToScroll = targetY - initialYPosition;

        const animationDuration = Math.min(Math.abs(distanceToScroll)/2, this.maxDuration);

        // Function used to run the animation repeatedly until it reaches its target.
        const loop = scrollToTargetYLoop.bind(this);
        loop(targetY, animationDuration, initialYPosition, initialTime, distanceToScroll);
    
        /**
         * Scrolls window according to the elapsedTime.
         * @param {*} targetY Height in pixels in which the animation will end.
         * @param {*} animationDuration Time the animation will take to reach its target.
         * @param {*} initialYPosition Height in pixels in which the animation started.
         * @param {*} initialTime Time in milliseconds when the animation started.
         * @param {*} distanceToScroll Difference between targetY and initialYPosition.
	     * @returns {void}
         */
        function scrollToTargetYLoop(targetY, animationDuration, initialYPosition, initialTime, distanceToScroll) {
            const elapsedTime = Date.now() - initialTime;
            
            if (!(elapsedTime > this.timeLimit) &&
                !this.scrollingIsLocked()) {
                const elapsedTimePercentage = Math.min(elapsedTime / animationDuration, 1);
                const moveAmount = distanceToScroll * elapsedTimePercentage;
                const currentY = initialYPosition + moveAmount;

                window.scrollTo(window.scrollX, currentY);
                
                setTimeout(scrollToTargetYLoop.bind(this, targetY, animationDuration, initialYPosition, initialTime, distanceToScroll), this.loopGap);
            }
        }
    }

    /**
     * Enables scrolling.
	 * @returns {void}
     */
    unlockScrolling() { this.stopScrolling = false; }

    /**
     * Disables scrolling when something interferes with it.
	 * @returns {void}
     */
    lockScrolling() { this.stopScrolling = true; }

    /**
     * False means the instance can't cause scrolling.
	 * @returns {void}
     */
    scrollingIsLocked() { return this.stopScrolling; }
}

const smoothScrolling = new SmoothScrolling(500);