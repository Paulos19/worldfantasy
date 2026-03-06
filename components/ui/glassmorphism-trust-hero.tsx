import React from "react";
import {
    ArrowRight,
    Play,
    Target,
    Crown,
    Star,
    Hexagon,
    Triangle,
    Command,
    Ghost,
    Gem,
    Cpu,
    Wand2,
    Box,
    Warehouse
} from "lucide-react";

// --- MOCK BRANDS ---
const CLIENTS = [
    { name: "Estúdios Alpha", icon: Hexagon },
    { name: "Locação PRO", icon: Triangle },
    { name: "Cinemática", icon: Command },
    { name: "Cena & Ação", icon: Ghost },
    { name: "Set Design", icon: Gem },
    { name: "Galpão X", icon: Cpu },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
        <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
    </div>
);

// --- MAIN COMPONENT ---
export default function TrustHeroSection() {
    return (
        <div className="relative w-full bg-[#0a0a0a] text-white overflow-hidden font-sans border-t border-white/10">
            {/* 
        SCOPED ANIMATIONS 
      */}
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite; /* Slower for readability */
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

            {/* Background Image with Gradient Mask */}
            <div
                className="absolute inset-0 z-0 bg-[url(https://images.unsplash.com/photo-1541888046425-d81bb192a010?q=80&w=3840&auto=format&fit=crop)] bg-cover bg-center opacity-30 mix-blend-screen"
                style={{
                    maskImage: "linear-gradient(180deg, transparent, black 20%, black 80%, transparent)",
                    WebkitMaskImage: "linear-gradient(180deg, transparent, black 20%, black 80%, transparent)",
                }}
            />
            {/* Mesh gradient extra */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 md:pt-32 md:pb-24 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12 items-center">

                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">

                        {/* Badge */}
                        <div className="animate-fade-in delay-100">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-colors hover:bg-white/10">
                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                                    Gestão Inteligente
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                </span>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1
                            className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif tracking-tight leading-[0.95]"
                            style={{
                                maskImage: "linear-gradient(180deg, black 0%, black 90%, transparent 100%)",
                                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 90%, transparent 100%)"
                            }}
                        >
                            Criando Soluções<br />
                            <span className="bg-gradient-to-br from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent italic font-light drop-shadow-sm">
                                Mágicas
                            </span><br />
                            Para Locações
                        </h1>

                        {/* Description */}
                        <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed font-sans">
                            Unimos inteligência artificial com o controle total do seu acervo.
                            Catalogamos seus cenários e objetos de cena, integrando operações
                            complexas em um fluxo transparente e confiável.
                        </p>

                        {/* CTA Buttons */}
                        <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
                            <button className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-zinc-100 active:scale-[0.98]">
                                Acessar Inventário
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>

                            <button className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-black/50 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30">
                                <Play className="w-5 h-5 fill-current" />
                                Assistir Flow IA
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="lg:col-span-5 space-y-6 lg:mt-12">

                        {/* Stats Card */}
                        <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-2xl shadow-2xl">
                            {/* Card Glow Effect */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 ring-1 ring-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                        <Box className="h-7 w-7 text-indigo-300" />
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold tracking-tight text-white mb-1">10k+</div>
                                        <div className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Itens Mapeados</div>
                                    </div>
                                </div>

                                {/* Progress Bar Section */}
                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-400">Precisão da IA</span>
                                        <span className="text-white font-bold">99.8%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800/80 ring-1 ring-white/5">
                                        <div className="h-full w-[99.8%] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                                {/* Mini Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <StatItem value="15+" label="Estúdios" />
                                    <div className="w-px h-full bg-white/10 mx-auto" />
                                    <StatItem value="n8n" label="Automação" />
                                    <div className="w-px h-full bg-white/10 mx-auto" />
                                    <StatItem value="24/7" label="Agentes" />
                                </div>

                                {/* Tag Pills */}
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-bold tracking-wide text-indigo-200">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                        </span>
                                        SYNC ENABlED
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-wide text-zinc-300">
                                        <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                                        POWERED BY AI
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Marquee Card */}
                        <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 py-8 backdrop-blur-2xl">
                            <h3 className="mb-6 px-8 text-xs font-semibold tracking-wider uppercase text-zinc-500">Rede Integrada</h3>

                            <div
                                className="relative flex overflow-hidden"
                                style={{
                                    maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                                    WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                                }}
                            >
                                <div className="animate-marquee flex gap-10 whitespace-nowrap px-4 w-max">
                                    {/* Triple list for seamless loop */}
                                    {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2.5 opacity-50 transition-all duration-300 hover:opacity-100 hover:scale-105 cursor-pointer hover:text-indigo-400 group"
                                        >
                                            {/* Brand Icon */}
                                            <client.icon className="h-6 w-6 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                                            {/* Brand Name */}
                                            <span className="text-lg font-bold text-zinc-300 tracking-tight group-hover:text-white transition-colors">
                                                {client.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
