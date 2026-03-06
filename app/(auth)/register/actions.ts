// app/(auth)/register/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerAdmin(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;

    if (!email || !password || !name || !phone) {
        return { error: "Todos os campos são obrigatórios." };
    }

    // Regra de negócio: Na World Fantasy, queremos garantir que a senha seja forte
    if (password.length < 8) {
        return { error: "A senha deve ter pelo menos 8 caracteres." };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Este e-mail já está em uso." };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                role: "ADMIN",
            },
        });

    } catch (error) {
        console.error("Erro ao registrar:", error);
        return { error: "Erro interno ao processar o registro." };
    }

    // Redireciona para o login após sucesso
    redirect("/login");
}