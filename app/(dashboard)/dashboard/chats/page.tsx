// app/dashboard/chats/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, Search, MessageSquareQuote, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export default async function ChatsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) redirect("/login");

    // Busca todos os atendimentos do agente deste usuário
    const chatLogs = await prisma.chatLog.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    // Agrupa por customerRef para criar "conversas"
    const conversationsMap = new Map<string, typeof chatLogs>();

    for (const log of chatLogs) {
        const existing = conversationsMap.get(log.customerRef) || [];
        existing.push(log);
        conversationsMap.set(log.customerRef, existing);
    }

    // Converte para array e ordena pela última mensagem de cada conversa
    const conversations = Array.from(conversationsMap.entries()).map(([customerRef, logs]) => ({
        customerRef,
        lastMessage: logs[0], // Já vem ordenado desc, então o primeiro é o mais recente
        messageCount: logs.length,
    }));

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        <Users className="text-primary w-8 h-8" />
                        Supervisão de Atendimentos
                    </h1>
                    <p className="text-gray-400">
                        Acompanhe em tempo real as interações do seu Agente IA com os clientes.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por telefone..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                    />
                </div>
            </div>

            {conversations.length === 0 ? (
                <div className="glass rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                        <MessageSquareQuote className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 font-medium text-lg">Nenhum atendimento registrado ainda.</p>
                    <p className="text-sm text-gray-500">Quando o n8n processar conversas, elas aparecerão aqui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {conversations.map((conv) => (
                        <Link
                            key={conv.customerRef}
                            href={`/dashboard/chats/${encodeURIComponent(conv.customerRef)}`}
                            className="glass rounded-2xl border border-white/5 p-5 hover:border-primary/30 hover:bg-white/[0.02] transition-all group cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-3">
                                {/* Avatar + Info */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-purple-600/30 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-sm">
                                            {conv.customerRef.slice(-2)}
                                        </span>
                                    </div>
                                    <div className="min-w-0 space-y-1">
                                        <p className="text-white font-semibold text-sm truncate">
                                            {conv.customerRef}
                                        </p>
                                        <p className="text-gray-500 text-xs truncate max-w-[200px]">
                                            {conv.lastMessage.userMessage}
                                        </p>
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className="text-[11px] text-gray-600 font-medium whitespace-nowrap">
                                        {format(conv.lastMessage.createdAt, "dd/MM HH:mm", { locale: ptBR })}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                                        {conv.messageCount} msg{conv.messageCount > 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>

                            {/* Preview da última resposta da IA */}
                            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                                <p className="text-xs text-gray-400 truncate max-w-[85%]">
                                    <span className="text-emerald-500/70 font-medium">IA:</span>{" "}
                                    {conv.lastMessage.botResponse}
                                </p>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}