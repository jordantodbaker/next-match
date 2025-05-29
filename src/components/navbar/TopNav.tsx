"use client";

import {
  Button,
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/react";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
//import { signOut } from "@/auth";

import { signOut } from "next-auth/react";

export default function TopNav() {
  const router = useRouter();
  const { data: session } = useSession();

  function SignOut() {
    return (
      <Button
        as={Link}
        href="/login"
        variant="bordered"
        color="primary"
        onPress={async () => {
          signOut({ callbackUrl: "/login" });
          router.push("/login");
        }}
      >
        Logout
      </Button>
    );
  }

  return (
    <Navbar
      maxWidth="xl"
      className="flex flex-row  border-b-1 border-b-cyan-600"
      classNames={{
        item: ["text-xl", "uppercase"],
        brand: [""],
      }}
    >
      <NavbarBrand as={Link} href="/">
        <Image src="../../../logo.png" height={60} />
      </NavbarBrand>

      <NavbarContent justify="end">
        {!session ? (
          <Button as={Link} href="/login" variant="bordered" color="primary">
            Login
          </Button>
        ) : (
          SignOut()
        )}
      </NavbarContent>
    </Navbar>
  );
}
