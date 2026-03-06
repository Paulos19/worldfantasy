// components/ui/sidebar.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Database,
    Bot,
    Settings,
    LogOut,
    Sparkles,
    Users,
    Package
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        role: "ADMIN" | "USER";
    };
}

const navItems = [
    { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
    { name: "Catálogo & Estoque", href: "/dashboard/catalog", icon: Package }, // <- Nova Rota
    { name: "Base de Conhecimento (RAG)", href: "/dashboard/knowledge", icon: Database },
    { name: "Logs do Agente IA", href: "/dashboard/agent-logs", icon: Bot },
    { name: "Atendimentos", href: "/dashboard/chats", icon: Users },
    { name: "Configurações n8n", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-72 h-full glass border-r border-white/10 flex flex-col justify-between relative z-20 shrink-0"
        >
            <div className="p-6 flex flex-col gap-8">
                {/* Logo / Brand */}
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white tracking-wide text-lg leading-none">World Fantasy</h1>
                        <span className="text-xs text-primary font-medium tracking-widest uppercase">Admin Core</span>
                    </div>
                </div>

                {/* Links de Navegação */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.name} href={item.href} className="relative group">
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 rounded-lg"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <div className={clsx(
                                    "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors z-10",
                                    isActive ? "text-white font-medium" : "text-gray-400 hover:text-gray-200"
                                )}>
                                    <Icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                                    <span className="text-sm">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Profile & Logout */}
            <div className="p-6 border-t border-white/5">
                <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col truncate pr-4">
                        <span className="text-sm font-semibold text-white truncate">{user.name || "Administrador"}</span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        title="Sair do sistema"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}