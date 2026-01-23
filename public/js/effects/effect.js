/**
 * Represents an active effect on a target entity.
 * Effects are data objects managed by EffectManager.
 */
class Effect {
  /**
   * @param {string} type - Effect type identifier from Constants.game.effects.X.type
   * @param {Object} config - Effect configuration from Constants.effects
   */
  constructor(type, config) {
    this.type = type;
    this.duration = config.duration;
    this.remaining = config.duration;
    this.config = config;
    this.expired = false;
  }

  /**
   * Update effect timer.
   * @param {number} delta - Time elapsed in milliseconds
   * @returns {boolean} True if effect just expired this frame
   */
  update(delta) {
    if (this.expired) return false;

    this.remaining -= delta;
    if (this.remaining <= 0) {
      this.remaining = 0;
      this.expired = true;
      return true;
    }
    return false;
  }

  /**
   * Get progress as 0-1 value (1 = just started, 0 = expired).
   * @returns {number} Progress ratio
   */
  getProgress() {
    return this.remaining / this.duration;
  }
}
