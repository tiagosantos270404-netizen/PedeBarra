# Etapa: página da loja e compra até o carrinho

> Especificação consolidada pelo Tiago em 12/11/2026. Substitui as propostas anteriores deste arquivo quando houver conflito. Antes de alterar o código, confira o que já existe e aproveite as partes prontas.

## Objetivo

Construir a experiência de página da loja e compra até o carrinho, com navegação familiar a quem usa aplicativos como o iFood, mantendo a identidade própria do Pede Barra. Priorize o celular.

## 1. Página da loja

- Capa ou cor personalizada, logo, nome, tipo de comércio e horários.
- Situação aberta ou fechada. Quando fechada, permita consultar o catálogo, mostre o próximo horário de abertura e bloqueie pedidos. Sem agendamento.
- Tempo estimado, entrega por R$ 7,00 e opção de retirada grátis.
- Formas de pagamento apenas informativas e identificadas como demonstrativas, sem cobrança real.
- Sem pedido mínimo e sem avaliações nesta etapa.
- Busca por nome e descrição dentro da loja.
- Destaques escolhidos pela loja. Na demonstração, use uma seleção definida nos dados de exemplo, sem chamar de "mais vendidos".
- Categorias em uma barra horizontal que permanece acessível durante a rolagem, sem sobrepor o conteúdo.
- Adapte categorias ao comércio: não use seções de restaurante no mercado ou na farmácia.

## 2. Produtos e complementos

- Nome, descrição, preço e foto.
- Produto esgotado permanece visível, claramente identificado e sem permitir inclusão.
- Preço anterior riscado somente quando existir uma promoção definida nos dados; não invente descontos.
- Ao abrir um produto, mostre imagem maior, quantidade, observações e grupos de opções ou adicionais.
- Cada grupo deve informar se é obrigatório, quantas opções permite e os custos adicionais.
- Valide seleções obrigatórias e limites antes de adicionar.
- Atualize o valor conforme opções, adicionais e quantidade.
- Para itens com escolhas obrigatórias, o botão "+" deve abrir a seleção.
- No celular, mantenha o botão de adicionar acessível sem cobrir campos ou conteúdo.

## 3. Carrinho

- Uma loja por pedido.
- Ao tentar adicionar de outra loja, peça confirmação para substituir o carrinho. Cancelar preserva os itens anteriores.
- Separe itens com opções ou observações diferentes.
- Permita alterar quantidades, remover produtos e revisar complementos.
- Barra fixa inferior com quantidade e subtotal dos produtos.
- Dentro do carrinho, mostre subtotal, frete e total separadamente.
- Entrega: R$ 7,00 por pedido, somente na área urbana de Barra do Ribeiro.
- Retirada: R$ 0,00 de frete, sem exigir endereço de entrega.
- Não invente bairros, limites geográficos ou validação de cobertura ainda não definida.
- Preserve o carrinho ao recarregar e trate dados salvos inválidos ou desatualizados.
- Confira disponibilidade, preços e situação da loja antes de concluir a simulação.

## 4. Demonstração

- Léo Restaurante & Lancheria como primeira loja, mais um mercado e uma farmácia de exemplo.
- Use produtos e preços claramente demonstrativos enquanto não houver cardápio real do Léo.
- Farmácia com higiene e beleza apenas, sem medicamentos nesta etapa.
- Não invente notas, avaliações, depoimentos ou números de vendas.
- A conclusão deve dizer: "Pedido de demonstração. Nada foi enviado ou cobrado."
- Dados de exemplo disponíveis localmente. Não prometa funcionamento offline completo sem implementá-lo e verificá-lo.
- Favoritar a loja pode entrar como recurso local, sem login, deixando claro que fica salvo apenas naquele navegador.

## 5. Identidade e usabilidade

- Siga cores, fonte, logo e regras visuais do projeto.
- Cor personalizada da loja em sua página; ações gerais e carrinho mantêm a identidade do Pede Barra.
- Boa leitura, contraste adequado e botões com pelo menos 44 px.
- Sem emojis na interface.
- Use textos próprios e imagens autorizadas ou demonstrativas.
- Evite elementos que distraiam da busca e da escolha dos produtos.

## 6. Limites desta etapa

Não implementar login, pagamento real, envio de pedidos, painel do comerciante, entregadores, repasses, agendamento ou avaliações.

Regras futuras já registradas no `CLAUDE.md`: entregadores cadastrados no Pede Barra, taxa fixa de R$ 7,00 integralmente destinada ao entregador e atendimento somente na área urbana. Forma de repasse, delimitação da cobertura e procedimento quando ninguém aceitar continuam pendentes.

## 7. Validação e entrega

Verifique busca, navegação por categorias, complementos obrigatórios, limites de seleção, cálculos, esgotados, loja fechada, troca de loja, recuperação do carrinho e alternância entre entrega e retirada.

Execute as verificações pertinentes do projeto. Atualize `CLAUDE.md`, `ROADMAP.md` e `CHANGELOG.md` para refletir as decisões e o que realmente foi implementado.

Ao terminar, explique o que mudou, como testar e o que ainda falta. Não publique nesta etapa.

## O que já existe no código (conferido em 12/11/2026)

Pronto e para reaproveitar:

- `src/app/globals.css`: cores da marca e das categorias e a fonte, no bloco `@theme`.
- `src/app/layout.tsx`: fonte Plus Jakarta Sans, título e cor do tema.
- `src/components/Logo.tsx`: ícone e logo completo, em tom claro ou escuro.
- `src/app/page.tsx`: página provisória "em breve".

Atualização de 12/11/2026: dados, páginas das lojas, produto com complementos, carrinho, ícones e lista de lojas estão implementados e conectados. A lista acima descrevia apenas a base anterior à etapa.

## Situação

Etapa implementada e validada localmente no ramo `etapa-loja-carrinho`, sem publicação. Veja `CONTINUAR.md` para o estado atual e `VALIDACAO.md` para os testes e limites.
