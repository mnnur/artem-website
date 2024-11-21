import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    type: string;
  }
  interface Admin {
    id: string;
    email: string;
    type: string;
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
      type: string;
    };
    admin: Admin & {
      id: string;
      email: string;
      type: string;
    };
    token: {
      id: string;
      email: string;
      type: string;
    };
  }
}
