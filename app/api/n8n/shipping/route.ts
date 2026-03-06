import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const REGIOES = {
    NORTE: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
    NORDESTE: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
    CENTRO_OESTE: ["DF", "GO", "MT", "MS"],
    SUDESTE: ["ES", "MG", "RJ", "SP"],
    SUL: ["PR", "RS", "SC"],
};

function getRegiao(uf: string) {
    for (const [regiao, ufs] of Object.entries(REGIOES)) {
        if (ufs.includes(uf.toUpperCase())) return regiao;
    }
    return "DESCONHECIDO";
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const instance = searchParams.get("instance");
        const destinoCep = searchParams.get("cep")?.replace(/\D/g, ""); // Apenas números

        if (!instance) {
            return NextResponse.json({ error: "O parâmetro 'instance' é obrigatório." }, { status: 400 });
        }

        if (!destinoCep || destinoCep.length !== 8) {
            return NextResponse.json({ error: "CEP de destino inválido." }, { status: 400 });
        }

        // 1. Busca configurações do Agente
        const agentContext = await prisma.agentContext.findUnique({
            where: { whatsappInstance: instance },
            select: { storeCep: true, baseShippingPrice: true },
        });

        if (!agentContext) {
            return NextResponse.json({ error: "Instância não encontrada no banco." }, { status: 404 });
        }

        const origemCep = agentContext.storeCep?.replace(/\D/g, "");
        const basePrice = agentContext.baseShippingPrice ?? 0;

        if (!origemCep || origemCep.length !== 8) {
            return NextResponse.json(
                { text: "Desculpe, a loja não cadastrou um CEP de origem válido para cálculo de frete." },
                { status: 200 }
            );
        }

        // 2. Consulta ViaCEP do Destino
        const destinoRes = await fetch(`https://viacep.com.br/ws/${destinoCep}/json/`);
        const destinoData = await destinoRes.json();

        if (destinoData.erro) {
            return NextResponse.json(
                { text: `Desculpe, não consegui encontrar o CEP ${destinoCep}. Pode verificar se está certinho?` },
                { status: 200 }
            );
        }

        // 3. Consulta ViaCEP da Origem
        const origemRes = await fetch(`https://viacep.com.br/ws/${origemCep}/json/`);
        const origemData = await origemRes.json();

        if (origemData.erro) {
            return NextResponse.json(
                { text: "Falha ao calcular rota: CEP da loja parece estar inválido." },
                { status: 200 }
            );
        }

        // 4. Lógica Básica de Preço e Prazo
        const ufOrigem = origemData.uf;
        const ufDestino = destinoData.uf;

        let adicional = 0;
        let prazo = 0;

        if (ufOrigem === ufDestino) {
            // Mesmo estado
            adicional = 10;
            prazo = 3;
        } else if (getRegiao(ufOrigem) === getRegiao(ufDestino)) {
            // Mesma região
            adicional = 25;
            prazo = 7;
        } else {
            // Regiões diferentes
            adicional = 50;
            prazo = 12;
        }

        const precoFinal = basePrice + adicional;

        // Texto otimizado para a IA ler e formatar (ou enviar direto)
        const respostaFormatada = `Cálculo de Frete concluído para ${destinoData.localidade}/${destinoData.uf} (Bairro: ${destinoData.bairro || 'Centro'}). ` +
            `O valor estimado do frete é R$ ${precoFinal.toFixed(2).replace('.', ',')} com prazo de entrega de aproximadamente ${prazo} dias úteis via Transportadora Padrão.`;

        return NextResponse.json({ text: respostaFormatada }, { status: 200 });

    } catch (error) {
        console.error("Erro no cálculo de frete:", error);
        return NextResponse.json({ error: "Erro interno ao calcular frete." }, { status: 500 });
    }
}
