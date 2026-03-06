"use client";

import { motion } from "framer-motion";
import { Smartphone, CheckCircle2, Loader2, Settings2, Phone, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { updateInstance, updatePhone } from "./actions";

export default function SettingsPage() {
    const [isPendingInstance, setIsPendingInstance] = useState(false);
    const [isPendingPhone, setIsPendingPhone] = useState(false);
    const [feedbackInstance, setFeedbackInstance] = useState<{ type: "success" | "error", msg: string } | null>(null);
    const [feedbackPhone, setFeedbackPhone] = useState<{ type: "success" | "error", msg: string } | null>(null);

    async function handleInstanceAction(formData: FormData) {
        setIsPendingInstance(true);
        setFeedbackInstance(null);
        const result = await updateInstance(formData);
        if (result.error) setFeedbackInstance({ type: "error", msg: result.error });
        if (result.success) setFeedbackInstance({ type: "success", msg: result.success });
        setIsPendingInstance(false);
    }

    async function handlePhoneAction(formData: FormData) {
        setIsPendingPhone(true);
        setFeedbackPhone(null);
        const result = await updatePhone(formData);
        if (result.error) setFeedbackPhone({ type: "error", msg: result.error });
        if (result.success) setFeedbackPhone({ type: "success", msg: result.success });
        setIsPendingPhone(false);
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    <Settings2 className="text-primary w-8 h-8" />
                    Configurações do Sistema
                </h1>
                <p className="text-gray-400">Gerencie integrações e parâmetros do seu ambiente SaaS.</p>
            </div>

            {/* Seção: Telefone WhatsApp do Admin */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="glass p-8 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Telefone WhatsApp</h2>
                        <p className="text-sm text-gray-400">Número usado para receber resultados do Otimizador de Prompts via WhatsApp.</p>
                    </div>
                </div>

                <form action={handlePhoneAction} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Número com DDD e código do país</label>
                        <input
                            name="phone"
                            type="tel"
                            required
                            className="w-full max-w-md bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="5511999999999"
                        />
                    </div>

                    {feedbackPhone && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-xl max-w-md flex items-center gap-3 border ${feedbackPhone.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                            {feedbackPhone.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <span className="font-medium text-sm">{feedbackPhone.msg}</span>
                        </motion.div>
                    )}

                    <button disabled={isPendingPhone} type="submit" className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-70">
                        {isPendingPhone ? <Loader2 className="animate-spin w-5 h-5" /> : "Salvar Telefone"}
                    </button>
                </form>
            </motion.div>

            {/* Seção: Instância WhatsApp (Evolution API) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-8 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                        <Smartphone className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Conexão WhatsApp (Evolution API)</h2>
                        <p className="text-sm text-gray-400">O nome exato da instância cadastrada na sua API.</p>
                    </div>
                </div>

                <form action={handleInstanceAction} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Nome da Instância</label>
                        <input
                            name="whatsappInstance"
                            type="text"
                            required
                            className="w-full max-w-md bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="Ex: Henrique, LojaPrincipal..."
                        />
                    </div>

                    {feedbackInstance && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-xl max-w-md flex items-center gap-3 border ${feedbackInstance.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                            {feedbackInstance.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                            <span className="font-medium text-sm">{feedbackInstance.msg}</span>
                        </motion.div>
                    )}

                    <button disabled={isPendingInstance} type="submit" className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-70">
                        {isPendingInstance ? <Loader2 className="animate-spin w-5 h-5" /> : "Salvar Conexão"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}