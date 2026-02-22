### `user-select: none` missing vendor prefixes

**File**: `css/styles.css` | **Line**: 30
**Platforms**: Safari < 3, Firefox < 69, IE/Edge Legacy

Modern browsers support unprefixed, but older Safari and Firefox need `-webkit-user-select` and `-moz-user-select`.

**Fix**: Add prefixed versions before the standard property.

---

### Missing `<meta name="theme-color">`

**File**: `index.html`
**Platforms**: Mobile browsers (Android, iOS)

Browser chrome color doesn't match the game's dark aesthetic, breaking immersion on mobile.

**Fix**: Add `<meta name="theme-color" content="#0a0a0f">`.

---

### `sound.cloneNode()` + `play()` failures are silent

**File**: `js/io/audio_manager.js` | **Lines**: 99-102
**Platforms**: All platforms with audio errors

If a sound file 404s during preload (line 75), `cloneNode()` on line 99 creates a clone of a broken Audio element. `play()` rejects silently. No user feedback.

**Fix**: Validate `sound.readyState` before cloning, or add an `error` event listener during preload.

---

### No load error handling for preloaded sounds

**File**: `js/io/audio_manager.js` | **Lines**: 73-76
**Platforms**: All platforms

`new Audio(path)` elements never get `error` event listeners. If files fail to load (network error, 404), the failure is completely silent until playback is attempted.

**Fix**: Add `onerror` handler during preload.
