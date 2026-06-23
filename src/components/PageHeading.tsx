import React, { ReactNode } from "react";

/** Standard page header: a brand-colored title with an optional action slot. */
export default function PageHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-divider pb-4">
      <h1 className="text-3xl font-semibold text-primary">{title}</h1>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
