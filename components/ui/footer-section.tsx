"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Github, Linkedin, Moon, Send, Sun, Mail } from "lucide-react"
import { useTheme } from "next-themes"

function FooterSection() {
    const { theme, setTheme } = useTheme()

    return (
        <footer className="relative border-t border-white/10 bg-[#050505] text-white transition-colors duration-300">
            <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 relative z-10">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="relative">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight text-indigo-400">Networking</h2>
                        <p className="mb-6 text-zinc-400">
                            Quer tirar uma ideia do papel ou automatizar sua operação? Envie seu e-mail pra iniciarmos uma conversa.
                        </p>
                        <form className="relative" onSubmit={(e) => e.preventDefault()}>
                            <Input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="pr-12 backdrop-blur-sm bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-indigo-500 text-white transition-transform hover:scale-105 hover:bg-indigo-400"
                            >
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Enviar</span>
                            </Button>
                        </form>
                        <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Navegação Rápida</h3>
                        <nav className="space-y-3 text-sm text-zinc-400">
                            <a href="#plataforma" className="block transition-colors hover:text-indigo-400">
                                Início
                            </a>
                            <a href="#plataforma" className="block transition-colors hover:text-indigo-400">
                                Plataforma
                            </a>
                            <a href="#agentes" className="block transition-colors hover:text-indigo-400">
                                Sistema IA
                            </a>
                            <a href="#sobre" className="block transition-colors hover:text-indigo-400">
                                Sobre Mim
                            </a>
                        </nav>
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Entre em Contato</h3>
                        <address className="space-y-3 text-sm not-italic text-zinc-400">
                            <p className="text-white font-medium">Paulo Henrique</p>
                            <p>Brasília - DF</p>
                            <p>Telefone: <a href="tel:+5561986446934" className="hover:text-indigo-400 transition-colors">(61) 98644-6934</a></p>
                            <p>Email: <a href="mailto:paulohenrique.012araujo@gmail.com" className="hover:text-indigo-400 transition-colors">paulohenrique.012araujo@gmail.com</a></p>
                        </address>
                    </div>
                    <div className="relative">
                        <h3 className="mb-4 text-lg font-semibold text-white">Redes Sociais</h3>
                        <div className="mb-6 flex space-x-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a href="https://github.com/paulos19" target="_blank" rel="noreferrer">
                                            <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                                                <Github className="h-4 w-4" />
                                                <span className="sr-only">GitHub</span>
                                            </Button>
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">
                                        <p>Meu GitHub</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                                            <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                                                <Linkedin className="h-4 w-4" />
                                                <span className="sr-only">LinkedIn</span>
                                            </Button>
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">
                                        <p>Conecte-se no LinkedIn</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a href="mailto:paulohenrique.012araujo@gmail.com">
                                            <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                                                <Mail className="h-4 w-4" />
                                                <span className="sr-only">Email Diretamente</span>
                                            </Button>
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">
                                        <p>Mande um E-mail</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-3 text-zinc-400">
                            <Sun className="h-4 w-4" />
                            <Switch
                                id="dark-mode"
                                checked={theme === "dark"}
                                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-zinc-700"
                            />
                            <Moon className="h-4 w-4" />
                            <Label htmlFor="dark-mode" className="sr-only">
                                Toggle dark mode
                            </Label>
                        </div>
                    </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row">
                    <p className="text-sm text-zinc-500">
                        © {new Date().getFullYear()} Paulo Henrique. Todos os direitos reservados.
                    </p>
                    <nav className="flex gap-4 text-sm text-zinc-500">
                        <a href="#" className="transition-colors hover:text-indigo-400">
                            World Fantasy
                        </a>
                        <a href="#" className="transition-colors hover:text-indigo-400">
                            Termos de Uso
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    )
}

export { FooterSection }
