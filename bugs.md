### 13. First Frame Delta Waste

- **File**: `public/js/engine/game.js`
- **Issue Type**: Timing
- **Line #**: 356-357
- **Severity**: Style
- **Description & Suggested Fix**: `start()` sets `this.lastTime = 0`, then first `gameLoop()` call calculates `delta = currentTime - 0` which is a large value. This is caught by `maxDeltaTime` check at line 299, but wastes a frame. **Suggestion**: Initialize `lastTime` to `performance.now()`.