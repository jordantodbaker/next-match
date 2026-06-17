import { CompanyAccount } from "@prisma/client";
import { createContext } from "react";

export const CompanyContext = createContext<CompanyAccount>({name: "", id: 0, companyCode: "", powerBiUrl: null});