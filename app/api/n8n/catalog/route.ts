import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const instance = searchParams.get("instance");
        const query = searchParams.get("query") || "";

        if (!instance) {
            return NextResponse.json({ error: "Instância não informada." }, { status: 400 });
        }

        // 1. Descobrir quem é o usuário dono dessa instância
        const context = await prisma.agentContext.findUnique({
            where: { whatsappInstance: instance },
            select: { userId: true }
        });

        if (!context) return NextResponse.json({ error: "Instância não encontrada." }, { status: 404 });

        // 2. Buscar produtos no estoque deste lojista que batam com a pesquisa do Gemini
        const products = await prisma.product.findMany({
            where: {
                userId: context.userId,
                isActive: true,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } }
                ]
            },
            select: {
                name: true,
                description: true,
                price: true,
                imageUrl: true, // A IA pode devolver esse link na resposta para o cliente ver a foto!
            },
            take: 5 // Limita para não estourar os tokens do prompt do Gemini
        });

        return NextResponse.json({
            success: true,
            results: products,
            message: products.length > 0 ? "Produtos encontrados no estoque." : "Nenhum produto encontrado com este termo."
        });

    } catch (error) {
        console.error("Erro na API de Catálogo:", error);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}