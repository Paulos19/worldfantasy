// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        } else {
            router.push("/dashboard"); // Redireciona com transição suave no Next 16
        }
    };

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
            <motion.div variants={fadeUp} className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Bem-vindo de volta</h1>
                <p className="text-gray-400">Insira suas credenciais para acessar o painel.</p>
            </motion.div>

            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">E-mail Corporativo</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="admin@worldfantasy.com.br"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Senha</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 group"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                        <>
                            Entrar no Sistema
                            <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </motion.form>

            <motion.p variants={fadeUp} className="text-center text-sm text-gray-500">
                Precisa de acesso?{" "}
                <Link href="/register" className="text-white hover:text-gray-300 font-medium transition-colors">
                    Contate um administrador
                </Link>
                {" "}ou{" "}
                <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    crie uma conta
                </Link>
            </motion.p>
        </motion.div>
    );
}