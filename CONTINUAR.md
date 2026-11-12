# Continuação do Pede Barra

Atualizado em 12/11/2026. Ramo: `etapa-loja-carrinho`.

## Estado atual

A etapa da página da loja e compra até o carrinho está implementada e validada localmente. A página inicial agora lista as três lojas de exemplo. O app não foi publicado e o ramo principal não foi alterado.

Leia `PROMPT-LOJA.md` e `CLAUDE.md` antes da próxima mudança. A especificação desta etapa foi atendida; não começar pagamentos, entregadores ou painel sem uma nova tarefa do Tiago.

## Como rodar

```bash
npm ci
npm run dev
npm run conferir
```

Abra http://localhost:3000. O build usa `next/font/google` e precisa acessar o Google Fonts para baixar a fonte. Nenhuma dependência de produção foi adicionada.

## Implementado

- Lista das três lojas, identificação de demonstração e cores próprias.
- Página `/loja/[slug]`: cabeçalho, horários, pagamentos informativos, busca, destaques, categorias fixas e produtos com promoção e esgotado.
- Tela do produto com opções obrigatórias, limites, adicionais, quantidade e observações.
- Carrinho de uma loja, confirmação de troca, persistência local, edição dos complementos, quantidades e remoção.
- Entrega de R$ 7,00 ou retirada grátis, com subtotal, frete e total separados.
- Conferência de horário, estoque demonstrativo e preços antes da conclusão. Preços alterados exigem aceite explícito.
- Conclusão: "Pedido de demonstração. Nada foi enviado ou cobrado."
- Favoritas locais, loja inexistente com 404 e avisos de recuperação de itens inválidos.

## Validação

`npm run conferir` passou: lint, tipos, 46 testes de regras e build.

O roteiro `testes/navegador.mjs` passou contra o build de produção no Edge, com celular simulado. Ver `VALIDACAO.md` para instruções, cenários e limites. Larguras verificadas: 320, 390, 768 e 1280 px. Não houve erro JavaScript durante o roteiro.

## Estrutura e cuidados

- `src/components/loja/PaginaLoja.tsx`: catálogo e inclusão de produtos.
- `src/components/carrinho/PaginaCarrinho.tsx`: carrinho e conclusão demonstrativa.
- `src/components/estado.ts`: localStorage, ações e relógio do navegador.
- `src/lib/carrinho.ts`: regras puras, incluindo edição atômica (sem apagar o original se a edição for inválida).
- `src/dados/lojas.ts`: dados demonstrativos. A disponibilidade usa o relógio real no fuso de Barra do Ribeiro.
- Nos arquivos de regras, dados e configuração, preserve imports relativos terminados em `.ts`, necessários ao testador do Node.
- Leia as instruções do Next.js em `AGENTS.md` e `node_modules/next/dist/docs/` antes de mudanças técnicas.

## Limites mantidos

Sem login, pedidos reais, cobrança, painel do comerciante, entregadores, repasses, avaliações ou agendamento. Sem medicamentos na farmácia de exemplo. Não há validação geográfica de cobertura nem coleta de endereço nesta simulação. Dados locais não equivalem a suporte offline completo. Ainda faltam cardápio, preços, fotos, horários e endereços reais dos parceiros.

## Sugestões para decidir com Tiago

1. Substituir os exemplos do Léo pelo cardápio e imagens autorizadas.
2. Preparar links e QR Codes de cada loja para divulgação.
3. Planejar a tela inicial completa ou o painel do comerciante como próxima etapa, separadamente.
