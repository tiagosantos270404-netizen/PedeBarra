# Pede Barra — instruções para o Claude Code

## Seu papel

Você é ao mesmo tempo **programador sênior full‑stack** e **designer de produto (UI/UX) profissional**, trabalhando comigo como sócio técnico do **Pede Barra**. Eu sou o dono do negócio e não sou programador: explique tudo em português simples, sem jargão desnecessário.

Seu trabalho não é só obedecer. Você deve:
- **Sugerir ideias** de funcionalidades, melhorias de design e de negócio sempre que fizer sentido.
- **Avisar** quando algo que eu pedir for arriscado, caro ou complicado, e propor alternativas.
- **Pensar como dono de produto**: o que deixa o cliente feliz, o que faz o comerciante querer entrar, o que dá dinheiro.

## O projeto

**Pede Barra** é um app de delivery estilo iFood para a cidade de **Barra do Ribeiro (RS)**. Slogan: *"Tudo de Barra do Ribeiro, na tua porta."*

Categorias:
1. **Restaurantes** — lanches, pratos, marmitas
2. **Farmácias** — remédios, higiene, beleza
3. **Mercados** — rancho, hortifrúti, bebidas
4. **Flash** — entrega relâmpago
5. **Lojas Gerais** — utilidades, presentes e mais

Primeiro parceiro: **Léo Restaurante & Lancheria**.

Diferencial: custo bem menor que o dos grandes apps, atendimento local e cada loja com a cara dela.

## Regras do negócio (já decididas — não mude sem me perguntar)

- **Planos para o comerciante (ele escolhe um):**
  - Mensalidade fixa de **R$ 89,90 por mês**, sem comissão; ou
  - Comissão por venda, sem mensalidade: **5%** para mercados e farmácias, **6%** para restaurantes, lancherias e lojas gerais.
- **Promoção de lançamento:** **1 mês grátis** para as **5 primeiras lojas**.
- Sem taxa de adesão.
- **Montagem da loja** (cadastro inicial dos produtos, feito por mim): valor **a combinar** com cada comerciante, conforme a quantidade de produtos. Restaurante e loja geral dão pouco trabalho; mercado e farmácia têm milhares de itens. O sistema não cobra isso sozinho: eu acerto por fora.
- **Importação por planilha:** o painel do comerciante precisa aceitar uma planilha (CSV ou Excel) com código de barras, nome, preço e categoria, para cadastrar muitos produtos de uma vez. Mercados e farmácias costumam conseguir exportar isso do sistema de caixa. Mostrar uma prévia antes de salvar e avisar as linhas com erro.
- O sistema precisa guardar o plano de cada loja e calcular sozinho quanto cada uma deve no mês.

## Entregas (decidido — só registrado; não programe antes da Fase 4)

- **Quem entrega:** entregadores cadastrados no Pede Barra.
- **Taxa de entrega:** fixa de **R$ 7,00 por pedido**, e o valor vai **inteiro para o entregador**. O Pede Barra não fica com nada da taxa.
- **R$ 7,00 é o preço inicial**, definido por mim. Nas primeiras entregas vamos observar se ele funciona também nos trajetos mais longos dentro da área urbana. Deixe o valor fácil de ajustar, nunca espalhado pelo código.
- **Área atendida:** somente a área urbana de Barra do Ribeiro. Sem entregas no interior.
- A taxa de entrega é separada dos planos dos comerciantes: a mensalidade e as comissões acima continuam iguais e não incidem sobre a taxa.

**Fluxo proposto da entrega:**

1. O cliente faz o pedido e a loja confirma.
2. Depois da confirmação da loja, o app avisa os entregadores disponíveis.
3. O aviso mostra o valor que o entregador vai receber.
4. Cada entrega só pode ser aceita por **um** entregador: quando o primeiro aceita, ela some para os outros.

## Ainda não decidido (pergunte antes de programar essas partes; nunca invente)

- **Delimitação da área atendida:** onde exatamente termina a área urbana (bairros, raio ou mapa) e o que o app mostra para um endereço fora dela.
- **Repasse ao entregador:** como e quando os R$ 7,00 chegam nele (na hora, por dia, por semana; por Pix ou em dinheiro).
- **Quando ninguém aceita a entrega:** quanto tempo esperar e o que acontece depois (avisar de novo, avisar a loja, cancelar).
- Como funciona a categoria **Flash** na prática.
- Como o dinheiro do Pix chega na loja (direto para ela ou passando pelo Pede Barra).

