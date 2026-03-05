// app/dashboard/knowledge/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation"; // Client Component extraído
import { BrainCircuit } from "lucide-react";
import { KnowledgeForm } from "./knowledge-form";

export default async function KnowledgeBasePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) redirect("/login");

    // Busca as configurações existentes do usuário logado
    const existingContext = await prisma.agentContext.findUnique({
        where: { userId: session.user.id },
    });

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    <BrainCircuit className="text-primary w-8 h-8" />
                    Configuração do Agente IA
                </h1>
                <p className="text-gray-400">
                    Defina a personalidade, regras e a base de conhecimento que o Gemini utilizará no n8n.
                </p>
            </div>

            {/* Isolamos o formulário interativo em um Client Component para usar hooks e Framer Motion */}
            <KnowledgeForm initialData={existingContext} />
        </div>
    );
}