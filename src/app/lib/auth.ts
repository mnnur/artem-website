import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import { compare } from "bcrypt";
import { getAdminByID, getUserByID } from "../features/user";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "wahyu@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email/Password must be filled");
        }
        console.log("INI AUTH.ts");

        const existingAdmin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });
        const existingUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("INI EXISTING:", existingUser);

        if (!existingUser && !existingAdmin) {
          throw new Error("Email is not registered!");
        }

        if (existingUser) {
          const passwordMatch = await compare(credentials.password, existingUser.password);
          if (!passwordMatch) {
            throw new Error("Password is incorrect");
          }
          return {
            id: existingUser.id,
            email: existingUser.email,
            type: "user",
          };
        }
        if (existingAdmin) {
          const passwordMatch = await compare(credentials.password, existingAdmin.password);
          if (!passwordMatch) {
            throw new Error("Password is incorrect");
          }

          return {
            id: existingAdmin.id,
            email: existingAdmin.email,
            type: "admin",
          };
        }

        throw new Error("Email/Password is incorrect");
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserByID(user.id);

      const existingAdmin = await getAdminByID(user.id);

      //prevent sign in withut email verification
      if (!existingUser && !existingAdmin) return false;

      if (existingUser && !existingAdmin) {
        if (!existingUser?.emailVerified && !existingUser?.emailVerifiedAt) return false;
      } else if (existingAdmin && !existingUser) {
        if (!existingAdmin?.emailVerified && !existingAdmin?.emailVerifiedAt) return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          type: user.type,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.type === "user") {
        const user = await prisma.user.findUnique({
          where: {
            id: token.id as string,
          },
        });

        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            email: token.email,
            type: token.type,
          },
        };
      }

      if (token?.type === "admin") {
        const admin = await prisma.admin.findUnique({
          where: {
            id: token.id as string,
          },
        });

        return {
          ...session,
          admin: {
            ...session.admin,
            id: token.id,
            email: token.email,
            type: token.type,
          },
        };
      }

      return session;
    },
  },
};
