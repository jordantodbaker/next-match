import { CompanyAccount, Role, User } from "@prisma/client";

export type CompanyWithRoles = CompanyAccount & { roles: Role[] };
export type CompanyWithUsers = CompanyAccount & { users: User[] };
