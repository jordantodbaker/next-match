"use client";

import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import TopNav from "./navbar/TopNav";
import { CompanyAccount } from "@prisma/client";
import { CompanyContext } from "./CompanyContext";

export default function Providers({
  companies,
  children,
}: {
  companies: CompanyAccount[];
  children: ReactNode;
}) {
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);

  return (
    <SessionProvider>
      <HeroUIProvider>
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          className="z-50"
        />
        <CompanyContext value={selectedCompany as any}>
          <TopNav
            companies={companies}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
          />
          {children}
        </CompanyContext>
      </HeroUIProvider>
    </SessionProvider>
  );
}
