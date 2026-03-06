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

export async function updateProduct(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Não autorizado." };

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const file = formData.get("image") as File | null;
    const existingImageUrl = formData.get("existingImageUrl") as string | null;

    if (!id || !name || !price) return { error: "Preencha todos os campos obrigatórios." };

    // Verifica se o produto pertence ao usuário
    const product = await prisma.product.findFirst({
        where: { id, userId: session.user.id },
    });
    if (!product) return { error: "Produto não encontrado." };

    try {
        let imageUrl = existingImageUrl;

        // Só faz upload se um novo arquivo foi enviado
        if (file && file.size > 0) {
            const blob = await put(`produtos/${Date.now()}-${file.name}`, file, {
                access: "public",
            });
            imageUrl = blob.url;
        }

        await prisma.product.update({
            where: { id },
            data: { name, description, price, imageUrl },
        });

        revalidatePath("/dashboard/catalog");
        return { success: "Produto atualizado!" };
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        return { error: "Falha ao atualizar o produto." };
    }
}

export async function deleteProduct(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Não autorizado." };

    const product = await prisma.product.findFirst({
        where: { id: productId, userId: session.user.id },
    });
    if (!product) return { error: "Produto não encontrado." };

    try {
        await prisma.product.delete({ where: { id: productId } });
        revalidatePath("/dashboard/catalog");
        return { success: "Produto excluído!" };
    } catch (error) {
        console.error("Erro ao excluir:", error);
        return { error: "Falha ao excluir o produto." };
    }
}