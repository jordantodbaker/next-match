"use client";

import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopNav from "./navbar/TopNav";
import { CompanyAccount, Project, User } from "@prisma/client";
import { CompanyContext } from "./CompanyContext";
import { ProjectContext } from "./ProjectContext";
import { UserContext } from "./UserContext";
import { emptyCompany, emptyProject } from "@/lib/schemas/defaultModels";

export default function Providers({
  user,
  companies,
  projects,
  children,
}: {
  user: User | null;
  companies: CompanyAccount[];
  projects: Project[];
  children: ReactNode;
}) {
  const initialCompany = companies.length > 0 ? companies[0] : emptyCompany;
  const initialProject = projects.length > 0 ? projects[0] : emptyProject;

  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  const [selectedProject, setSelectedProject] = useState(initialProject);

  return (
    <UserContext value={user}>
      <HeroUIProvider>
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          className="z-50"
        />
        <CompanyContext value={selectedCompany as any}>
          <ProjectContext value={selectedProject}>
            <TopNav
              companies={companies}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              projects={projects}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
            />
            {children}
          </ProjectContext>
        </CompanyContext>
      </HeroUIProvider>
    </UserContext>
  );
}
