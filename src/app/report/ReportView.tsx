import React from "react";

/**
 * Presentational report view. Receives the report URL as a prop from the
 * `/report` server page (which resolves the *current* user's company on every
 * request) rather than reading it from the layout-seeded CompanyContext —
 * that context can go stale across logout/login because Next preserves the
 * shared root layout across client navigations.
 */
export default function ReportView({
  powerBiUrl,
  companyName,
}: {
  powerBiUrl: string | null;
  companyName: string;
}) {
  if (!powerBiUrl) {
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
        title={`${companyName} Power BI Report`}
        className="w-[95vw] h-[90vh]"
        src={powerBiUrl}
        allowFullScreen={true}
      ></iframe>
    </div>
  );
}