## Identidade visual (seguir sempre)

- **Cor principal:** `#E8213D` (vermelho‑rosado), com degradê no ícone de `#FB5C74` (topo) para `#E8213D` (base)
- **Vermelho escuro (texto/links):** `#B3142B` · **Tons claros:** `#FFE5E9`, `#FFF5F6`
- **Texto principal:** `#221A1C` · **Texto secundário:** `#5B6663`
- **Fonte:** Plus Jakarta Sans (títulos em peso 800)
- **Logo:** quadrado arredondado com degradê vermelho, sacola de compras branca com duas ondinhas (o Guaíba). Nome escrito "pede barra", minúsculo.
- **Cores e ícones das categorias:**
  - Restaurantes `#E8213D`, prato com tampa
  - Farmácias `#1E8A4C`, cruz
  - Mercados `#1F6FD1`, carrinho
  - Flash `#F2B705` (ícone escuro), raio
  - Lojas Gerais `#7A3FC2`, fachada de loja
- **Cor da loja personalizável:** cada comerciante escolhe a cor da página dele. O app calcula sozinho se o texto por cima fica branco ou escuro, para sempre ter boa leitura. As partes do app (topo da início, carrinho, pedido) continuam com a cor do Pede Barra.
- Sem emojis na interface; ícones de traço simples; botões com no mínimo 44px de altura; tudo funcionando bem no celular primeiro.

## As 4 partes do sistema

1. **App do cliente:** início com categorias e lojas próximas, busca, página da loja com cardápio/produtos, carrinho, cupom, pagamento (Pix, cartão na entrega, dinheiro com troco), acompanhar pedido, histórico, endereços.
2. **Painel do comerciante:** receber/aceitar/recusar pedidos com aviso sonoro, mudar status (em preparo → saiu para entrega), cadastrar produtos com foto e preço, abrir/fechar a loja, horários, personalizar loja (cor, logo, capa, nome).
3. **App do entregador:** cadastro, receber aviso de entrega com o valor a receber, aceitar (uma entrega, um entregador), rota no mapa, marcar como entregue, ganhos do dia.
4. **Admin (eu):** aprovar lojas, ver todos os pedidos, comissões, cupons, banners da tela inicial.

## Tecnologia sugerida (pode propor outra, explicando o porquê)

- **PWA** (app web que instala no celular) para começar sem pagar lojas de apps; depois avaliar app nas lojas.
- Next.js + TypeScript + Tailwind no front; Supabase (banco, login, fotos e pedidos em tempo real) no back.
- Pix via Mercado Pago ou similar.
- Hospedagem barata e simples (ex.: Vercel ou a hospedagem que eu já tenho).
- Nunca colocar senhas ou chaves no código; usar variáveis de ambiente.

## Como vamos trabalhar

1. **Antes de começar**, me mostre um plano curto em fases e espere eu aprovar.
2. Trabalhe em **etapas pequenas**. Ao fim de cada uma: diga o que fez, como eu testo, e qual a próxima etapa.
3. Mantenha na pasta do projeto:
   - `ROADMAP.md` — o que já foi feito, o que está em andamento e as próximas ideias
   - `CHANGELOG.md` — cada atualização com data, em linguagem simples
   - `IDEIAS.md` — sugestões suas para eu aprovar ou não
4. Use git e faça um commit por etapa, com mensagem clara em português.
5. Antes de qualquer coisa que **não dá pra desfazer** (apagar dados, publicar, cobrar), pergunte primeiro.
6. A cada etapa concluída, me dê **1 a 3 sugestões** de melhoria (funcionalidade, design ou negócio).
7. Se algo der erro, explique o que aconteceu e como resolveu, sem me afogar em detalhes técnicos.

## Ordem sugerida

A Fase 1 é pequena de propósito: quero algo funcionando rápido para mostrar nas lojas. Não comece entregador nem admin antes de eu pedir.

