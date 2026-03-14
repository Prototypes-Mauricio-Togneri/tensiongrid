---
name: sync-architecture
description: Synchronize architecture.md with the current codebase implementation.
---

I want you to perform a high-fidelity synchronization between `docs/architecture.md` and the actual codebase. Follow this workflow:

1. **Discovery Phase**: Analyze the project structure, core modules, data flow, and technology stack currently implemented in the source code.
2. **Gap Analysis**: Compare the "Source of Truth" (the code) against `docs/architecture.md`. Identify:
    * **Stale Information**: Components or workflows described in the doc that no longer exist.
    * **Missing Documentation**: New modules, patterns, or integrations implemented in the code but absent from the doc.
    * **Inconsistencies**: Discrepancies in naming conventions, folder structures, or architectural patterns.
3. **Drafting Phase**: Propose specific text updates for `docs/architecture.md` that resolve these gaps while maintaining a high-level architectural perspective.

**Output**: Provide a summary of the discrepancies found and a Markdown diff for `docs/architecture.md`.

**Constraint**: Ensure the updated documentation remains a high-level architectural guide, not a low-level file manifest.
