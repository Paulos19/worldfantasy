// app/dashboard/chats/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChatScrollWrapper } from "./chat-scroll-wrapper";


interface ChatDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ChatDetailPage({ params }: ChatDetailPageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const { id } = await params;
    const customerRef = decodeURIComponent(id);

    // Busca todas as mensagens desta conversa, em ordem cronológica
    const messages = await prisma.chatLog.findMany({
        where: {
            userId: session.user.id,
            customerRef,
        },
        orderBy: { createdAt: "asc" },
    });

    if (messages.length === 0) redirect("/dashboard/chats");

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl w-full mx-auto">
            {/* Header estilo WhatsApp */}
            <div className="glass rounded-t-2xl border border-white/5 border-b-0 px-5 py-4 flex items-center gap-4">
                <Link
                    href="/dashboard/chats"
                    className="p-2 -ml-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-purple-600/40 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">
                        {customerRef.slice(-2)}
                    </span>
                </div>

                <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{customerRef}</p>
                    <p className="text-xs text-gray-500">{messages.length} mensagen{messages.length > 1 ? "s" : ""}</p>
                </div>
            </div>

            {/* Área de mensagens com scroll */}
            <ChatScrollWrapper>
                <div className="flex-1 overflow-y-auto p-5 space-y-4 glass border-x border-white/5 bg-black/20" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.03) 0%, transparent 70%)" }}>
                    {/* Indicador de início da conversa */}
                    <div className="flex justify-center mb-6">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 text-[11px] text-gray-500 font-medium">
                            Início da conversa — {format(messages[0].createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className="space-y-3">
                            {/* Bolha do Cliente (esquerda) */}
                            <div className="flex items-end gap-2 max-w-[80%]">
                                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                    <User className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                                <div className="bg-white/[0.06] border border-white/5 rounded-2xl rounded-bl-md px-4 py-2.5 space-y-1">
                                    <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                                        {msg.userMessage}
                                    </p>
                                    <p className="text-[10px] text-gray-600 text-right">
                                        {format(msg.createdAt, "HH:mm", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>

                            {/* Bolha da IA (direita) */}
                            <div className="flex items-end gap-2 max-w-[80%] ml-auto flex-row-reverse">
                                <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                                </div>
                                <div className="bg-emerald-500/[0.08] border border-emerald-500/10 rounded-2xl rounded-br-md px-4 py-2.5 space-y-1">
                                    <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                                        {msg.botResponse}
                                    </p>
                                    <p className="text-[10px] text-emerald-600/60 text-right">
                                        {format(msg.createdAt, "HH:mm", { locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ChatScrollWrapper>

            {/* Footer indicando que é supervisão */}
            <div className="glass rounded-b-2xl border border-white/5 border-t-0 px-5 py-3 flex items-center justify-center">
                <p className="text-xs text-gray-600 font-medium">
                    🔒 Modo supervisão — esta conversa é gerenciada pelo Agente IA
                </p>
            </div>
        </div>
    );
}
