"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateInstance(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Não autorizado." };

    const whatsappInstance = formData.get("whatsappInstance") as string;

    try {
        await prisma.agentContext.update({
            where: { userId: session.user.id },
            data: { whatsappInstance },
        });

        revalidatePath("/dashboard/settings");
        return { success: "Instância vinculada com sucesso!" };
    } catch (error) {
        return { error: "Erro ao atualizar instância." };
    }
}

export async function updatePhone(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Não autorizado." };

    const phone = formData.get("phone") as string;

    if (!phone) return { error: "Informe o número de telefone." };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { phone },
        });

        revalidatePath("/dashboard/settings");
        return { success: "Telefone atualizado com sucesso!" };
    } catch (error) {
        return { error: "Erro ao atualizar telefone." };
    }
}