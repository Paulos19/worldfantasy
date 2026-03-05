// app/dashboard/chats/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, Search, MessageSquareQuote } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function ChatsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) redirect("/login");

    // Busca os últimos 50 atendimentos do agente deste usuário
    const chatLogs = await prisma.chatLog.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

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

                {/* Mock visual de um input de busca com design premium */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por telefone..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                {chatLogs.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                            <MessageSquareQuote className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400 font-medium text-lg">Nenhum atendimento registrado ainda.</p>
                        <p className="text-sm text-gray-500">Quando o n8n processar conversas, elas aparecerão aqui.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {chatLogs.map((log) => (
                            <div key={log.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
                                        Cliente: {log.customerRef}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {format(log.createdAt, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mensagem do Cliente</span>
                                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-gray-300 text-sm leading-relaxed">
                                            {log.userMessage}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider">Resposta da IA (Gemini)</span>
                                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-gray-200 text-sm leading-relaxed">
                                            {log.botResponse}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}