### 11. Expensive Visibility Check in Loop

- **File**: `public/js/ui/screen.js`
- **Issue Type**: Performance
- **Line #**: 27-29
- **Severity**: Style
- **Description & Suggested Fix**: `get buttons()` checks `offsetParent !== null` on every call. This triggers layout recalculation. Called frequently from main loop. **Suggestion**: Cache visible buttons and invalidate on resize.

### 12. Pause Button Count Assumption

- **File**: `public/js/main.js`
- **Issue Type**: Coupling
- **Line #**: 60
- **Severity**: Style
- **Description & Suggested Fix**: `pauseButtons` is queried once at init but pause menu button count is assumed fixed. Adding/removing buttons in HTML breaks navigation. **Suggestion**: Add comment documenting this constraint.

### 13. First Frame Delta Waste

- **File**: `public/js/engine/game.js`
- **Issue Type**: Timing
- **Line #**: 356-357
- **Severity**: Style
- **Description & Suggested Fix**: `start()` sets `this.lastTime = 0`, then first `gameLoop()` call calculates `delta = currentTime - 0` which is a large value. This is caught by `maxDeltaTime` check at line 299, but wastes a frame. **Suggestion**: Initialize `lastTime` to `performance.now()`.