import { CompanyAccount, Project, Role, User, WorkforcePlan } from "@prisma/client";

export type Company = CompanyAccount & { roles: Role[] } & { projects: Project[]} & {workforcePlans: WorkforcePlan[]};
export type CompanyWithRoles = CompanyAccount & { roles: Role[] } & { projects: Project[]};
export type CompanyWithUsers = CompanyAccount & { users: User[] };
