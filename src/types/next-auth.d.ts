import type { DefaultSession } from "next-auth";
import type { Position, Role } from "./domain";

declare module "next-auth" {
  interface User {
    role?: Role;
    position?: Position | null;
    organizationId?: string | null;
    organizationName?: string | null;
    mustChangePassword?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      position: Position | null;
      organizationId: string | null;
      organizationName: string | null;
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    position?: Position | null;
    organizationId?: string | null;
    organizationName?: string | null;
    mustChangePassword?: boolean;
  }
}
