// app/dashboard/knowledge/knowledge-form.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { saveAgentContext } from "./actions";

interface KnowledgeFormProps {
    initialData: {
        companyName: string;
        personality: string;
        knowledgeBase: string;
    } | null;
}

export function KnowledgeForm({ initialData }: KnowledgeFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error", msg: string } | null>(null);

    async function handleAction(formData: FormData) {
        setIsPending(true);
        setFeedback(null);

        const result = await saveAgentContext(formData);

        if (result.error) setFeedback({ type: "error", msg: result.error });
        if (result.success) setFeedback({ type: "success", msg: result.success });

        setIsPending(false);
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            action={handleAction}
            className="glass p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8"
        >
            <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300">Nome da Empresa / Projeto</label>
                <input
                    name="companyName"
                    type="text"
                    required
                    defaultValue={initialData?.companyName || "World Fantasy"}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-300">Personalidade e Guardrails</label>
                    <textarea
                        name="personality"
                        required
                        rows={14}
                        defaultValue={initialData?.personality || ""}
                        placeholder="Ex: Você é um assistente jovem e amigável. Nunca responda sobre política ou religião. Sempre use emojis."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm leading-relaxed resize-none"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-300">Catálogo e Regras de Negócio (RAG Raw)</label>
                    <textarea
                        name="knowledgeBase"
                        required
                        rows={14}
                        defaultValue={initialData?.knowledgeBase || ""}
                        placeholder="Ex: Produto A - R$ 50,00. Aceitamos PIX e Cartão. Danos à fantasia cobram valor integral."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm leading-relaxed resize-none"
                    />
                </div>
            </div>

            {feedback && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl flex items-center gap-3 border ${feedback.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}
                >
                    {feedback.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                    <span className="font-medium text-sm">{feedback.msg}</span>
                </motion.div>
            )}

            <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                    {isPending ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isPending ? "Salvando..." : "Salvar Configurações"}
                </button>
            </div>
        </motion.form>
    );
}