// app/api/n8n/catalog/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const instance = searchParams.get("instance");
        const query = searchParams.get("query")?.trim() || "";

        if (!instance) {
            return NextResponse.json({ error: "Instância não informada." }, { status: 400 });
        }

        const context = await prisma.agentContext.findUnique({
            where: { whatsappInstance: instance },
            select: { userId: true }
        });

        if (!context) return NextResponse.json({ error: "Instância não encontrada." }, { status: 404 });

        // 1. Tenta a busca exata (Termo pesquisado)
        let products = await prisma.product.findMany({
            where: {
                userId: context.userId,
                isActive: true,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } }
                ]
            },
            select: { name: true, description: true, price: true, imageUrl: true },
            take: 5
        });

        // 2. O Pulo do Gato (Fallback Inteligente)
        // Se não achou NADA com o termo pesquisado, busca os últimos 5 produtos do estoque
        if (products.length === 0 && query !== "") {
            const fallbackProducts = await prisma.product.findMany({
                where: { userId: context.userId, isActive: true },
                orderBy: { createdAt: "desc" },
                select: { name: true, description: true, price: true, imageUrl: true },
                take: 5
            });

            return NextResponse.json({
                success: true,
                results: fallbackProducts,
                // Mandamos uma mensagem secreta para a IA ler junto com os resultados
                system_instruction: `Nenhum produto exato encontrado para '${query}'. O sistema retornou o estoque geral. Analise se algum destes produtos pertence à mesma franquia solicitada (Ex: Darth Vader pertence a Star Wars) e ofereça ao cliente.`
            });
        }

        return NextResponse.json({
            success: true,
            results: products,
            system_instruction: "Produtos encontrados com sucesso. Apresente-os ao cliente com entusiasmo e as URLs das imagens."
        });

    } catch (error) {
        console.error("Erro na API de Catálogo:", error);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}