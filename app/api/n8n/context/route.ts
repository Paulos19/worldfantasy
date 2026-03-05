// app/api/n8n/context/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // 1. Segurança Básica (Opcional, mas altamente recomendado)
        // No n8n, você configurará o Header: Authorization -> Bearer SUA_CHAVE_SECRETA
        const authHeader = request.headers.get("authorization");
        const EXPECTED_TOKEN = process.env.N8N_SECRET_TOKEN; // Crie esta variável no .env

        if (EXPECTED_TOKEN && authHeader !== `Bearer ${EXPECTED_TOKEN}`) {
            return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
        }

        if (!userId) {
            return NextResponse.json({ error: "O parâmetro userId é obrigatório." }, { status: 400 });
        }

        // 2. Busca o cérebro no banco de dados
        const agentContext = await prisma.agentContext.findUnique({
            where: { userId },
            select: {
                companyName: true,
                personality: true,
                knowledgeBase: true,
                isActive: true,
            }
        });

        if (!agentContext) {
            return NextResponse.json({ error: "Contexto não encontrado para este usuário." }, { status: 404 });
        }

        if (!agentContext.isActive) {
            return NextResponse.json({ error: "O Agente deste usuário está desativado." }, { status: 403 });
        }

        // 3. Retorna os dados estruturados para o n8n injetar no Prompt do Gemini
        return NextResponse.json({
            success: true,
            data: agentContext,
        });

    } catch (error) {
        console.error("Erro na API do n8n:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}