import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        // if (user) {
        //   const account = await prisma.companyAccount.findUnique({
        //     where: { id: user.companyId } as any,
        //   });
        // }

        session.user = user as any;
        //console.log("user: ", user);
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
