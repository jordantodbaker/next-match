import React from "react";
import Headcount from "./Headcount";
import { getCompany } from "../actions/companyActions";
import { getHeadcount } from "../actions/headcountActions";

export default async function NarrativePage() {
  const company = await getCompany();
  const headcount = await getHeadcount();

  const baseUrl = process.env.BASE_URL;

  console.log("Headcount: ", headcount);
  return (
    <div className="flex h-full w-full">
      <Headcount
        company={company}
        headcount={headcount[0]}
        baseUrl={baseUrl || ""}
      />
    </div>
  );
}
