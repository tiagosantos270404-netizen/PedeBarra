# Prompt: página da loja

> Rascunho em construção. O Tiago vai acrescentando ideias na seção "Ideias novas" e respondendo "Falta decidir". Só começar a programar quando ele disser que o prompt está fechado.

## O pedido

Construa a **página da loja** do app do cliente do Pede Barra: a tela que abre quando o cliente toca numa loja. Ela precisa funcionar de verdade até o carrinho, com o Léo Restaurante & Lancheria como primeira loja. Siga o `CLAUDE.md` (identidade visual, regras do negócio e jeito de trabalhar) e use `materiais/prototipo/Loja.dc.html` como referência do visual.

## Referência: iFood

O Tiago quer a loja e o app funcionando no estilo do iFood (https://www.ifood.com.br/). Use o iFood como referência de **como funciona**: a ordem das informações, o jeito de escolher adicionais, a sacola. **Não copie** o visual dele: cores, logo, ícones, ilustrações e textos são do Pede Barra, conforme o `CLAUDE.md`.

O que trazer do jeito iFood de funcionar:

- **Cabeçalho da loja** com nota, pedido mínimo, tempo e taxa de entrega, e um "ver mais" com horário, endereço e formas de pagamento.
- **Entrega ou retirada:** o cliente escolhe no topo da loja.
- **Busca dentro da loja**, para achar um produto pelo nome.
- **Destaques:** uma fileira de produtos em evidência, que rola de lado, antes do cardápio.
- **Seções do cardápio** numa barra que fica presa no topo enquanto o cliente rola.
- **Produto com foto à direita**, nome, descrição e preço. Preço promocional mostra o valor antigo riscado.
- **Tela do produto com complementos em grupos:** cada grupo diz se é obrigatório ou opcional e quantos itens dá para escolher (ex.: "Escolha 1 molho", "Adicionais, até 5"). O total atualiza na hora.
- **Sacola de uma loja só:** se o cliente tentar adicionar item de outra loja, o app pergunta se quer esvaziar a sacola.
- **Loja fechada** aparece com aviso e horário em que abre.
- **Favoritar a loja** com um toque.

Tudo isso está marcado como proposta em "Falta decidir" quando depende de uma decisão do Tiago.

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

Onde diz "proposta", é o jeito que o iFood faz. Vale se o Tiago confirmar.

1. **Cardápio do Léo:** quais são os itens, as seções e os preços reais?
2. **Adicionais e opções:** proposta: grupos de complementos, obrigatórios ou opcionais, com extras pagos.
3. **Produto em falta:** proposta: continua aparecendo, apagado e marcado como "esgotado".
4. **Pedido mínimo:** proposta: cada loja define o seu, e a sacola avisa quanto falta.
5. **Retirar na loja:** proposta: o cliente pode retirar e não paga a taxa de entrega.
6. **Loja fechada:** proposta: mostra o cardápio, mas não deixa pedir. Sem agendamento por enquanto.
7. **Busca dentro da loja:** proposta: entra já nesta etapa.
8. **Farmácia:** remédio que exige receita fica fora do app?
9. **Avaliações:** proposta: a nota aparece no cabeçalho. Loja nova mostra "Novo" até ter avaliações.
10. **Destaques:** quem escolhe os produtos em destaque: a loja, ou o app pelos mais vendidos?

## Ideias novas

(vazio por enquanto)
