---
name: project-docs-conventions
description: Naming conventions and structural patterns observed in /docs files and CLAUDE.md docs list location
metadata:
  type: project
---

Docs files follow kebab-case naming (e.g., `data-fetching.md`, `data-mutations.md`). Topic-based filenames, all lowercase.

The docs list lives in `## IMPORTANT: Docs-First Rule` section of `CLAUDE.md`, as a simple bullet list (`- /docs/<filename>.md`). New entries are always appended at the end of that list.

**Why:** The section instructs Claude Code to read all listed docs before generating code — keeping the list current ensures the right files are consulted.

**How to apply:** When adding a new entry, append after the last `- /docs/...` line in that section. Do not modify any other part of the file.
