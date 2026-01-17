---
description: Audits and updates JS/CSS documentation based on docs/architecture.md standards.
---

I want to synchronize the inline documentation across the codebase. Follow this specific workflow:

1. **Rule Retrieval**:
   - Read the file `docs/architecture.md`.
   - Identify the "Source of Truth" for documentation standards (e.g., specific JSDoc tags, CSS naming conventions, or commenting styles).

2. **File Audit**:
   - Locate and analyze all JavaScript (`.js`) and CSS (`.css`) files in the current scope.
   - Compare the existing inline comments against the rules found in `docs/architecture.md`.
   - Identify any missing, outdated, or non-compliant documentation.

3. **Auto-Correction**:
   - Update the documentation in each file to match the implementation and the architectural standards.
   - **For JavaScript**: Add or fix JSDoc blocks for all functions, ensuring `@param` and `@returns` types are accurate.
   - **For CSS**: Add section headers and selector explanations as defined in the standards.

4. **Safety constraints**:
   - Modify **comments only**. Do NOT change any executable logic or CSS property values.
   - If the logic is too complex to document clearly, leave a TODO comment for manual review.

**Target Scope**: Process files matching: $ARGUMENTS (or the whole project if blank).
