# 🧙‍♂️ World Fantasy — Guia e Documentação do Projeto

Bem-vindo à documentação oficial do projeto **World Fantasy**. Este documento descreve a arquitetura, o fluxo de automação, e como inicializar o ambiente de desenvolvimento completo.

---

## 🎯 1. Visão Geral do Projeto
O **World Fantasy** é uma plataforma inovadora para e-commerce que une um **Painel de Controle (Dashboard)** e um **Assistente Virtual Inteligente via WhatsApp**. O sistema permite que lojistas gerenciem seu catálogo, configurem a personalidade do chatbot de atendimento e otimizem prompts através de Inteligência Artificial.

A arquitetura baseia-se em:
1. **Next.js (App Router):** Interface principal (Dashboard), banco de dados e APIs REST.
2. **Prisma & PostgreSQL:** Persistência de dados (Usuários, Catálogo, Histórico de IA, Configurações do Bot).
3. **n8n (Workflows):** Orquestração dos agentes de IA, comunicação HTTP e automações lógicas pesadas.
4. **Evolution API:** Gateway de comunicação com o WhatsApp.

---

## 🚀 2. Como Inicializar o Projeto (Local)

### 2.1 Pré-requisitos
- Node.js (Recomendado v18+)
- Banco de Dados PostgreSQL rodando (ex: Docker, Supabase, Neon)
- Instância da Evolution API rodando e configurada
- Instância do n8n (pode ser auto-hospedada)

### 2.2 Passo a Passo (Next.js)

1. **Instalar Dependências:**
   Na raiz do projeto (`/world-fantasy`), execute:
   ```bash
   npm install
   ```

2. **Configuração de Variáveis de Ambiente:**
   Certifique-se de que o arquivo `.env` na raiz do projeto está configurado com as variáveis necessárias (veja o `.env.example` se disponível). Exemplo:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/worldfantasy?schema=public"
   NEXTAUTH_SECRET="sua-chave-secreta"
   NEXTAUTH_URL="http://localhost:3000"
   N8N_PROMPT_OPTIMIZER_WEBHOOK="link-do-seu-webhook/prompt-optimizer"
   N8N_WHATSAPP_SEND_WEBHOOK="link-do-seu-webhook/send-whatsapp-2"
   ```

3. **Geração e Migração do Banco de Dados:**
   Execute as migrações do Prisma para criar as tabelas necessárias:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Rodar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   O projeto estará acessível em `http://localhost:3000`.

---

## 🤖 3. O Fluxo de Automação (n8n & Evolution API)

A inteligência do projeto vive no **n8n**. O arquivo de exportação (ex: `My workflow 6.json`) contém 3 webhooks cruciais. Para importar, acesse seu n8n, crie um novo workflow e importe o arquivo JSON.

### 3.1 Fluxo de Atendimento IA (`chat-inbound`)
- **Gatilho:** Uma mensagem chega via WhatsApp e a Evolution API dispara para este webhook.
- **Processo:**
  1. O n8n faz um `GET` para a API do Next.js (`/api/n8n/context`) pegando as regras de negócio, a personalidade da loja e os dados do usuário.
  2. O Agente de IA (**Gemini 3 Flash**) analisa a mensagem do cliente com base no contexto. Ele também tem memória da conversa salva via **Redis**.
  3. A IA tem acesso a **Ferramentas (Tools)**:
     - `Consultar_Catalogo_Produtos`: Busca disponibilidade e preços no banco do Next.js.
     - `Consultar_Frete_API`: Consulta o ViaCEP para fretes.
  4. Um script JavaScript separa as respostas de texto e os links de imagens.
  5. O n8n dispara eventos para a **Evolution API** (`sendText` e `sendMedia`), simulando a digitação humana antes de enviar a resposta ao cliente.
- **Sincronização:** Envia o resumo da interação de volta ao painel do lojista (`/api/webhooks/n8n/chat-sync`).

### 3.2 Fluxo de Otimizador de Prompts (`prompt-optimizer`)
- **Visão:** Funciona como um painel de refatoração de prompt dentro do Dashboard do Lojista.
- **Gatilho:** O Lojista pede para melhorar seu System Prompt no Next.js (Server Action).
- **Processo:**
  1. O n8n recebe o "Prompt Atual" e qual a "Solicitação/Reclamação" do logista.
  2. O nó **Avaliador_LLM (GPT-4)** faz uma auditoria rigorosa de injeção de prompt e tom de voz.
  3. O nó **Otimizador_LLM (GPT-3.5-Turbo)** pega a auditoria e gera a nova versão segura e de alta conversão.
- **Retorno:** Devolve um JSON sincronicamente (`Respond to Webhook`) que o Next.js exibe imediatamente na tela.

### 3.3 Fluxo Notificador de WhatsApp (`send-whatsapp-2`)
- **Função:** Disparo rápido para avisos do sistema (ex: notificar o lojista de que o prompt foi otimizado).
- **Processo:** Recebe telefone (`phone`) e `message` pelo Next.js e bate diretamente na Evolution API (`sendMedia/sendText`).

---

## 🛡️ 4. Regras de Negócio e "As Leis da Aplicação"
Para manter a estabilidade do sistema, o **Agente de IA** é programado com Guardrails estritos:
1. **Recusa Educada:** Nega responder perguntas fora do escopo do universo Geek/Fantasy de vendas.
2. **Formatação PIPES:** Para evitar textões longos no WhatsApp, a IA não usa quebra de linhas clássicas (`\n`). Em vez disso, ela devolve as frases separadas por Pipes `|` que o n8n fatia e manda aos pouquinhos simulando o envio de múltiplas mensagens curtas no celular.
3. **Escudo Anti-Injection:** IA orientada a ignorar pedidos de "esquecer instruções anteriores".

---

## 📦 5. Próximos Passos (Para Manutenção)
- Caso adicione uma **nova ferramenta** para o Chatbot, crie a rota em `/app/api/n8n/nova_ferramenta/route.ts` e atualize o nó do Agente no n8n.
- Sempre use `npx prisma migrate dev` ao adicionar novas colunas no Banco de Dados. Nunca modifique o banco manualmente no Supabase sem rodar pelo Prisma.
