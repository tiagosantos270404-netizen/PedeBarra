# Prompt: página da loja

> Rascunho em construção. O Tiago vai acrescentando ideias na seção "Ideias novas" e respondendo "Falta decidir". Só começar a programar quando ele disser que o prompt está fechado.

## O pedido

Construa a **página da loja** do app do cliente do Pede Barra: a tela que abre quando o cliente toca numa loja. Ela precisa funcionar de verdade até o carrinho, com o Léo Restaurante & Lancheria como primeira loja. Siga o `CLAUDE.md` (identidade visual, regras do negócio e jeito de trabalhar) e use `materiais/prototipo/Loja.dc.html` como referência do visual.

## O que o cliente vê

1. **Topo da loja:** foto de capa (ou a cor da loja, se não tiver foto), logo, nome e tipo de comércio.
2. **Situação:** aberta ou fechada agora, com o horário. Loja fechada aparece, mas não deixa pedir.
3. **Informações rápidas:** tempo estimado, taxa de entrega de R$ 7,00 e formas de pagamento aceitas.
4. **Seções do cardápio:** abas que rolam de lado (ex.: Xis, Porções, Pratos, Bebidas). Tocar numa aba leva até a seção.
5. **Produtos:** nome, descrição curta, preço e foto quando tiver. Botão "+" grande para adicionar.
6. **Detalhe do produto:** abre ao tocar no produto, com foto maior, descrição completa, quantidade e campo de observação (ex.: "sem cebola").
7. **Barra do carrinho:** fixa embaixo, com quantidade de itens e total. Só aparece quando tem algo no carrinho.

## Cor da loja

- Cada loja tem a própria cor. Ela pinta o topo, os botões "+", as etiquetas e a barra do carrinho.
- O app calcula sozinho se o texto por cima fica branco ou escuro.
- As partes do Pede Barra (menu de baixo, carrinho, pedido) continuam no vermelho da marca.

## Dados

- Léo Restaurante & Lancheria com o cardápio real, quando o Tiago enviar. Até lá, itens de exemplo marcados como exemplo.
- Mais duas lojas de exemplo (uma farmácia e um mercado) para testar a página com outro tipo de produto e outra cor.
- Tudo funciona no **modo demonstração**: abre sem login e com internet ruim.

## Fora desta etapa

- Login, pagamento de verdade e acompanhamento do pedido.
- Painel do comerciante e cadastro de produtos.
- Entregadores (Fase 4).

## Como entregar

- Em etapas pequenas, me mostrando cada uma e dizendo como testar no celular.
- Atualizar `ROADMAP.md` e `CHANGELOG.md` e fazer um commit por etapa.
- No fim de cada etapa, de 1 a 3 sugestões de melhoria.

## Falta decidir

1. **Cardápio do Léo:** quais são os itens, as seções e os preços reais?
2. **Adicionais e opções:** o produto vai ter extras pagos (bacon, ovo, queijo) e escolhas (tamanho, ponto da carne)?
3. **Produto em falta:** aparece como "esgotado" ou some do cardápio?
4. **Pedido mínimo:** a loja pode exigir um valor mínimo para entrega?
5. **Retirar na loja:** o cliente pode buscar o pedido e não pagar a taxa de entrega?
6. **Loja fechada:** só mostra o cardápio, ou deixa agendar o pedido para quando abrir?
7. **Mercado e farmácia:** com muitos produtos, precisa de busca dentro da loja. Entra agora ou depois?
8. **Farmácia:** remédio que exige receita fica fora do app?
9. **Avaliações:** a nota da loja aparece nesta tela desde o começo?

## Ideias novas

(vazio por enquanto)
