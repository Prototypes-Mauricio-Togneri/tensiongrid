---
description: Perform a structured audit of unused JS and CSS code.
---

I want you to audit this codebase for dead code. Follow this exact methodology:

1. **Analysis Phase**: Scan all `.js`, `.html`, and `.css` files. Look for functions that are defined but never called, HTML tags that are never used, and CSS classes that never appear in any `.html` or `.js` file.
2. **"Think Harder" Verification**: For every potential "dead" item, check if it might be used dynamically (e.g., a class like `status-${type}` or a JS function called via `eval` or dynamic event listeners).
3. **Reporting**: Present your findings in a Markdown table with the following columns:
   | File Path | Code/Selector | Line # | Confidence | Reason |
   | :--- | :--- | :--- | :--- | :--- |

**Constraint**: Do NOT delete any code. Only provide the report.
