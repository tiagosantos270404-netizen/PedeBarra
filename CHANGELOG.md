# Atualizações

## 12/11/2026 — Loja e carrinho: telas conectadas e demonstração concluída
- A página "em breve" foi substituída pela lista das três lojas de exemplo.
- Páginas de loja com cores próprias, horários, busca, destaques, categorias, produtos e favoritos.
- Carrinho com edição de complementos, quantidade, remoção, troca de loja confirmada, entrega a R$ 7,00 e retirada grátis.
- Conferência de loja fechada, produtos esgotados e preços alterados antes da conclusão demonstrativa.
- Ajustes de contraste e espaço dos botões, inclusive em telas pequenas.
- Passaram lint, tipos, 46 testes de regras, build e roteiro de navegador. Instruções em `VALIDACAO.md`.
- Sem publicação do app, cobrança real ou alteração do ramo principal.


## 12/11/2026 — Página da loja e carrinho: primeira parte (ainda sem telas)
- Criadas as três lojas de exemplo: Léo, um mercado e uma farmácia só com higiene e beleza. Produtos, preços e horários são demonstrativos.
- Prontas e testadas as regras: contas do carrinho, complementos obrigatórios e limites, entrega a R$ 7,00 e retirada grátis, uma loja por pedido, recuperação do carrinho salvo, loja aberta ou fechada e busca.
- Escritas, mas ainda não testadas no navegador: ícones, ilustrações no lugar das fotos, tela do produto, barra do carrinho e favoritar.
- Ainda não dá para usar pelo app: faltam a página da loja, a tela do carrinho e a lista das lojas. O passo a passo para continuar está em `CONTINUAR.md`.
- Nada foi publicado.

## 12/11/2026 — Planejamento da página da loja e do carrinho
- Especificação da etapa consolidada em `PROMPT-LOJA.md`: página da loja, produtos com complementos, carrinho e demonstração.
- Decisões novas: retirada grátis, sem pedido mínimo, sem avaliações por enquanto, destaques escolhidos pela loja, farmácia de exemplo sem medicamentos.
- Nada foi programado ainda.

## 12/11/2026 — Decisões sobre as entregas
- Entregas feitas por entregadores cadastrados no Pede Barra, com taxa fixa de R$ 7,00 por pedido, inteira para o entregador.
- Atendimento só na área urbana de Barra do Ribeiro.
- Fluxo proposto: a loja confirma, os entregadores disponíveis são avisados com o valor a receber, e só um aceita cada entrega.
- Nada foi programado ainda. Ficam pendentes a delimitação da área, o repasse ao entregador e o que fazer quando ninguém aceitar.

## 12/11/2026 — Materiais de apresentação e regras do negócio
- Guardados na pasta `materiais/`: protótipo das telas, site para parceiros, slides, vídeo e texto da narração.
- Valores fechados: R$ 89,90 por mês ou comissão de 5% (mercados e farmácias) e 6% (restaurantes, lancherias e lojas gerais).
- Promoção de lançamento: 1 mês grátis para as 5 primeiras lojas.
- Sem taxa de adesão; montagem da loja a combinar conforme a quantidade de produtos.
- Instruções do projeto (`CLAUDE.md`) atualizadas com essas regras e com o que ainda falta decidir.

## 31/10/2026 — Etapa 1.1: o projeto nasceu
- Criado o projeto do app (Next.js, que vira app de celular sem precisar das lojas de apps).
- Cores, fonte (Plus Jakarta Sans) e logo do Pede Barra configurados.
- Página provisória "em breve" com o slogan, as categorias e um chamado para comerciantes.
- Ícone do Pede Barra aparece na aba do navegador.
