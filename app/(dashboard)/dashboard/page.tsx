// app/(dashboard)/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const userId = session.user.id;

    // Busca todas as métricas em paralelo para performance máxima
    const [
        totalProducts,
        activeProducts,
        totalMessages,
        todayMessages,
        uniqueConversations,
        agentContext,
        recentChatLogs,
        topProducts,
    ] = await Promise.all([
        // Total de produtos
        prisma.product.count({ where: { userId } }),

        // Produtos ativos
        prisma.product.count({ where: { userId, isActive: true } }),

        // Total de mensagens trocadas (cada ChatLog = 1 par de mensagem)
        prisma.chatLog.count({ where: { userId } }),

        // Mensagens de hoje
        prisma.chatLog.count({
            where: {
                userId,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        }),

        // Conversas únicas (customerRef distintos)
        prisma.chatLog.findMany({
            where: { userId },
            distinct: ["customerRef"],
            select: { customerRef: true },
        }),

        // Status do Agente (contexto IA)
        prisma.agentContext.findUnique({
            where: { userId },
            select: { isActive: true, companyName: true },
        }),

        // Últimas 5 conversas (mais recentes por customerRef)
        prisma.chatLog.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            distinct: ["customerRef"],
            take: 5,
            select: {
                customerRef: true,
                userMessage: true,
                createdAt: true,
            },
        }),

        // Top 5 produtos (mais recentes)
        prisma.product.findMany({
            where: { userId, isActive: true },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { name: true, price: true },
        }),
    ]);

    const data = {
        totalProducts,
        activeProducts,
        totalConversations: uniqueConversations.length,
        totalMessages,
        todayMessages,
        agentActive: agentContext?.isActive ?? false,
        companyName: agentContext?.companyName ?? "Não configurado",
        recentChats: recentChatLogs.map((log) => ({
            customerRef: log.customerRef,
            lastMessage: log.userMessage,
            createdAt: log.createdAt.toISOString(),
        })),
        topProducts,
    };

    return <DashboardClient data={data} />;
}