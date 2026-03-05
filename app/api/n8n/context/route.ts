import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const instance = searchParams.get("instance"); // Agora buscamos pela instância

        const authHeader = request.headers.get("authorization");
        const EXPECTED_TOKEN = process.env.N8N_SECRET_TOKEN;

        if (EXPECTED_TOKEN && authHeader !== `Bearer ${EXPECTED_TOKEN}`) {
            return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
        }

        if (!instance) {
            return NextResponse.json({ error: "O parâmetro instance é obrigatório." }, { status: 400 });
        }

        // Busca o contexto do agente vinculado a esta instância do WhatsApp
        const agentContext = await prisma.agentContext.findUnique({
            where: { whatsappInstance: instance },
            select: {
                companyName: true,
                personality: true,
                knowledgeBase: true,
                isActive: true,
                userId: true, // Retornamos o userId para o n8n usar na hora de salvar o log
            }
        });

        if (!agentContext) {
            return NextResponse.json({ error: "Instância não configurada no sistema." }, { status: 404 });
        }

        if (!agentContext.isActive) {
            return NextResponse.json({ error: "Agente desativado." }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            data: agentContext,
        });

    } catch (error) {
        console.error("Erro na API do n8n:", error);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}