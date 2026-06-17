import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that should be reachable while signed out.
const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect({ unauthenticatedUrl: new URL("/login", req.url).toString() });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|map)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
