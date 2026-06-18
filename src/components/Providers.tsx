"use client";

import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopNav from "./navbar/TopNav";
import { User } from "@prisma/client";
import { UserContext } from "./UserContext";
import { getUser } from "@/app/actions/userActions";

export default function Providers({
  user: initialUser,
  children,
}: {
  user: User | null;
  children: ReactNode;
}) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [user, setUser] = useState<User | null>(initialUser);

  // Keep the app user in sync with Clerk's (always-current) client auth state.
  // Next preserves the root layout across client navigations, so the
  // server-seeded `initialUser` can go stale after a logout/login; re-resolve
  // whenever the signed-in Clerk identity changes.
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setUser(null);
      return;
    }
    if (user?.clerkId === userId) return; // already in sync — skip the fetch

    let active = true;
    getUser().then((res) => {
      if (active) setUser(res.status === "success" ? res.data : null);
    });
    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn, userId, user?.clerkId]);

  return (
    <UserContext value={user}>
      <HeroUIProvider>
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          className="z-50"
        />
        <TopNav />
        {children}
      </HeroUIProvider>
    </UserContext>
  );
}
