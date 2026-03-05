// app/(auth)/layout.tsx
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen w-full flex bg-background relative overflow-hidden">
            {/* Lado Esquerdo: Formulários (Login / Register) */}
            <section className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10 relative">
                {/* Glow sutil atrás do formulário */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-md">
                    {children}
                </div>
            </section>

            {/* Lado Direito: Visual Premium (Oculto em telas menores) */}
            <section className="hidden lg:flex w-1/2 relative bg-black/50 border-l border-white/5 items-center justify-center overflow-hidden">
                {/* Aqui entraria um asset gerado via Nano Banana de alta fidelidade */}
                <div className="absolute inset-0 bg-[url('/bg-world-fantasy.webp')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                <div className="relative z-10 p-12 text-center space-y-6 max-w-lg glass rounded-3xl">
                    <Sparkles className="w-12 h-12 text-primary mx-auto" />
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        Central de Inteligência World Fantasy
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Gestão de locações, controle de inventário e núcleo de processamento do Agente IA integrado ao n8n.
                    </p>
                </div>
            </section>
        </main>
    );
}