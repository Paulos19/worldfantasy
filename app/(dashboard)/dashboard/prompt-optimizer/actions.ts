"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function optimizePromptAction(formData: FormData) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { error: "Usuário não autenticado." };
    }

    const currentPrompt = formData.get("currentPrompt") as string;
    const clientRequest = formData.get("clientRequest") as string;

    if (!currentPrompt || !clientRequest) {
        return { error: "Preencha o prompt atual e a solicitação." };
    }

    try {
        // 1. Chama o webhook do n8n para processar a otimização
        const n8nWebhookUrl = process.env.N8N_PROMPT_OPTIMIZER_WEBHOOK || "https://seun8n.com/webhook/prompt-optimizer";

        const response = await fetch(n8nWebhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.N8N_SECRET_TOKEN || ""}`
            },
            body: JSON.stringify({
                source: "dashboard",
                userId: session.user.id,
                currentPrompt,
                clientRequest
            }),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Erro no n8n: ${response.status}`);
        }

        const data = await response.json();

        if (!data.evaluation || !data.optimizedPrompt) {
            return { error: "A IA retornou um formato inesperado." };
        }

        // 2. Salva o resultado no banco de dados
        const optimization = await prisma.promptOptimization.create({
            data: {
                userId: session.user.id,
                originalPrompt: currentPrompt,
                clientRequest,
                evaluation: data.evaluation,
                optimizedPrompt: data.optimizedPrompt,
            },
        });

        // 3. Busca o telefone do admin para enviar via WhatsApp
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { phone: true, name: true },
        });

        let whatsappSent = false;

        if (user?.phone) {
            try {
                // Dispara o webhook de envio via WhatsApp
                const whatsappWebhookUrl = process.env.N8N_WHATSAPP_SEND_WEBHOOK || "https://seun8n.com/webhook/send-whatsapp";

                const message = formatWhatsAppMessage(
                    user.name || "Admin",
                    data.evaluation,
                    data.optimizedPrompt
                );

                await fetch(whatsappWebhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.N8N_SECRET_TOKEN || ""}`
                    },
                    body: JSON.stringify({
                        source: "prompt-optimizer",
                        phone: user.phone,
                        message,
                        optimizationId: optimization.id,
                    }),
                    cache: "no-store",
                });

                // Marca como enviado via WhatsApp
                await prisma.promptOptimization.update({
                    where: { id: optimization.id },
                    data: { sentViaWhatsApp: true },
                });

                whatsappSent = true;
            } catch (whatsappError) {
                console.error("Erro ao enviar para WhatsApp:", whatsappError);
                // Não falha a operação inteira se o WhatsApp der erro
            }
        }

        return {
            success: true,
            evaluation: data.evaluation,
            optimizedPrompt: data.optimizedPrompt,
            savedToDb: true,
            whatsappSent,
            whatsappPhone: user?.phone || null,
        };

    } catch (error) {
        console.error("Erro na otimização:", error);
        return { error: "Tempo limite excedido ou falha no motor de IA. Tente novamente." };
    }
}

/**
 * Formata a mensagem para envio via WhatsApp de forma limpa e legível
 */
function formatWhatsAppMessage(adminName: string, evaluation: string, optimizedPrompt: string): string {
    return `🧪 *Laboratório World Fantasy — Otimização Concluída*

Olá, *${adminName}*! Seu prompt foi analisado e otimizado com sucesso.

━━━━━━━━━━━━━━━━━━━

📋 *RELATÓRIO DE AVALIAÇÃO:*
${evaluation}

━━━━━━━━━━━━━━━━━━━

✨ *PROMPT OTIMIZADO:*
\`\`\`
${optimizedPrompt}
\`\`\`

━━━━━━━━━━━━━━━━━━━
_Gerado automaticamente pelo Otimizador de Prompts — World Fantasy_`;
}

/**
 * Envia manualmente uma otimização via WhatsApp
 */
export async function sendWhatsAppAction(optimizationId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Não autorizado." };

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { phone: true, name: true },
    });

    if (!user?.phone) {
        return { error: "Configure seu telefone em Configurações antes de enviar." };
    }

    const optimization = await prisma.promptOptimization.findFirst({
        where: { id: optimizationId, userId: session.user.id },
    });

    if (!optimization) return { error: "Otimização não encontrada." };

    try {
        const whatsappWebhookUrl = process.env.N8N_WHATSAPP_SEND_WEBHOOK || "https://seun8n.com/webhook/send-whatsapp";

        const message = formatWhatsAppMessage(
            user.name || "Admin",
            optimization.evaluation,
            optimization.optimizedPrompt
        );

        await fetch(whatsappWebhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.N8N_SECRET_TOKEN || ""}`
            },
            body: JSON.stringify({
                source: "prompt-optimizer",
                phone: user.phone,
                message,
                optimizationId: optimization.id,
            }),
            cache: "no-store",
        });

        await prisma.promptOptimization.update({
            where: { id: optimizationId },
            data: { sentViaWhatsApp: true },
        });

        return { success: "Mensagem enviada via WhatsApp!" };
    } catch (error) {
        console.error("Erro ao enviar WhatsApp:", error);
        return { error: "Falha ao enviar via WhatsApp." };
    }
}

/**
 * Busca o histórico de otimizações do usuário logado
 */
export async function getOptimizationHistory() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    try {
        const history = await prisma.promptOptimization.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 20, // Trazemos as 20 mais recentes para não pesar
        });

        // Retornamos os dados limpos e serializáveis
        return history.map(item => ({
            id: item.id,
            originalPrompt: item.originalPrompt,
            clientRequest: item.clientRequest,
            evaluation: item.evaluation,
            optimizedPrompt: item.optimizedPrompt,
            sentViaWhatsApp: item.sentViaWhatsApp,
            createdAt: item.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return [];
    }
}