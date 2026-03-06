"use client";

import React, { useState } from "react";
import { Terminal, Github, Linkedin, Mail } from "lucide-react";

interface NavLink {
    href: string;
    label: string;
}

interface DeveloperHeroProps {
    backgroundImage?: string;
    logoText?: React.ReactNode;
    navLinks?: NavLink[];
    avatarSrcList?: string[];
    userCount?: number;
    title?: string;
    description?: string;
    placeholder?: string;
    ctaText?: string;
    onSubmit?: (email: string) => void;
    footerVersion?: string;
}

export default function DeveloperHeroSection({
    backgroundImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=3840&auto=format&fit=crop",
    logoText = <><Terminal className="inline-block mr-2 text-indigo-400" /> Paulo Henrique</>,
    navLinks = [
        { href: "#projetos", label: "Projetos" },
        { href: "#habilidades", label: "Habilidades" },
        { href: "#experiencia", label: "Experiência" },
        { href: "#contato", label: "Contato" },
    ],
    avatarSrcList = [
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=32&h=32&fit=crop",
    ],
    userCount = 1,
    title = "Paulo Henrique",
    description = "Sou um Desenvolvedor Fullstack apaixonado por criar produtos digitais. Construo sistemas escaláveis utilizando as melhores tecnologias do mercado, como as que dão vida à plataforma World Fantasy.",
    placeholder = "Seu melhor e-mail",
    ctaText = "Entrar em Contato",
    onSubmit = (email) => console.log("Contato agendado com:", email),
    footerVersion = "v1.0.0 - Paulo Henrique",
}: DeveloperHeroProps) {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        if (onSubmit) onSubmit(email);
        setEmail("");
    };

    return (
        <div className="relative font-sans border-t border-white/5 bg-[#050505]">
            <header className="absolute inset-x-0 top-0 p-6 md:p-8 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-2xl sm:text-3xl font-bold flex items-center text-white">{logoText}</div>
                    <nav className="hidden md:flex space-x-8 text-sm font-medium">
                        {navLinks.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href="#contato"
                            className="border border-white/20 rounded-full px-6 py-2 text-sm font-semibold text-white hover:bg-white hover:text-black transition-colors backdrop-blur-sm"
                        >
                            Falar Comigo
                        </a>
                    </div>
                </div>
            </header>

            <main className="w-full relative overflow-hidden">
                {/* Background Image Setup */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: `url(${backgroundImage})`, maskImage: "linear-gradient(to right, black 30%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, black 30%, transparent 100%)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />

                <div className="container relative z-10 mx-auto min-h-[80vh] flex items-center px-6 md:px-8 py-32">
                    <div className="w-full md:w-1/2 lg:w-3/5">
                        <div className="flex items-center mb-6 animate-fade-slide-in-1">
                            <div className="flex -space-x-2">
                                {avatarSrcList.map((src, idx) => (
                                    <img
                                        key={idx}
                                        className="h-10 w-10 rounded-full ring-2 ring-black"
                                        src={src}
                                        alt={`Avatar ${idx + 1}`}
                                    />
                                ))}
                            </div>
                            <p className="ml-4 text-sm font-medium text-zinc-400 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                                Criador da World Fantasy
                            </p>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-4 animate-fade-slide-in-2">
                            {title}
                        </h1>
                        <h2 className="text-2xl text-indigo-400 font-semibold mb-6 animate-fade-slide-in-3">
                            Desenvolvedor Fullstack
                        </h2>

                        <p className="text-lg text-zinc-400 max-w-lg mb-8 leading-relaxed font-medium animate-fade-slide-in-3">
                            {description}
                        </p>

                        {/* Stack / Experiências */}
                        <div className="flex flex-wrap gap-2 mb-10 animate-fade-slide-in-4">
                            {["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma ORM", "Next-Auth", "PostgreSQL", "Node.js", "OpenAI"].map((tech) => (
                                <span key={tech} className="px-3 py-1 text-sm font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <form
                            className="flex w-full max-w-md animate-fade-slide-in-4"
                            onSubmit={handleSubmit}
                            aria-label="Contact form"
                        >
                            <label htmlFor="dev-email" className="sr-only">
                                Seu e-mail
                            </label>
                            <div className="relative w-full flex items-center shadow-2xl">
                                <div className="absolute left-4 text-zinc-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    id="dev-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full pl-12 pr-4 py-4 rounded-l-xl border border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-500 text-white font-semibold px-6 py-4 rounded-r-xl hover:bg-indigo-400 transition-colors whitespace-nowrap border border-indigo-500 hover:border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                >
                                    {ctaText}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="absolute inset-x-0 bottom-0 p-6 md:p-8 border-t border-white/5 bg-black/50 backdrop-blur-md">
                <div className="container mx-auto flex justify-between items-center text-zinc-500">
                    <div className="text-xs font-mono tracking-wider">{footerVersion}</div>
                    <button
                        type="button"
                        aria-label="Open terminal"
                        className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <Terminal className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
