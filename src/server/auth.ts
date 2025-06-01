import NextAuth, { type NextAuthOptions } from "next-auth"; // Removed Provider type from here
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db as prisma } from "./db"; // Corrected import path and aliased db as prisma

// Derive the Provider type from NextAuthOptions if direct import is problematic
type Provider = NextAuthOptions['providers'][number];

const providers: Provider[] = [ // Explicitly typed the array
  AzureADProvider({
    clientId: process.env.AZURE_CLIENT_ID!,
    clientSecret: process.env.AZURE_CLIENT_SECRET!,
    tenantId: process.env.AZURE_TENANT_ID!,
  }),
  // add LDAP/SAML later if needed
];

if (process.env.NODE_ENV === "development") {
  providers.push(
    CredentialsProvider({
      name: "Local Development",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "dev" },
        // Password field is not strictly needed for this bypass but good for UI consistency
        // password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In a real scenario, you might validate credentials here
        // For "noauth" dev, we'll return a mock user
        // Ensure this mock user has an 'id' and any fields your Prisma User model expects
        // or that your session callback/application logic relies on (e.g., 'role').
        const mockUser = {
          id: "cl_dev_user", // A unique ID for the dev user
          email: "dev@local.com",
          name: "Dev User",
          role: "admin", // Or any default role you want for local dev
          emailVerified: new Date(), // Add this if your schema requires it
          // Add other fields that might be expected by PrismaAdapter or your app
        };
        // PrismaAdapter will try to create or link this user.
        // Ensure your User model in schema.prisma can accommodate this.
        // Specifically, the 'role' field should exist on your User model.
        return mockUser;
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  secret: process.env.NEXTAUTH_SECRET, // Add this line
  callbacks: {
    session({ session, user }) {
      // The 'user' object here comes from the JWT, which is populated from
      // the 'profile' callback (for OAuth) or the 'authorize' callback (for Credentials).
      // PrismaAdapter also fetches user data.
      // Ensure 'user.role' is available (type augmentation will handle this).
      if (session.user && user.role) {
        // @ts-ignore // Temporary ignore if role is not yet on user type from adapter/jwt
        session.user.role = user.role;
      }
      return session;
    },
  },
  // If using CredentialsProvider, you might want to use JWT strategy for sessions
  session: {
    strategy: "jwt", // Explicitly set session strategy to JWT
  },
};

export default NextAuth(authOptions);