/**
 * Registry of effect type handlers.
 * Defines how each effect type applies, removes, and stacks.
 *
 * SIDE EFFECTS: Effect handlers directly mutate the target entity (e.g., player.speed).
 * This is intentional - when debugging player state changes, check active effects first.
 */
const EffectTypes = {
    /**
     * Speed boost effect - increases player movement speed.
     */
    [Constants.game.effects.fast.type]: {
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
    [Constants.game.effects.slow.type]: {
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
    [Constants.game.effects.shield.type]: {
        category: 'player',
        stackMode: 'replace',
        stackGroup: 'shield',
        apply: () => {},
        remove: () => {},
        onHit: (_, __, manager) => {
            manager.removeEffect(Constants.game.effects.shield.type)
            manager.addEffect(Constants.game.effects.immunity.type, Constants.game.effects.immunity)
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
    [Constants.game.effects.immunity.type]: {
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
