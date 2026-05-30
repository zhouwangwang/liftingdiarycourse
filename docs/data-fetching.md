# Data Fetching

## Rule: Server Components Only

All data fetching in this app **must** be done exclusively via React Server Components.

- **DO NOT** fetch data in Route Handlers (`app/api/`)
- **DO NOT** fetch data in Client Components (`"use client"`)
- **DO NOT** use `useEffect`, `fetch` on the client, SWR, React Query, or any other client-side data fetching pattern

Data flows in one direction: database → `/data` helper → Server Component → props to Client Components (for interactivity only).

## Rule: All Database Queries via `/data` Helpers

All database queries **must** go through helper functions located in the `/data` directory. These helpers use Drizzle ORM — never write raw SQL.

```
/data
  users.ts       # user lookups
  workouts.ts    # workout queries
  exercises.ts   # exercise queries
  ...
```

**DO NOT** import or use the Drizzle `db` instance directly in a page, layout, or component. Always call a `/data` helper.

### Example helper (`/data/workouts.ts`)

```ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example usage in a Server Component

```tsx
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/auth";

export default async function WorkoutsPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);
  return <WorkoutList workouts={workouts} />;
}
```

## Rule: Users Can Only Access Their Own Data

Every `/data` helper that returns user-owned records **must** filter by the authenticated user's ID. Never return records based solely on a URL parameter or body input without also scoping the query to the current user.

**Wrong — no user scope:**
```ts
export async function getWorkout(workoutId: string) {
  return db.select().from(workouts).where(eq(workouts.id, workoutId));
}
```

**Correct — scoped to the authenticated user:**
```ts
export async function getWorkout(workoutId: string, userId: string) {
  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

The `userId` passed to every helper must always come from the server-side session (`auth()`), never from user-supplied input such as URL params or request bodies.
