import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    firstname?: string;
  }

  interface Session {
    user: {
      id?: string;
      firstname?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    firstname?: string;
  }
}
