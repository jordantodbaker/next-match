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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
//import { signOut } from "@/auth";

import { signOut } from "next-auth/react";
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
  const { data: session, update } = useSession();
  const user = session?.user;

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
        {!session ? (
          <Button as={Link} href="/login" variant="bordered" color="primary">
            Login
          </Button>
        ) : (
          <div className="flex flex-row">
            <div className="mr-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" color="primary">
                    {selectedProject.name ? selectedProject.name : "Project"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  color="primary"
                  variant="faded"
                  aria-label="Static Actions"
                  onAction={(key) => onChangeProject(key)}
                  // selectedKeys={[2]}
                  selectionMode="single"
                >
                  {projects.map((project: any) => (
                    <DropdownItem key={project.id}>{project.name}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div>{SignOut()}</div>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
}