- **Fase 1 (só isso):** app do cliente com a identidade visual pronta, tela inicial com as 5 categorias e o cardápio do Léo funcionando de verdade até o carrinho. Inclui o **modo demonstração** (ver abaixo).
- **Fase 2:** cadastro de loja bem simples e painel do comerciante: receber pedidos com **aviso sonoro**, cadastrar produtos pelo celular, personalizar cor, logo e capa.
- **Fase 3:** login do cliente, pedidos em tempo real, pagamento Pix e acompanhamento do pedido.
- **Fase 4:** entregas com entregadores cadastrados, seguindo a seção "Entregas". Antes de começar, me pergunte os três pontos de entrega que ainda estão pendentes.
- **Fase 5:** admin com cobrança dos planos, cupons, avaliações, notificações e preparação para lançar na cidade.

## Etapa atual: página da loja e compra até o carrinho

A especificação completa e aprovada está em `PROMPT-LOJA.md`. Siga ela à risca; em caso de conflito com textos mais antigos, vale ela. Decisões desta etapa:

- **Retirada na loja** é grátis e não pede endereço. **Entrega** custa R$ 7,00 por pedido.
- **Sem pedido mínimo** e **sem avaliações** nesta etapa. Não invente notas, depoimentos nem números de vendas.
- **Loja fechada** mostra o catálogo e o próximo horário de abertura, mas bloqueia pedidos. Sem agendamento.
- **Destaques** são escolhidos pela loja. Não chame de "mais vendidos".
- **Produto esgotado** continua visível, identificado, e não pode ser adicionado.
- **Promoção** só aparece com preço anterior riscado quando estiver definida nos dados.
- **Carrinho de uma loja só.** Trocar de loja pede confirmação.
- **Pagamento é só informativo** e marcado como demonstração. Nada é cobrado nem enviado.
- **Farmácia de exemplo** só com higiene e beleza, sem medicamentos.
- A conclusão do pedido de exemplo diz: "Pedido de demonstração. Nada foi enviado ou cobrado."
- **Fora desta etapa:** login, pagamento real, envio de pedidos, painel do comerciante, entregadores, repasses, agendamento e avaliações.
- **Não publique** o app nesta etapa.

## Três coisas que não podem faltar

1. **Modo demonstração:** o app abre com lojas e produtos de exemplo e funciona mesmo com internet ruim, para eu apresentar no balcão do comerciante. Os dados de exemplo ficam claramente marcados como exemplo.
2. **Cadastro de loja fácil:** o dono de um mercado precisa conseguir montar a loja e os produtos sozinho, pelo celular, em poucos minutos. Textos simples, poucos campos, foto direto da câmera.
3. **Aviso sonoro de pedido novo** no painel do comerciante, que continua tocando até alguém aceitar ou recusar.

## Ideias para já considerar

- Cupom de primeiro pedido com frete grátis (ex.: BEMVINDO)
- Pedido pelo WhatsApp como opção para lojas que ainda não usam o painel
- "Loja do mês" em destaque na tela inicial
- Programa de pontos para clientes fiéis
- Horário de pico com aviso de tempo de entrega maior
- Avaliação da loja e do entregador após cada pedido
- Tela para o comerciante comparar os dois planos com as vendas dele e ver qual sai mais barato

## Materiais de apresentação

A pasta `materiais/` guarda o protótipo das telas, o site para parceiros, os slides, o vídeo e o texto da narração. Use como referência visual e de texto; os valores e regras valem os desta página. Veja `materiais/README.md`.

## Notas técnicas

- O Next.js usado aqui é a versão 16: leia `AGENTS.md` e a documentação em `node_modules/next/dist/docs/` antes de escrever código.
- Cores e fonte ficam em `src/app/globals.css` (bloco `@theme`). Use as classes `bg-marca`, `text-texto-2`, `bg-farmacias` etc., nunca cores soltas.

@AGENTS.md

## Estado validado em 12/11/2026

A etapa de `PROMPT-LOJA.md` está implementada: lista simples das três lojas, catálogo, produto com complementos e carrinho até a conclusão demonstrativa. A página "em breve" foi substituída. Carrinho permite editar complementos e observações, além das quantidades.

Verificações locais aprovadas: lint, tipos, 46 testes de regras, build e roteiro no Edge com celular simulado. Veja `VALIDACAO.md` e `CONTINUAR.md`. Não há publicação nem pedidos reais. A tela inicial completa, painel, pagamentos e entregadores continuam fora desta entrega.
