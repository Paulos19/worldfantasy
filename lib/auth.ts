// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciais inválidas");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("Usuário não encontrado");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Senha incorreta");
                }

                // Retorna apenas dados seguros para o JWT
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dias
    },
    callbacks: {
        async jwt({ token, user }) {
            // Quando o usuário faz login, injetamos os dados no token
            if (user) {
                token.id = user.id;
                // Fazemos o cast explícito para a união de tipos esperada
                token.role = user.role as "ADMIN" | "USER";
            }
            return token;
        },
        async session({ session, token }) {
            // Transferimos os dados do token JWT para a sessão no client
            if (session.user) {
                session.user.id = token.id as string;
                // Garantimos ao TypeScript que o valor é exatamente o que a interface pede
                session.user.role = token.role as "ADMIN" | "USER";
            }
            return session;
        }
    }
}