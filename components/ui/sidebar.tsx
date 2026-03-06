// components/ui/sidebar.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Package,
    ChevronLeft,
    ChevronRight,
    WandSparkles,
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
    { name: "Catálogo & Estoque", href: "/dashboard/catalog", icon: Package },
    { name: "Base de Conhecimento", href: "/dashboard/knowledge", icon: Database },
    { name: "Logs do Agente IA", href: "/dashboard/agent-logs", icon: Bot },
    { name: "Atendimentos", href: "/dashboard/chats", icon: Users },
    { name: "Otimizador de Prompts", href: "/dashboard/prompt-optimizer", icon: WandSparkles },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];

const sidebarVariants = {
    expanded: { width: 288 },
    collapsed: { width: 80 },
} as const;

// Pega as iniciais do nome (máx 2 letras)
function getInitials(name?: string | null) {
    if (!name) return "A";
    return name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial="expanded"
            animate={collapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="h-full glass border-r border-white/10 flex flex-col justify-between relative z-20 shrink-0 overflow-hidden"
        >
            {/* Toggle button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-0 top-7 z-30 w-7 h-7 rounded-l-lg bg-white/5 border border-white/10 border-r-0 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                title={collapsed ? "Expandir" : "Recolher"}
            >
                <motion.div
                    animate={{ rotate: collapsed ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </motion.div>
            </button>

            <div className="p-4 flex flex-col gap-6 flex-1">
                {/* Logo / Brand */}
                <div className={clsx("flex items-center gap-3 py-2", collapsed ? "justify-center px-0" : "px-2")}>
                    <motion.div
                        layout
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0"
                    >
                        <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <AnimatePresence mode="wait">
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                <h1 className="font-bold text-white tracking-wide text-lg leading-none">World Fantasy</h1>
                                <span className="text-xs text-primary font-medium tracking-widest uppercase">Admin Core</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Links de Navegação */}
                <nav className="flex flex-col gap-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.name} href={item.href} className="relative group" title={collapsed ? item.name : undefined}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 rounded-xl"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <div className={clsx(
                                    "relative flex items-center gap-3 rounded-xl transition-colors z-10",
                                    collapsed ? "justify-center px-2 py-3" : "px-4 py-3",
                                    isActive ? "text-white font-medium" : "text-gray-400 hover:text-gray-200"
                                )}>
                                    <Icon className={clsx(
                                        "w-5 h-5 transition-transform group-hover:scale-110 shrink-0",
                                        isActive && "text-primary"
                                    )} />
                                    <AnimatePresence mode="wait">
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-sm whitespace-nowrap overflow-hidden"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Profile Card com Gradient */}
            <div className="p-4">
                <motion.div
                    layout
                    className={clsx(
                        "relative overflow-hidden rounded-2xl",
                        "bg-gradient-to-br from-primary/20 via-purple-600/15 to-pink-500/10",
                        "border border-white/10",
                        collapsed ? "p-3" : "p-4"
                    )}
                >
                    {/* Glow decorativo interno */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/15 blur-2xl rounded-full pointer-events-none" />

                    <div className={clsx("relative z-10 flex items-center", collapsed ? "justify-center" : "gap-3")}>
                        {/* Avatar com iniciais */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary/25 ring-2 ring-white/10">
                            <span className="text-white font-bold text-sm">{getInitials(user.name)}</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 overflow-hidden min-w-0"
                                >
                                    <p className="text-sm font-semibold text-white truncate">{user.name || "Administrador"}</p>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {!collapsed && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors shrink-0"
                                    title="Sair do sistema"
                                >
                                    <LogOut className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Logout separado quando colapsado */}
                    <AnimatePresence mode="wait">
                        {collapsed && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="w-full mt-2 p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors flex items-center justify-center"
                                title="Sair do sistema"
                            >
                                <LogOut className="w-4 h-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.aside>
    );
}