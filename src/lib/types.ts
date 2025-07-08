import { CompanyAccount, Project, Role, User } from "@prisma/client";

export type CompanyWithRoles = CompanyAccount & { roles: Role[] } & { projects: Project[]};
export type CompanyWithUsers = CompanyAccount & { users: User[] };
