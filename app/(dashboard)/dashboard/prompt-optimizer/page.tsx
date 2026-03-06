import { getOptimizationHistory } from "./actions";
import { OptimizerClient } from "./optimizer-client";

export const metadata = {
    title: "Otimizador de Prompts | World Fantasy",
    description: "Auditoria e otimização autônoma de System Prompts com IA.",
};

export default async function PromptOptimizerPage() {
    // Busca o histórico do usuário no lado do servidor
    const history = await getOptimizationHistory();

    return <OptimizerClient initialHistory={history} />;
}