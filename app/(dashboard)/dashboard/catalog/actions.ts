"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Não autorizado." };

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const file = formData.get("image") as File;

    if (!name || !price || !file.size) return { error: "Preencha todos os campos obrigatórios." };

    try {
        // 1. Upload da imagem pro Vercel Blob
        const blob = await put(`produtos/${Date.now()}-${file.name}`, file, {
            access: "public",
        });

        // 2. Salva o produto no Prisma
        await prisma.product.create({
            data: {
                userId: session.user.id,
                name,
                description,
                price,
                imageUrl: blob.url,
            },
        });

        revalidatePath("/dashboard/catalog");
        return { success: "Produto adicionado ao catálogo!" };
    } catch (error) {
        console.error("Erro no upload:", error);
        return { error: "Falha ao processar o produto." };
    }
}