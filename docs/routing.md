# Routing

## Rule: All App Routes Live Under `/dashboard`

Every application route (beyond public auth pages) must be nested under `/dashboard`. There are no top-level app routes outside of auth and the marketing/landing page.

```
src/app/
  page.tsx                          # landing / marketing page (public)
  sign-in/[[...sign-in]]/page.tsx   # Clerk sign-in (public)
  sign-up/[[...sign-up]]/page.tsx   # Clerk sign-up (public)
  dashboard/
    page.tsx                        # /dashboard — main dashboard
    workout/
      page.tsx                      # /dashboard/workout
      [workoutId]/
        page.tsx                    # /dashboard/workout/:workoutId
```

Do not create route segments at the `src/app/` root level for app features. If a page belongs to the app, it belongs under `src/app/dashboard/`.

## Rule: All `/dashboard` Routes Are Protected

Every route under `/dashboard` is a protected route — it must only be accessible to authenticated users. Unauthenticated requests must be redirected to `/sign-in`.

**Do not** add per-page auth checks inside `page.tsx` files for protection. Route protection is handled at the middleware layer (see below).

## Rule: Route Protection via Next.js Middleware

All `/dashboard` route protection is enforced in `middleware.ts` using `clerkMiddleware`. This is the single place where auth gating happens — not in individual pages or layouts.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
```

Any route not listed in `isPublicRoute` is automatically protected. To add a new public route, add it to the `createRouteMatcher` array — do not add auth checks inside the page itself.

## Rule: Public Routes Are Explicitly Listed

The only public routes are:

- `/` — landing page
- `/sign-in` and sub-paths
- `/sign-up` and sub-paths

Everything else, including all `/dashboard/**` routes, is protected by default via the middleware pattern above.
