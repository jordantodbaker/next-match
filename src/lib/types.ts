import {
  CompanyAccount,
  Headcount,
  Project,
  Role as PrismaRole,
  RoleCategory,
  User,
  WorkforcePlan,
} from "@prisma/client";


export type CompanyWithRoles = CompanyAccount & { roles: Role[] } & {
  projects: Project[];
};
export type CompanyWithUsers = CompanyAccount & { users: User[] };

export type Role = PrismaRole & { category: RoleCategory };

export type Company = CompanyAccount & { roles: Role[] } & {
  projects: Project[];
} & { workforcePlans?: WorkforcePlan[] } & { headcounts?: Headcount[] };