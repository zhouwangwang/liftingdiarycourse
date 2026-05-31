# Data Mutations

## Rule: All Database Mutations via `/data` Helpers

All database mutations **must** go through helper functions located in the `src/data` directory. These helpers use Drizzle ORM — never write raw SQL or call the `db` instance directly from a Server Action.

```
src/data
  users.ts       # user inserts/updates/deletes
  workouts.ts    # workout mutations
  exercises.ts   # exercise mutations
  ...
```

**DO NOT** import or use the Drizzle `db` instance directly in a Server Action, page, or component. Always call a `src/data` helper.

### Example helper (`src/data/workouts.ts`)

```ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}

export async function deleteWorkout(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Rule: Mutations Must Use Server Actions in `actions.ts`

All data mutations **must** be performed via Next.js Server Actions. Server Actions must be defined in colocated `actions.ts` files — one per route segment, placed alongside the `page.tsx` they serve.

```
src/app/workouts/
  page.tsx
  actions.ts     ← Server Actions for this route
```

Every `actions.ts` file must begin with `"use server"`.

**DO NOT** mutate data in Client Components, Route Handlers (`app/api/`), or directly inside Server Components.

## Rule: Server Action Parameters Must Be Typed — No `FormData`

All Server Action parameters must use explicit TypeScript types. `FormData` is **not** a permitted parameter type.

**Wrong — untyped `FormData`:**
```ts
export async function createWorkout(data: FormData) { ... }
```

**Correct — explicit typed parameters:**
```ts
export async function createWorkout(name: string, date: Date) { ... }
```

## Rule: All Server Actions Must Validate Arguments with Zod

Every Server Action **must** validate its arguments using Zod before performing any database operation or business logic.

### Example (`src/app/workouts/actions.ts`)

```ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function createWorkoutAction(name: string, date: Date) {
  const parsed = createWorkoutSchema.safeParse({ name, date });
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const session = await auth();
  return createWorkout(session.user.id, parsed.data.name, parsed.data.date);
}
```

## Rule: No `redirect()` Inside Server Actions — Redirect Client-Side Instead

Never call `redirect()` from `next/navigation` inside a Server Action. Doing so throws a `NEXT_REDIRECT` error that can cause unexpected 500 responses when the action is invoked from a Client Component.

Instead, Server Actions should return a value (or simply resolve), and the calling Client Component is responsible for navigating afterwards using `useRouter`.

**Wrong — redirecting inside the action:**
```ts
// actions.ts
import { redirect } from "next/navigation";

export async function createWorkoutAction(name: string, date: Date) {
  // ... validate and insert ...
  redirect("/dashboard"); // ❌ throws NEXT_REDIRECT, causes 500
}
```

**Correct — return from the action, redirect in the Client Component:**
```ts
// actions.ts
export async function createWorkoutAction(name: string, date: Date) {
  // ... validate and insert ...
  // just return — no redirect
}
```

```tsx
// form component (Client Component)
"use client";

import { useRouter } from "next/navigation";

const router = useRouter();

await createWorkoutAction(name, date);
router.push("/dashboard"); // ✅ redirect happens client-side
```

## Rule: Users Can Only Mutate Their Own Data

Every `src/data` mutation helper that operates on user-owned records **must** scope the operation to the authenticated user's ID. Never mutate records based solely on an ID supplied by the caller without also filtering by `userId`.

The `userId` passed to every helper must always come from the server-side session (`auth()`), never from user-supplied input such as URL params or action arguments.

**Wrong — no user scope:**
```ts
export async function deleteWorkout(workoutId: string) {
  return db.delete(workouts).where(eq(workouts.id, workoutId));
}
```

**Correct — scoped to the authenticated user:**
```ts
export async function deleteWorkout(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```
