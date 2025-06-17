import { Project } from "@prisma/client";
import { createContext } from "react";

export const ProjectContext = createContext<Project>({name: "", id: 0, code: ""});