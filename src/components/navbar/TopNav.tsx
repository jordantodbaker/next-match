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

export default function TopNav() {
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
        <Button as={Link} href="/login" variant="bordered" color="primary">
          Login
        </Button>
      </NavbarContent>
    </Navbar>
  );
}
