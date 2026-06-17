import React from "react";
import Headcount from "./Headcount";
import { getCompany } from "../actions/companyActions";
import { getHeadcount } from "../actions/headcountActions";

export default async function NarrativePage() {
  const [company, headcount] = await Promise.all([
    getCompany(),
    getHeadcount(),
  ]);

  return (
    <div className="flex h-full w-full">
      <Headcount company={company} headcount={headcount[0]} />
    </div>
  );
}
