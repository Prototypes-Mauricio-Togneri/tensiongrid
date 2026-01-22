/**
 * Registry of effect type handlers.
 * Defines how each effect type applies, removes, and stacks.
 */
const EffectTypes = {
    /**
     * Speed boost effect - increases player movement speed.
     */
    [Constants.effectTypes.fast]: {
        category: 'player',
        stackMode: 'replace',
        stackGroup: 'speed',
        apply: (player, effect) => {
            player.speed = player.baseSpeed * effect.config.speedMultiplier
        },
        remove: (player) => {
            player.speed = player.baseSpeed
        },
        renderHint: {
            glowColor: 'powerUpFast',
            glowColorAlpha: 'powerUpFastGlow'
        }
    },

    /**
     * Speed slow effect - decreases player movement speed.
     */
    [Constants.effectTypes.slow]: {
        category: 'player',
        stackMode: 'replace',
        stackGroup: 'speed',
        apply: (player, effect) => {
            player.speed = player.baseSpeed * effect.config.speedMultiplier
        },
        remove: (player) => {
            player.speed = player.baseSpeed
        },
        renderHint: {
            glowColor: 'powerDownSlow',
            glowColorAlpha: 'powerDownSlowGlow'
        }
    },

    /**
     * Shield effect - protects player from one hit.
     */
    [Constants.effectTypes.shield]: {
        category: 'player',
        stackMode: 'replace',
        stackGroup: 'shield',
        apply: () => {},
        remove: () => {},
        onHit: (player, effect, manager) => {
            manager.removeEffect(Constants.effectTypes.shield)
            manager.addEffect(Constants.effectTypes.immunity, Constants.game.effects.immunity)
            return true
        },
        renderHint: {
            showShield: true,
            glowColor: 'shield',
            glowColorAlpha: 'shieldGlow'
        }
    },

    /**
     * Immunity effect - temporary invincibility after shield breaks.
     */
    [Constants.effectTypes.immunity]: {
        category: 'player',
        stackMode: 'replace',
        stackGroup: 'immunity',
        apply: () => {},
        remove: () => {},
        renderHint: {
            blink: true,
            glowColor: 'shield',
            glowColorAlpha: 'shieldGlow'
        }
    }
}
