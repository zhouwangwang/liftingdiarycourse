# UI Coding Standards

## Component Library

**Only shadcn/ui components are permitted in this project.**

Do not create custom UI components. Every UI element — buttons, inputs, dialogs, cards, badges, tables, dropdowns, etc. — must come from the shadcn/ui library. If a required component is not yet installed, add it via the CLI:

```bash
npx shadcn@latest add <component-name>
```

All shadcn/ui components live in `src/components/ui/` and are imported from there:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

## Date Formatting

Use `date-fns` for all date formatting. Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use the `do MMM yyyy` format token with `format` from `date-fns`:

```tsx
import { format } from "date-fns"

format(new Date("2025-09-01"), "do MMM yyyy") // "1st Sep 2025"
format(new Date("2025-08-02"), "do MMM yyyy") // "2nd Aug 2025"
format(new Date("2026-01-03"), "do MMM yyyy") // "3rd Jan 2026"
format(new Date("2024-06-04"), "do MMM yyyy") // "4th Jun 2024"
```

Never use `Date.toLocaleDateString()`, `Intl.DateTimeFormat`, or any other date formatting approach.
