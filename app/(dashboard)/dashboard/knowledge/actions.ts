// app/dashboard/knowledge/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveAgentContext(formData: FormData) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { error: "Não autorizado. Sessão inválida." };
    }

    const companyName = formData.get("companyName") as string;
    const personality = formData.get("personality") as string;
    const knowledgeBase = formData.get("knowledgeBase") as string;

    if (!companyName || !personality || !knowledgeBase) {
        return { error: "Todos os campos são obrigatórios." };
    }

    try {
        // Upsert: Atualiza se já existir para este usuário, ou cria um novo
        await prisma.agentContext.upsert({
            where: { userId: session.user.id },
            update: {
                companyName,
                personality,
                knowledgeBase,
            },
            create: {
                userId: session.user.id,
                companyName,
                personality,
                knowledgeBase,
            },
        });

        revalidatePath("/dashboard/knowledge");
        return { success: "Cérebro do Agente atualizado com sucesso!" };

    } catch (error) {
        console.error("Erro ao salvar contexto do agente:", error);
        return { error: "Falha interna ao salvar as configurações." };
    }
}