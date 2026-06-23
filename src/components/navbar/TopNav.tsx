"use client";

import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function TopNav() {
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <Navbar
      maxWidth="full"
      height="5rem"
      isBlurred={false}
      classNames={{
        base: "bg-white border-b-1 border-b-primary",
        item: ["text-xl", "uppercase"],
        brand: [""],
      }}
    >
      <NavbarBrand as={Link} href="/">
        <Image
          src="/logo.png"
          alt="Ace Project Services"
          width={1301}
          height={496}
          priority
          className="h-[75px] w-auto"
        />
      </NavbarBrand>

      <NavbarContent justify="end">
        {isSignedIn && (
          <Button
            as={Link}
            href="/login"
            variant="bordered"
            color="primary"
            onPress={async () => {
              await signOut({ redirectUrl: "/login" });
            }}
          >
            Logout
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
}
