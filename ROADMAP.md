# Roadmap do Pede Barra

## Feito
- **1.1 Estrutura:** projeto criado, cores e fonte da marca, logo, página "em breve".

## Em andamento
- **Página da loja e compra até o carrinho:** em construção no ramo `etapa-loja-carrinho`. Prontos e testados: dados de exemplo, contas do carrinho, horários, busca e cores. Escritos mas ainda não testados no navegador: peças visuais e tela do produto. Faltam: página da loja, tela do carrinho, lista das lojas e validação. Detalhes em `CONTINUAR.md`.

## Próximas etapas da Fase 1
- **Tela inicial:** endereço, busca, categorias, banner do cupom BEMVINDO, Loja do mês, lojas próximas.
- **Instalar no celular (PWA):** ícone na tela inicial e tela de abertura.

## Fases seguintes
- **Fase 2:** cadastro de loja bem simples e painel do comerciante: pedidos com aviso sonoro, produtos pelo celular, importação por planilha, cor, logo e capa.
- **Fase 3:** login do cliente, pedidos em tempo real, pagamento Pix e acompanhamento do pedido.
- **Fase 4:** entregas com entregadores cadastrados no Pede Barra (ainda não iniciada; veja "Entregas" abaixo).
- **Fase 5:** admin com cobrança dos planos, cupons, avaliações, notificações e lançamento na cidade.

## Fora do app (materiais para visitar as lojas)
- **Feito:** protótipo das telas, logo e ícones das categorias, site para parceiros, slides e vídeo de apresentação. Tudo em `materiais/`.
- **Falta:** gravar a narração do vídeo (texto em `materiais/video/narracao.md`).

## Entregas: decisões aprovadas em 12/11/2026
Só registradas. A implementação fica para a Fase 4.

**Decidido**
- As entregas são feitas por entregadores cadastrados no Pede Barra.
- Taxa fixa de R$ 7,00 por pedido, inteira para o entregador.
- R$ 7,00 é o preço inicial. Nas primeiras entregas, observar se funciona também nos trajetos mais longos dentro da área urbana.
- Atendimento somente na área urbana de Barra do Ribeiro, sem entregas no interior.
- Os planos e as comissões dos comerciantes não mudam.

**Fluxo proposto**
1. A loja confirma o pedido.
2. O app avisa os entregadores disponíveis.
3. O aviso mostra o valor a receber.
4. Cada entrega só pode ser aceita por um entregador.

**Pendente (decidir antes de começar a Fase 4)**
- Delimitação da área atendida.
- Forma de repasse ao entregador.
- O que fazer quando ninguém aceitar a entrega.
