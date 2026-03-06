// app/dashboard/catalog/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { CatalogClient } from "./catalog-client"; // Vamos criar este arquivo a seguir

export default async function CatalogPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) redirect("/login");

    // Busca os produtos do lojista logado, ordenados do mais recente para o mais antigo
    const products = await prisma.product.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        <Package className="text-primary w-8 h-8" />
                        Catálogo de Produtos
                    </h1>
                    <p className="text-gray-400">
                        Gerencie o estoque que o seu Agente IA utilizará para responder aos clientes.
                    </p>
                </div>
            </div>

            {/* Isolamos a interatividade (Grid animado e Modal de Cadastro) no Client Component */}
            <CatalogClient initialProducts={products} />
        </div>
    );
}