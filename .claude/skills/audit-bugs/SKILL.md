---
name: audit-bugs
description: Perform a structured audit for logical bugs, architectural inconsistencies, and code smells.
---

I want you to audit this codebase for bugs, inconsistencies, and potential runtime issues. Follow this specific workflow:

1. **Analysis Phase**: Scan all `.js`, `.html`, and `.css` files. Focus on:
    * **Logical Bugs**: Race conditions in `async` functions, missing error handling in `fetch` calls, or off-by-one errors.
    * **Inconsistencies**: Variations in naming conventions (e.g., camelCase vs snake_case), mixed use of CSS units (px vs rem), or redundant implementations of the same logic.
    * **Safety & Performance**: Global variable leakage, improper cleanup of event listeners, and inefficient DOM manipulation.

2. **Cross-Reference Verification**: Before listing an issue, verify if it is intentional. Check the context of surrounding files to see if a "bug" in one file is actually handled by a parent component or middleware.

3. **Reporting**: Present your findings in a Markdown table with the following columns:
   | File Path | Issue Type | Line # | Severity | Description & Suggested Fix |
   | :--- | :--- | :--- | :--- | :--- |

**Constraint**: Do NOT modify any code. Only provide the diagnostic report. Categorize Severity as: Critical (High risk of crash/data loss), Warning (Sub-optimal/Potential bug), or Style (Inconsistency).
