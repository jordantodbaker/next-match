"use client";

import React, { useContext } from "react";
import { CompanyContext } from "@/components/CompanyContext";

export default function ReportView() {
  const company = useContext(CompanyContext);

  if (!company?.powerBiUrl) {
    return (
      <div className="flex h-full w-full justify-center mt-20">
        <p className="text-xl text-neutral-500">
          No report configured for your organization yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full justify-center mt-6 px-4">
      <iframe
        title={`${company.name} Power BI Report`}
        className="w-[95vw] h-[90vh]"
        src={company.powerBiUrl}
        allowFullScreen={true}
      ></iframe>
    </div>
  );
}
