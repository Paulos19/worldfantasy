// app/dashboard/page.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { BrainCircuit, Database, MessageSquare, Zap } from "lucide-react";

const stats = [
    { title: "Vetores Armazenados", value: "0", icon: Database, color: "text-blue-400" },
    { title: "Atendimentos IA", value: "0", icon: MessageSquare, color: "text-purple-400" },
    { title: "Taxa de Resolução", value: "100%", icon: Zap, color: "text-yellow-400" },
    { title: "Status do Agente", value: "Aguardando", icon: BrainCircuit, color: "text-emerald-400" },
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <motion.div variants={itemVariant} className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Visão Geral</h1>
                <p className="text-gray-400">Monitore a performance e o conhecimento do seu Agente IA.</p>
            </motion.div>

            <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={i} variants={itemVariant} className="glass p-6 rounded-2xl relative overflow-hidden group">
                            {/* Efeito hover luminoso interno */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-4">
                                    <span className="text-sm font-medium text-gray-400">{stat.title}</span>
                                    <p className="text-4xl font-bold text-white tracking-tight">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl bg-black/30 border border-white/5 ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}