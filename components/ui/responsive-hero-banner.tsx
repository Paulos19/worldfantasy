"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Box, Key, Bot, Workflow, Warehouse, Menu, X, Crown, Orbit } from "lucide-react";

interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

interface Partner {
    icon: React.ReactNode;
    href: string;
}

interface ResponsiveHeroBannerProps {
    logoUrl?: string;
    backgroundImageUrl?: string;
    navLinks?: NavLink[];
    ctaButtonText?: string;
    ctaButtonHref?: string;
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    partnersTitle?: string;
    partners?: Partner[];
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    logoUrl,
    backgroundImageUrl = "https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=3840&auto=format&fit=crop",
    navLinks = [
        { label: "Plataforma", href: "#plataforma", isActive: true },
        { label: "Inventário", href: "#inventario" },
        { label: "Agentes IA", href: "#agentes" },
        { label: "Sobre Mim", href: "#sobre" },
        { label: "Portfólio", href: "https://phportifolio.vercel.app/" },
    ],
    ctaButtonText = "Acessar Plataforma",
    ctaButtonHref = "/dashboard",
    badgeLabel = "v2.0",
    badgeText = "A Nova Era de Gestão Inteligente",
    title = "Gestão de Locações",
    titleLine2 = "Impulsionada por IA",
    description = "Assuma o controle total do seu inventário. A Central de Inteligência World Fantasy automatiza processos complexos, sincroniza seu catálogo e facilita a gestão de locações de forma mágica e eficiente.",
    primaryButtonText = "Agendar Demonstração",
    primaryButtonHref = "#",
    secondaryButtonText = "Ver Recursos",
    secondaryButtonHref = "#",
    partnersTitle = "Tecnologias Integradas ao Ecossistema",
    partners = [
        { icon: <Bot className="w-8 h-8" />, href: "#" },
        { icon: <Workflow className="w-8 h-8" />, href: "#" },
        { icon: <Warehouse className="w-8 h-8" />, href: "#" },
        { icon: <Box className="w-8 h-8" />, href: "#" },
        { icon: <Sparkles className="w-8 h-8" />, href: "#" },
    ],
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="w-full isolate min-h-screen overflow-hidden relative bg-[#09090b]">
            <img
                src={backgroundImageUrl}
                alt="Background Espacial"
                className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0 opacity-80 mix-blend-lighten"
            />

            {/* Grade e overlay de gradiente para um ar de "desconstrução" premium */}
            <div className="pointer-events-none absolute inset-0 bg-[url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/grid.svg')] opacity-10 bg-[length:32px_32px]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />

            {/* Navbar Desconstruída e Flutuante */}
            <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl transition-all duration-300 ${scrolled ? 'top-6' : 'top-8'}`}>
                <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
                    {/* Logo Section */}
                    <a href="#" className="flex items-center gap-2 group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-colors">
                            <Crown className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                        </div>
                        <span className="text-white font-serif tracking-wide text-xl hidden sm:block">World<span className="text-indigo-400">Fantasy</span></span>
                    </a>

                    {/* Desktop NavLinks */}
                    <nav className="hidden md:flex items-center gap-1">
                        <div className="flex items-center px-2 py-1.5 rounded-full bg-white/5 border border-white/5">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    target={link.label === "Portfólio" ? "_blank" : "_self"}
                                    rel={link.label === "Portfólio" ? "noopener noreferrer" : ""}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium font-sans transition-all duration-300 ${link.isActive
                                        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center">
                        <a
                            href={ctaButtonHref}
                            className="inline-flex items-center gap-2 rounded-full bg-indigo-500 hover:bg-indigo-400 px-5 py-2.5 text-sm font-semibold text-white font-sans transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]"
                        >
                            <Key className="w-4 h-4" />
                            {ctaButtonText}
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 backdrop-blur"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <div className={`md:hidden absolute top-full left-0 right-0 mt-4 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                target={link.label === "Portfólio" ? "_blank" : "_self"}
                                rel={link.label === "Portfólio" ? "noopener noreferrer" : ""}
                                className={`text-lg font-medium font-sans transition-colors ${link.isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                        <hr className="border-white/10 my-2" />
                        <a
                            href={ctaButtonHref}
                            className="flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 py-3 text-base font-semibold text-white"
                        >
                            <Key className="w-5 h-5" />
                            {ctaButtonText}
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="z-10 relative h-full flex items-center justify-center">
                <div className="w-full max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-48 flex flex-col items-center">

                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-black/30 px-3 py-2 border border-white/10 backdrop-blur-md animate-fade-slide-in-1 shadow-lg">
                        <span className="inline-flex items-center text-xs font-bold tracking-wider uppercase text-black bg-indigo-400 rounded-full py-1 px-3 font-sans">
                            {badgeLabel}
                        </span>
                        <span className="text-sm font-medium text-zinc-300 font-sans pr-2">
                            {badgeText}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-center sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.1] text-5xl text-white tracking-tight font-serif font-normal animate-fade-slide-in-2 drop-shadow-2xl">
                        {title}
                        <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-zinc-400">
                            {titleLine2}
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-center sm:text-xl md:text-2xl animate-fade-slide-in-3 font-sans text-zinc-400 max-w-3xl mt-8 mx-auto leading-relaxed">
                        {description}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row sm:gap-6 mt-12 gap-4 items-center justify-center animate-fade-slide-in-4 w-full sm:w-auto">
                        <a
                            href={primaryButtonHref}
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-zinc-200 text-base font-semibold rounded-full py-4 px-8 font-sans transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                        >
                            {primaryButtonText}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href={secondaryButtonHref}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-transparent border border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/5 hover:border-white/40 font-sans transition-all duration-300 backdrop-blur-sm"
                        >
                            {secondaryButtonText}
                        </a>
                    </div>

                    {/* Partners Section */}
                    <div className="w-full mt-24 lg:mt-32 border-t border-white/10 pt-12 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.5)]" />

                        <p className="animate-fade-slide-in-1 text-sm md:text-base font-medium text-zinc-500 text-center font-sans tracking-wide uppercase">
                            {partnersTitle}
                        </p>
                        <div className="flex flex-wrap justify-center animate-fade-slide-in-2 mt-8 gap-8 md:gap-16 items-center">
                            {partners.map((partner, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-center text-zinc-600 hover:text-indigo-300 transition-colors duration-300 cursor-pointer w-16 h-16"
                                >
                                    {partner.icon}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;
