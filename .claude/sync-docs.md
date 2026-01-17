---
description: Audits and updates JS/CSS documentation based on docs/architecture.md standards.
---

I want you to synchronize the inline documentation across the codebase. Follow this specific workflow:

1. **Rule Retrieval**:
   - Read the file `docs/architecture.md`.
   - Identify the "Source of Truth" for documentation standards (e.g., specific JSDoc tags, CSS naming conventions, or commenting styles).

2. **File Audit**:
   - Locate and analyze all JavaScript (`.js`) and CSS (`.css`) files in the codebase.
   - Compare the existing comments against the rules found in `docs/architecture.md`.
   - Identify any missing, outdated, or non-compliant documentation.
   - Update the documentation in each file to match the implementation and the architectural standards.

3. **Safety constraints**:
   - Modify **comments only**. Do NOT change any Javascript logic or CSS property values.
