// app/api/webhooks/n8n/chat-sync/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        // Validação de segurança (O n8n deve enviar este token no Header)
        const authHeader = request.headers.get("authorization");
        const EXPECTED_TOKEN = process.env.N8N_SECRET_TOKEN;

        if (EXPECTED_TOKEN && authHeader !== `Bearer ${EXPECTED_TOKEN}`) {
            return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
        }

        const body = await request.json();
        const { userId, customerRef, userMessage, botResponse } = body;

        // Validação estrita
        if (!userId || !customerRef || !userMessage || !botResponse) {
            return NextResponse.json({ error: "Payload incompleto." }, { status: 400 });
        }

        // Registra o log no banco atrelado ao usuário (SaaS pattern)
        const chatLog = await prisma.chatLog.create({
            data: {
                userId,
                customerRef,
                userMessage,
                botResponse,
            }
        });

        return NextResponse.json({ success: true, logId: chatLog.id }, { status: 201 });

    } catch (error) {
        console.error("Erro ao sincronizar log do chat:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}