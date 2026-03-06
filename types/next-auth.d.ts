// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// 1. Estendemos o módulo principal do next-auth
declare module "next-auth" {
    /**
     * Retornado pelo `useSession`, `getSession` e recebido como prop no `<SessionProvider>`
     */
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "USER";
            phone?: string | null;
        } & DefaultSession["user"];
    }

    /**
     * O formato do usuário retornado pelo provider de Credentials ou adapters do Prisma
     */
    interface User extends DefaultUser {
        id: string;
        role: "ADMIN" | "USER";
        phone?: string | null;
    }
}

// 2. Estendemos o módulo do JWT para garantir que o token carregue a role e o id
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        role: "ADMIN" | "USER";
        phone?: string | null;
    }
}