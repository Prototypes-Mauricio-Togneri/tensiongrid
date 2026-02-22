---
description: Perform a structured audit for cross-platform compatibility issues, browser-specific bugs, and hardware-dependent bottlenecks.
---

I want you to audit this codebase for platform-dependent bugs, compatibility issues, and hardware-specific bottlenecks. Follow this specific workflow:

1. **Analysis Phase**: Scan all `.js`, `.html`, and `.css` files. Focus on:
    * **Browser API Compatibility**: Identify usage of APIs that lack broad browser support (e.g., non-standard `AudioContext` initialization, missing vendor prefixes, reliance on APIs unavailable in Safari/Firefox/mobile browsers). Check for missing feature detection or fallbacks.
    * **Input & Interaction**: Detect logic that assumes a specific input method. Look for mouse-only event handling without touch equivalents, missing pointer event normalization, keyboard-only controls without gamepad or touch alternatives, and hover-dependent interactions on touch devices.
    * **Canvas & Rendering**: Identify rendering logic that may fail or degrade across platforms. Look for assumptions about device pixel ratio, canvas size limits on mobile, `requestAnimationFrame` timing inconsistencies, and WebGL feature usage without capability checks.
    * **Audio**: Look for audio playback issues such as autoplay policy violations, unsupported audio formats without fallbacks, missing `AudioContext` resume after user gesture, and codec assumptions.
    * **Performance & Memory**: Identify platform-specific performance concerns. Look for frame rate assumptions (e.g., hardcoded 60fps instead of delta-time), excessive object allocation in hot loops, unbounded caches or arrays, and missing cleanup of animation frames or intervals.
    * **CSS & Layout**: Detect CSS that may render inconsistently across browsers or viewport sizes. Look for missing `-webkit` prefixes where needed, viewport unit issues on mobile (e.g., `100vh` not accounting for mobile browser chrome), and font rendering assumptions.

2. **Cross-Reference Verification**: Before listing an issue, verify if it is already handled. Check surrounding code for existing feature detection, polyfills, or conditional logic that addresses the concern.

3. **Reporting**: Present your findings in a Markdown table with the following columns:
   | File Path | Line # | Severity | Platform(s) Affected | Description & Recommended Fix |
   | :--- | :--- | :--- | :--- | :--- |

**Severity Levels** (exclude anything below these):
- **Critical**: Will crash or completely break functionality on affected platform(s).
- **High**: Major feature degradation or silent failure on affected platform(s).
- **Medium**: Noticeable visual or behavioral inconsistency across platforms.
- **Warning**: Sub-optimal behavior that may surface under specific conditions.

**Constraint**: Do NOT modify any code. Only provide the diagnostic report.
