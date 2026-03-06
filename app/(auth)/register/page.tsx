// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { registerAdmin } from "./actions";

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function clientAction(formData: FormData) {
        setIsPending(true);
        setError(null);
        const result = await registerAdmin(formData);

        // Se a Server Action retornar um erro (e não fizer o redirect)
        if (result?.error) {
            setError(result.error);
            setIsPending(false);
        }
    }

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
            <motion.div variants={fadeUp} className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Criar Acesso</h1>
                <p className="text-gray-400">Configure sua conta administrativa da World Fantasy.</p>
            </motion.div>

            <motion.form variants={fadeUp} action={clientAction} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                    <input
                        name="name"
                        type="text"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="Seu nome"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">WhatsApp (com DDD)</label>
                    <input
                        name="phone"
                        type="tel"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="5511999999999"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">E-mail Corporativo</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="admin@worldfantasy.com.br"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Senha Segura</label>
                    <input
                        name="password"
                        type="password"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-medium">
                        {error}
                    </motion.p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 group"
                >
                    {isPending ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                        <>
                            Registrar Administrador
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </motion.form>

            <motion.p variants={fadeUp} className="text-center text-sm text-gray-500">
                Já possui acesso?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Faça login
                </Link>
            </motion.p>
        </motion.div>
    );
}