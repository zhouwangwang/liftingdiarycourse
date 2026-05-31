# Authentication

## Rule: Clerk is the Only Auth Provider

This app uses **Clerk** for all authentication. Do not implement custom auth, use NextAuth, or any other auth library.

## Getting the Current User

Always retrieve the authenticated user via Clerk's server-side helpers. Never trust user-supplied IDs from URL params or request bodies.

In Server Components and data helpers, use `auth()` from `@clerk/nextjs/server`:

```tsx
import { auth } from "@clerk/nextjs/server"

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // pass userId to /data helpers
}
```

## Protecting Pages

Use Clerk's `auth()` to guard pages that require authentication. Redirect unauthenticated users to `/sign-in`:

```tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // render page
}
```

For route-level protection across many pages, configure `clerkMiddleware` in `middleware.ts` instead of repeating the check in every page.

## Middleware

Use `clerkMiddleware` in `middleware.ts` to control which routes are public vs. protected:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
}
```

## Sign In / Sign Up UI

Use Clerk's pre-built components. Do not build custom sign-in or sign-up forms:

```tsx
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return <SignIn />
}
```

```tsx
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return <SignUp />
}
```

## User Identity in Data Helpers

The `userId` passed to every `/data` helper must come from `auth()` on the server, never from client input. See `data-fetching.md` for the full data scoping rule.

```ts
// In a Server Component — correct
const { userId } = await auth()
const workouts = await getWorkoutsForUser(userId)
```

## Client Components

In Client Components, use Clerk's client-side hooks when you need user info for display purposes only — never for access control decisions (those must happen server-side):

```tsx
"use client"

import { useUser } from "@clerk/nextjs"

export function UserGreeting() {
  const { user } = useUser()
  return <p>Hello, {user?.firstName}</p>
}
```

## Environment Variables

Clerk requires the following environment variables. Never hardcode these values:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
