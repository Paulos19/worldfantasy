// app/(dashboard)/dashboard/dashboard-client.tsx
"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
    Package,
    MessageSquare,
    Users,
    BrainCircuit,
    TrendingUp,
    ArrowRight,
    Sparkles,
    Activity,
    ShoppingBag,
    Clock,
} from "lucide-react";

type DashboardData = {
    totalProducts: number;
    activeProducts: number;
    totalConversations: number;
    totalMessages: number;
    todayMessages: number;
    agentActive: boolean;
    companyName: string;
    recentChats: { customerRef: string; lastMessage: string; createdAt: string }[];
    topProducts: { name: string; price: number }[];
};

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

function formatPhone(ref: string) {
    // Remove @s.whatsapp.net e formata
    const clean = ref.replace("@s.whatsapp.net", "");
    if (clean.length >= 12) {
        return `+${clean.slice(0, 2)} (${clean.slice(2, 4)}) ${clean.slice(4, 9)}-${clean.slice(9)}`;
    }
    return clean;
}

export function DashboardClient({ data }: { data: DashboardData }) {
    const stats = [
        {
            title: "Produtos no Catálogo",
            value: data.totalProducts.toString(),
            subtitle: `${data.activeProducts} ativos`,
            icon: Package,
            color: "text-blue-400",
            bg: "from-blue-500/20 to-blue-600/5",
            border: "border-blue-500/20",
            href: "/dashboard/catalog",
        },
        {
            title: "Atendimentos",
            value: data.totalConversations.toString(),
            subtitle: "conversas únicas",
            icon: Users,
            color: "text-purple-400",
            bg: "from-purple-500/20 to-purple-600/5",
            border: "border-purple-500/20",
            href: "/dashboard/chats",
        },
        {
            title: "Mensagens Trocadas",
            value: data.totalMessages.toString(),
            subtitle: `${data.todayMessages} hoje`,
            icon: MessageSquare,
            color: "text-emerald-400",
            bg: "from-emerald-500/20 to-emerald-600/5",
            border: "border-emerald-500/20",
            href: "/dashboard/agent-logs",
        },
        {
            title: "Status do Agente",
            value: data.agentActive ? "Online" : "Offline",
            subtitle: data.companyName,
            icon: BrainCircuit,
            color: data.agentActive ? "text-green-400" : "text-red-400",
            bg: data.agentActive ? "from-green-500/20 to-green-600/5" : "from-red-500/20 to-red-600/5",
            border: data.agentActive ? "border-green-500/20" : "border-red-500/20",
            href: "/dashboard/settings",
        },
    ];

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            {/* Header */}
            <motion.div variants={itemVariant} className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">Visão Geral</h1>
                        <p className="text-gray-400 text-sm">Monitore a performance do seu Agente IA em tempo real.</p>
                    </div>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={i} variants={itemVariant}>
                            <Link href={stat.href} className="block">
                                <div className={`glass p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300 cursor-pointer`}>
                                    {/* Gradient glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="space-y-3">
                                            <span className="text-sm font-medium text-gray-400">{stat.title}</span>
                                            <p className="text-4xl font-bold text-white tracking-tight">{stat.value}</p>
                                            <span className="text-xs text-gray-500">{stat.subtitle}</span>
                                        </div>
                                        <div className={`p-3 rounded-xl bg-black/30 border ${stat.border} ${stat.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>

                                    {/* Hover arrow */}
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Bottom Section: Recent Chats + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Conversations */}
                <motion.div variants={itemVariant} className="glass rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <Activity className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Conversas Recentes</h2>
                                <p className="text-xs text-gray-500">Últimos atendimentos do agente</p>
                            </div>
                        </div>
                        <Link href="/dashboard/chats" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1">
                            Ver todos <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="divide-y divide-white/5">
                        {data.recentChats.length === 0 ? (
                            <div className="p-8 text-center">
                                <MessageSquare className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">Nenhuma conversa ainda</p>
                            </div>
                        ) : (
                            data.recentChats.map((chat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    className="px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 border border-white/10 flex items-center justify-center shrink-0">
                                            <Users className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{formatPhone(chat.customerRef)}</p>
                                            <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-600 shrink-0">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-xs">
                                                {new Date(chat.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Top Products */}
                <motion.div variants={itemVariant} className="glass rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <ShoppingBag className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Produtos Recentes</h2>
                                <p className="text-xs text-gray-500">Últimos adicionados ao catálogo</p>
                            </div>
                        </div>
                        <Link href="/dashboard/catalog" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1">
                            Ver todos <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="divide-y divide-white/5">
                        {data.topProducts.length === 0 ? (
                            <div className="p-8 text-center">
                                <Package className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">Nenhum produto cadastrado</p>
                            </div>
                        ) : (
                            data.topProducts.map((product, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    className="px-6 py-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-primary/20 border border-white/10 flex items-center justify-center text-xs font-bold text-blue-400">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-medium text-white truncate">{product.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400 shrink-0">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions Bar */}
            <motion.div variants={itemVariant} className="glass rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-white">Acesso Rápido</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: "Novo Produto", href: "/dashboard/catalog", icon: Package, color: "from-blue-500/10 to-blue-600/5 hover:from-blue-500/20" },
                        { label: "Ver Conversas", href: "/dashboard/chats", icon: MessageSquare, color: "from-purple-500/10 to-purple-600/5 hover:from-purple-500/20" },
                        { label: "Logs do Agente", href: "/dashboard/agent-logs", icon: BrainCircuit, color: "from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/20" },
                        { label: "Configurações", href: "/dashboard/settings", icon: Activity, color: "from-amber-500/10 to-amber-600/5 hover:from-amber-500/20" },
                    ].map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.label} href={action.href}>
                                <div className={`bg-gradient-to-br ${action.color} border border-white/5 rounded-xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-white/15 hover:shadow-lg group`}>
                                    <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors shrink-0" />
                                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}
