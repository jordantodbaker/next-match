"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPostLoginPath } from "../actions/userActions";

/**
 * Post-login landing decider. Clerk's <SignIn> redirect is static and the
 * role lives in Prisma, so we land here and route by role. The navigation is
 * done client-side with the router: a Server Component `redirect()` issued as
 * the immediate Clerk landing page isn't reliably followed by Clerk's
 * client-side post-sign-in navigation, which left users stranded on this URL.
 */
export default function PostLoginPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    getPostLoginPath()
      .then((path) => {
        if (active) router.replace(path);
      })
      .catch(() => {
        // Never leave the user stranded here — default to the report.
        if (active) router.replace("/report");
      });
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="flex h-full w-full justify-center mt-20">
      <p className="text-xl text-neutral-500">Signing you in…</p>
    </div>
  );
}
