import React from "react";
import ReportView from "./ReportView";
import { getCompany } from "@/app/actions/companyActions";

// Resolve the current user's company here, on every request, so the report
// always reflects who is actually signed in (not stale layout/context state).
export default async function ReportPage() {
  const company = await getCompany();

  return (
    <ReportView
      powerBiUrl={company?.powerBiUrl ?? null}
      companyName={company?.name ?? ""}
    />
  );
}
