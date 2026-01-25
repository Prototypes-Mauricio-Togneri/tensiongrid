### 6. Redundant Event Listener Removal

- **File**: `public/js/io/audio_manager.js`
- **Issue Type**: Event Cleanup
- **Line #**: 155-174
- **Severity**: Warning
- **Description & Suggested Fix**: Interaction listeners use `{ once: true, capture: true }` but `removeEventListener` also specifies `{ capture: true }`. The `once: true` triggers auto-removal, but manual removal tries to remove already-removed listener. Harmless but redundant. **Fix**: Remove manual removal since `once: true` handles it.

### 7. Touch Event Enable Check Inconsistency

- **File**: `public/js/io/input_manager.js`
- **Issue Type**: Consistency
- **Line #**: 76, 87-88
- **Severity**: Style
- **Description & Suggested Fix**: `touchstart` doesn't check `isSwipeEnabled?.()` but `touchmove` does. This is intentional (touch position is tracked regardless), but could be confusing. **Suggestion**: Add comment clarifying intent.

### 8. Zero Vector Not Handled in Snap

- **File**: `public/js/enemies/enemy_shooter.js`
- **Issue Type**: Edge Case
- **Line #**: 179-187
- **Severity**: Warning
- **Description & Suggested Fix**: `snapToCardinalDirection()` uses `Math.abs(x) > Math.abs(y)` which returns `dirCol: -1` when both x and y are 0. Zero vector should return zero movement. **Fix**: Add early return for zero vector case.

### 9. Silent Preload Failure

- **File**: `public/js/io/local_storage.js`
- **Issue Type**: Silent Failure
- **Line #**: 77
- **Severity**: Style
- **Description & Suggested Fix**: `preloadLevel()` catches errors with `.catch(() => {})`. Preload failures are invisible, making debugging harder. **Suggestion**: Add debug logging in development mode.

### 10. Missing Level Number Validation

- **File**: `public/js/io/local_storage.js`
- **Issue Type**: Validation
- **Line #**: 45-51
- **Severity**: Style
- **Description & Suggested Fix**: `getCurrentLevel()` doesn't validate that stored value is a positive integer. Corrupted localStorage could return `NaN`. **Suggestion**: Add bounds check.

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