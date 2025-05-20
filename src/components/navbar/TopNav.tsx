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
import { GiMatchTip } from "react-icons/gi";
import NavLink from "./NavLink";
import { useSession } from "next-auth/react";
import { signOut } from "@/auth";

export default function TopNav() {
  const { data: session } = useSession();
  console.log("SESSION ", session);
  return (
    <Navbar
      maxWidth="xl"
      className="flex flex-row  border-b-1"
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
          <Button
            as={Link}
            href="/login"
            variant="bordered"
            color="primary"
            onClick={async () => {
              "use server";
              await signOut();
            }}
          >
            Logout
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
}
