import {
  CompanyAccount,
  Project,
  Role as PrismaRole,
  RoleCategory,
  User,
} from "@prisma/client";


export type CompanyWithRoles = CompanyAccount & { roles: Role[] } & {
  projects: Project[];
};
export type CompanyWithUsers = CompanyAccount & { users: User[] };

export type Role = PrismaRole & { category: RoleCategory };

export type Company = CompanyAccount & { roles: Role[] } & {
  projects: Project[];
};