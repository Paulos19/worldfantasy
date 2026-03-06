"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export default function AboutSparklesSection() {
    const skills = [
        "Next.js", "React", "TypeScript", "Tailwind CSS",
        "Prisma ORM", "Next-Auth", "PostgreSQL", "Node.js", "OpenAI"
    ];

    return (
        <div className="h-[40rem] relative w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden border-t border-white/5">
            <div className="w-full absolute inset-0 h-full">
                <SparklesCore
                    id="tsparticlescolorful"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#a855f7" // Purple
                    speed={0.5}
                />
            </div>

            <div className="flex flex-col items-center justify-center gap-6 relative z-20 px-4 max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-medium text-indigo-400 tracking-wider uppercase text-center">
                    Conheça o Desenvolvedor
                </h2>

                <h1 className="md:text-6xl text-5xl lg:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 pb-2">
                    Paulo Henrique
                </h1>

                <p className="text-zinc-300 text-center text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
                    Sou um Desenvolvedor Fullstack apaixonado por criar produtos digitais inovadores. Construo sistemas escaláveis utilizando as melhores tecnologias do mercado para dar vida à plataforma World Fantasy.
                </p>

                {/* Skills Pills */}
                <div className="flex flex-wrap gap-3 justify-center mt-6 animate-fade-slide-in-4">
                    {skills.map((tech) => (
                        <span
                            key={tech}
                            className="px-4 py-1.5 text-sm font-semibold bg-white/5 text-zinc-100 border border-white/10 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:bg-white/10 transition-colors"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
