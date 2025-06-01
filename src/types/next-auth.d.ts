import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id?: string | null;
      role?: string | null; // Add your custom property
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string | null; // Add your custom property
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role?: string | null; // Add your custom property
    id?: string | null;
  }
}
