// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    // Busca a sessão direto no servidor de forma ultra-rápida
    const session = await getServerSession(authOptions);

    // Fallback de segurança duplo (além do middleware)
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
            {/* Navegação Lateral Animada */}
            <Sidebar user={session.user} />

            {/* Área Principal de Conteúdo */}
            <main className="flex-1 relative overflow-y-auto overflow-x-hidden p-6 lg:p-10">
                {/* Glow de fundo decorativo para profundidade */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}