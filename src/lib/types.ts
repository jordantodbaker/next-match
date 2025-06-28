import { CompanyAccount, Role } from "@prisma/client";

export type CompanyWithRoles = CompanyAccount & { roles: Role[] };
