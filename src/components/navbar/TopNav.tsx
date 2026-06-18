"use client";

import {
  Button,
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import Link from "next/link";
import React from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { CompanyAccount, Project, SecurityRole } from "@prisma/client";

export default function TopNav({
  companies,
  projects,
  selectedCompany,
  setSelectedCompany,
  selectedProject,
  setSelectedProject,
}: {
  companies: CompanyAccount[];
  selectedCompany: CompanyAccount;
  setSelectedCompany: any;
  projects: Project[];
  selectedProject: Project;
  setSelectedProject: any;
}) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const user = useCurrentUser();

  function SignOut() {
    return (
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
    );
  }

  const onChangeCompany = (key: any) => {
    const company = companies.find((c: any) => c.id == key) as CompanyAccount;
    setSelectedCompany(company);
  };

  const onChangeProject = (key: any) => {
    const project = projects.find((p: any) => p.id == key) as any;
    setSelectedProject(project);
  };

  return (
    <Navbar
      maxWidth="xl"
      height="5rem"
      className="flex flex-row  border-b-1 border-b-cyan-600"
      classNames={{
        item: ["text-xl", "uppercase"],
        brand: [""],
      }}
    >
      <NavbarBrand as={Link} href="/">
        <Image src="../../../logo.png" height={75} />
      </NavbarBrand>

      <NavbarContent justify="end">
        {user?.securityRole === SecurityRole.ADMIN && (
          <div>
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" color="primary">
                    {selectedCompany.name ? selectedCompany.name : "Company"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  color="primary"
                  variant="faded"
                  aria-label="Static Actions"
                  onAction={(key) => onChangeCompany(key)}
                  // selectedKeys={[2]}
                  selectionMode="single"
                >
                  {companies.map((company: any) => (
                    <DropdownItem key={company.id}>{company.name}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        )}
        {isSignedIn && (
          <div className="flex flex-row items-center">
            {/* Project selector hidden for now */}
            <div>{SignOut()}</div>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
}
