"use client";

import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import TopNav from "./navbar/TopNav";
import { CompanyAccount, Project } from "@prisma/client";
import { CompanyContext } from "./CompanyContext";
import { ProjectContext } from "./ProjectContext";

export default function Providers({
  companies,
  projects,
  children,
}: {
  companies: CompanyAccount[];
  projects: Project[];
  children: ReactNode;
}) {
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <SessionProvider>
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
    </SessionProvider>
  );
}
