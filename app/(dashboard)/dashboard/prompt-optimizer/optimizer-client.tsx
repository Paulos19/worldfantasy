"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WandSparkles, Loader2, FileText, CheckCircle2, AlertTriangle, Play, Copy, Check, Send, Clock, RefreshCw } from "lucide-react";
import { optimizePromptAction, sendWhatsAppAction } from "./actions";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariant = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

type ResultTab = "evaluation" | "optimized";

export type OptimizationRecord = {
    id: string;
    originalPrompt: string;
    clientRequest: string;
    evaluation: string;
    optimizedPrompt: string;
    sentViaWhatsApp: boolean;
    createdAt: string;
};

export function OptimizerClient({ initialHistory }: { initialHistory: OptimizationRecord[] }) {
    const [history, setHistory] = useState<OptimizationRecord[]>(initialHistory);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<{ id?: string; evaluation: string; optimizedPrompt: string } | null>(null);
    const [activeTab, setActiveTab] = useState<ResultTab>("evaluation");
    const [copied, setCopied] = useState(false);
    const [whatsappSent, setWhatsappSent] = useState(false);
    const [resendId, setResendId] = useState<string | null>(null);

    // Seleciona um item do histórico para visualização
    function handleSelectHistory(item: OptimizationRecord) {
        setResults({
            id: item.id,
            evaluation: item.evaluation,
            optimizedPrompt: item.optimizedPrompt
        });
        setWhatsappSent(item.sentViaWhatsApp);
        setActiveTab("evaluation");
        setError(null);
    }

    async function handleAction(formData: FormData) {
        setIsPending(true);
        setError(null);
        setResults(null);

        const result = await optimizePromptAction(formData);

        if (result.error) {
            setError(result.error);
        } else if (result.success && result.evaluation && result.optimizedPrompt) {
            // Criar um registro otimista para o histórico
            const newRecord: OptimizationRecord = {
                id: "temp-" + Date.now(), // Atualizado após refresh real, apenas UX aqui
                originalPrompt: formData.get("currentPrompt") as string,
                clientRequest: formData.get("clientRequest") as string,
                evaluation: result.evaluation,
                optimizedPrompt: result.optimizedPrompt,
                sentViaWhatsApp: result.whatsappSent ?? false,
                createdAt: new Date().toISOString(),
            };

            setResults({ evaluation: result.evaluation, optimizedPrompt: result.optimizedPrompt });
            setActiveTab("evaluation");
            setWhatsappSent(result.whatsappSent ?? false);
            setHistory(prev => [newRecord, ...prev].slice(0, 20)); // Prepend at max 20
        } else {
            setError("A resposta da IA veio em um formato inesperado.");
        }

        setIsPending(false);
    }

    async function handleResendWhatsApp(id: string) {
        setResendId(id);
        const result = await sendWhatsAppAction(id);

        if (result.success) {
            setWhatsappSent(true);
            setHistory(prev => prev.map(h => h.id === id ? { ...h, sentViaWhatsApp: true } : h));
        } else {
            setError(result.error || "Erro ao reenviar");
        }
        setResendId(null);
    }

    function handleCopy() {
        if (!results) return;
        navigator.clipboard.writeText(results.optimizedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col min-h-[calc(100vh-5rem)] h-auto w-full max-w-[1400px] mx-auto pb-6">
            {/* Header compacto */}
            <motion.div variants={itemVariant} className="flex items-center justify-between mb-5 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/10 border border-primary/20">
                        <WandSparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-white leading-tight">Engenharia de Prompts</h1>
                        <p className="text-gray-500 text-xs">Auditoria e otimização autônoma de System Prompts</p>
                    </div>
                </div>
            </motion.div>

            {/* Grid principal — 2 colunas: Esquerda (Input + Histórico) 2/5 | Direita (Resultados) 3/5 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 flex-1 min-h-[600px] h-full">

                {/* COLUNA ESQUERDA (2/5): Formulário de Entrada e Histórico */}
                <div className="lg:col-span-2 flex flex-col gap-5 min-h-0">

                    {/* PARTE SUPERIOR: Input Form */}
                    <motion.div variants={itemVariant} className="glass rounded-2xl border border-white/5 shadow-2xl flex flex-col shrink-0">
                        <div className="px-5 pt-4 pb-3 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Nova Entrada</h2>
                            </div>
                            {results && (
                                <button onClick={() => setResults(null)} className="text-[10px] font-semibold text-primary hover:text-primary/80 uppercase">Limpar</button>
                            )}
                        </div>

                        <form action={handleAction} className="flex flex-col p-5 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prompt Atual</label>
                                <textarea
                                    name="currentPrompt"
                                    required
                                    rows={3}
                                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm leading-relaxed resize-none"
                                    placeholder='"Você é um assistente..."'
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Objetivo / Problema</label>
                                <textarea
                                    name="clientRequest"
                                    required
                                    rows={2}
                                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm leading-relaxed resize-none"
                                    placeholder='"O agente está muito formal..."'
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-xl flex items-center gap-2.5 border bg-red-500/10 border-red-500/20 text-red-400">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    <span className="font-medium text-xs line-clamp-2">{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        <span className="text-sm">Processando (~20s)...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" />
                                        <span className="text-sm">Iniciar Refatoração</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* PARTE INFERIOR: Histórico */}
                    <motion.div variants={itemVariant} className="glass rounded-2xl border border-white/5 shadow-2xl flex flex-col flex-1 overflow-hidden min-h-[250px]">
                        <div className="px-5 pt-4 pb-3 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Histórico Recente</h2>
                            </div>
                            <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{history.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0 p-3 flex flex-col gap-2">
                            {history.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50">
                                    <FileText className="w-8 h-8 text-gray-600 mb-2" />
                                    <p className="text-xs text-gray-400">Nenhuma otimização.</p>
                                </div>
                            ) : (
                                history.map((record) => (
                                    <button
                                        key={record.id}
                                        onClick={() => handleSelectHistory(record)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all shrink-0 ${results?.id === record.id ? 'bg-primary/10 border-primary/30' : 'bg-black/30 border-white/5 hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-start justify-between mb-1.5">
                                            <span className="text-[10px] font-semibold text-gray-500 uppercase">
                                                {new Date(record.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                                            </span>
                                            {record.sentViaWhatsApp && <Send className="w-3 h-3 text-green-400" />}
                                        </div>
                                        <p className="text-sm font-medium text-white line-clamp-1 truncate">{record.clientRequest}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1 truncate mt-0.5 font-mono">{record.originalPrompt}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* COLUNA DIREITA (3/5): Resultados */}
                <motion.div variants={itemVariant} className="lg:col-span-3 flex flex-col min-h-[500px] h-full max-h-[900px]">
                    <AnimatePresence mode="wait">
                        {/* Estado vazio */}
                        {!results && !isPending && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="glass flex-1 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center px-8"
                            >
                                <div className="opacity-40">
                                    <WandSparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-lg font-bold text-white">Aguardando Execução</p>
                                    <p className="text-gray-500 max-w-xs text-sm mt-1">
                                        O relatório de auditoria e o prompt otimizado aparecerão aqui ou selecione no histórico.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Estado de loading */}
                        {isPending && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="glass flex-1 rounded-2xl border border-primary/20 flex flex-col p-6 relative overflow-hidden"
                            >
                                <motion.div
                                    animate={{ y: ["-100%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 w-full h-[20%] bg-gradient-to-b from-transparent via-primary/10 to-transparent blur-md z-0 pointer-events-none"
                                />
                                <div className="space-y-4 relative z-10 flex-1">
                                    <div className="h-5 w-1/3 bg-white/10 rounded-md animate-pulse" />
                                    <div className="h-4 w-full bg-white/5 rounded-md animate-pulse" />
                                    <div className="h-4 w-5/6 bg-white/5 rounded-md animate-pulse" />
                                    <div className="h-4 w-4/6 bg-white/5 rounded-md animate-pulse" />
                                    <div className="h-px bg-white/5 my-4" />
                                    <div className="h-5 w-1/4 bg-white/10 rounded-md animate-pulse" />
                                    <div className="h-24 w-full bg-white/5 rounded-xl animate-pulse" />
                                </div>
                            </motion.div>
                        )}

                        {/* Resultados com abas */}
                        {results && !isPending && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                                className="glass flex-1 rounded-2xl border border-white/5 flex flex-col overflow-hidden min-h-0"
                            >
                                {/* Tabs bar */}
                                <div className="flex items-center justify-between border-b border-white/5 px-1 pt-1 shrink-0 overflow-x-auto">
                                    <div className="flex shrink-0">
                                        <button
                                            onClick={() => setActiveTab("evaluation")}
                                            className={`relative px-5 py-3 text-sm font-semibold transition-colors ${activeTab === "evaluation" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                Avaliação
                                            </span>
                                            {activeTab === "evaluation" && (
                                                <motion.div
                                                    layoutId="resultTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("optimized")}
                                            className={`relative px-5 py-3 text-sm font-semibold transition-colors ${activeTab === "optimized" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <WandSparkles className="w-4 h-4 text-primary" />
                                                Prompt Otimizado
                                            </span>
                                            {activeTab === "optimized" && (
                                                <motion.div
                                                    layoutId="resultTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </button>
                                    </div>

                                    {/* Botão copiar (sempre visível no tab otimizado) */}
                                    {activeTab === "optimized" && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onClick={handleCopy}
                                            className="mr-3 flex shrink-0 items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                                        >
                                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            {copied ? "Copiado!" : "Copiar"}
                                        </motion.button>
                                    )}
                                </div>

                                {/* Tab content — preenche o espaço restante */}
                                <div className="flex-1 min-h-0 p-5 overflow-y-auto w-full">
                                    <AnimatePresence mode="wait">
                                        {activeTab === "evaluation" && (
                                            <motion.div
                                                key="eval"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="h-full"
                                            >
                                                <pre className="inline-block min-w-full bg-black/40 p-4 rounded-xl border border-white/10 whitespace-pre-wrap font-sans text-sm text-gray-300 leading-relaxed overflow-y-auto">
                                                    {results.evaluation}
                                                </pre>
                                            </motion.div>
                                        )}

                                        {activeTab === "optimized" && (
                                            <motion.div
                                                key="optim"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="h-full relative flex flex-col"
                                            >
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/15 blur-[60px] pointer-events-none" />
                                                <textarea
                                                    readOnly
                                                    value={results.optimizedPrompt}
                                                    className="w-full flex-1 bg-black/50 border border-white/10 rounded-xl p-4 text-emerald-400 font-mono text-sm leading-relaxed focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Status bar — salvo no DB + WhatsApp */}
                                <div className="shrink-0 px-5 py-3 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Salvo no banco</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs ${whatsappSent ? "text-green-400" : "text-gray-500"}`}>
                                            <Send className="w-3.5 h-3.5" />
                                            <span>{whatsappSent ? "Enviado via WhatsApp" : "WhatsApp não enviado"}</span>
                                        </div>
                                    </div>

                                    {/* Action to resend WhatsApp if viewing an existing record */}
                                    {results.id && !whatsappSent && !results.id.startsWith("temp-") && (
                                        <button
                                            onClick={() => handleResendWhatsApp(results.id!)}
                                            disabled={resendId === results.id}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                                        >
                                            {resendId === results.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <RefreshCw className="w-3.5 h-3.5" />
                                            )}
                                            Reenviar WA
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>
        </motion.div>
    );
}
