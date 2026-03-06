// app/dashboard/catalog/catalog-client.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Image as ImageIcon, Loader2, Package } from "lucide-react";
import Image from "next/image";
import { createProduct } from "./actions"; // A Server Action que criamos no passo anterior

// Tipagem baseada no schema do Prisma
type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    isActive: boolean;
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function CatalogClient({ initialProducts }: { initialProducts: Product[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Tratamento visual para o upload da imagem no formulário
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAction = async (formData: FormData) => {
        setIsPending(true);
        const result = await createProduct(formData);

        if (result.success) {
            setIsModalOpen(false);
            setPreviewUrl(null);
        } else {
            alert(result.error); // Em produção, usaríamos um Toast nativo estiloso aqui
        }
        setIsPending(false);
    };

    return (
        <>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                >
                    <Plus className="w-5 h-5" />
                    Novo Produto
                </button>
            </div>

            {initialProducts.length === 0 ? (
                <div className="glass p-16 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-xl font-bold text-white tracking-tight">Seu catálogo está vazio</p>
                    <p className="text-gray-400 max-w-md">
                        Adicione o primeiro produto (ex: Action Figures, Fantasias) para que a IA comece a recomendá-lo nas conversas.
                    </p>
                </div>
            ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {initialProducts.map((product) => (
                        <motion.div key={product.id} variants={cardVariant} className="glass rounded-2xl overflow-hidden border border-white/10 group cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="relative h-56 w-full bg-black/50 overflow-hidden">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ImageIcon className="w-10 h-10 text-gray-700" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <h3 className="text-white font-bold text-lg truncate drop-shadow-md">{product.name}</h3>
                                    <span className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-bold shadow-xl">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Modal de Criação (Backdrop Animado + Glass Modal) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass relative w-full max-w-lg rounded-3xl border border-white/10 p-8 shadow-2xl z-10"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Novo Produto</h2>

                            <form action={handleAction} className="space-y-5">
                                {/* Upload de Imagem Visual */}
                                <div className="relative h-40 w-full bg-black/40 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
                                    <input type="file" name="image" accept="image/*" required onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                    {previewUrl ? (
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 text-gray-500 mb-2 group-hover:text-primary transition-colors" />
                                            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Clique ou arraste uma foto</span>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nome da Peça</label>
                                    <input name="name" type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all" placeholder="Ex: Fantasia Darth Vader" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Descrição Detalhada</label>
                                    <textarea name="description" required rows={3} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none text-sm" placeholder="Ex: Tamanho M, inclui capa e capacete..." />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preço (R$)</label>
                                    <input name="price" type="number" step="0.01" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all" placeholder="139.90" />
                                </div>

                                <div className="pt-4">
                                    <button disabled={isPending} type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                        {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "Adicionar ao Catálogo"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}