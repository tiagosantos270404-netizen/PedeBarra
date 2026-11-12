# Como continuar a etapa "página da loja e compra até o carrinho"

> Escrito em 12/11/2026 para quem assumir o trabalho (pessoa ou outra IA).
> A especificação continua sendo o `PROMPT-LOJA.md`. As regras do projeto estão no `CLAUDE.md`.
> Trabalho no ramo `etapa-loja-carrinho`. Nada foi publicado; **não publique nesta etapa**.

## Situação em uma frase

As regras (dados, preços, horários, carrinho) estão prontas e testadas. As peças visuais de base e a tela do produto estão escritas, mas **nenhuma tela foi ligada nem vista funcionando no navegador ainda**. A página inicial continua sendo a "em breve".

## Como rodar

```bash
npm ci
npm run dev        # abre em http://localhost:3000
npm run conferir   # lint + tipos + testes + build (rode antes de cada commit)
```

- `npm test` usa o testador que já vem no Node 22 (sem dependência nova). Por isso os arquivos em `src/lib`, `src/dados` e `src/config` importam uns aos outros com caminho relativo e terminação `.ts`. Mantenha assim, senão os testes param de rodar. Os componentes podem usar `@/...` normalmente.
- O Next.js é a versão 16, com `cacheComponents` ligado: leia `AGENTS.md` e `node_modules/next/dist/docs/` antes de escrever páginas. `new Date()` e `localStorage` só podem ser lidos no navegador; por isso tudo passa por `src/components/estado.ts`.

## Pronto e verificado (42 testes passando, lint e tipos sem erros)

| Arquivo | O que faz |
| --- | --- |
| `src/config/entrega.ts` | Taxa de entrega (R$ 7,00) em um único lugar, retirada grátis, texto da área atendida, fuso horário. |
| `src/dados/tipos.ts` | Formato de loja, produto, grupo de opções e horários. Preços em centavos. |
| `src/dados/lojas.ts` | Dados de exemplo: Léo, Mercado Exemplo e Farmácia Exemplo (só higiene e beleza). Cada loja tem destaques, um esgotado, uma promoção e grupos de opções. |
| `src/lib/dinheiro.ts` | `formatarPreco(2200)` → "R$ 22,00". |
| `src/lib/cores.ts` | A partir da cor da loja calcula texto por cima (branco ou escuro), tom escuro e tom claro. |
| `src/lib/horarios.ts` | Aberta ou fechada pelo relógio, no horário de Barra do Ribeiro, e o próximo horário de abertura. |
| `src/lib/busca.ts` | Busca por nome e descrição, sem ligar para acentos. |
| `src/lib/carrinho.ts` | Validação de obrigatórios e limites, preço com adicionais, linhas separadas por opções/observação, uma loja por pedido, subtotal/frete/total, recuperação de carrinho salvo inválido, conferência antes de concluir. |
| `testes/regras.test.ts` | Testes de tudo acima. |

## Escrito, mas ainda NÃO testado no navegador

| Arquivo | O que faz |
| --- | --- |
| `src/components/estado.ts` | Carrinho e favoritas no `localStorage` e a hora atual. Use `useCarrinho()`, `acoesCarrinho`, `useFavorita()`, `useAgora()`. |
| `src/components/ui/Icones.tsx` | Ícones de traço e os 5 ícones das categorias. |
| `src/components/ui/Ilustracao.tsx` | Desenhos no lugar das fotos (mostrar sempre com o texto "Imagem ilustrativa"). |
| `src/components/ui/Dialogo.tsx` | Janela por cima da tela (`<dialog>`), formatos "folha" e "aviso". |
| `src/components/ui/Quantidade.tsx` | Botões de menos e mais. |
| `src/components/SituacaoLoja.tsx` | Texto "Aberta até 23h" / "Fechada · abre hoje às 18h". |
| `src/components/AvisoExemplo.tsx` | Faixa de "conteúdo de demonstração". |
| `src/components/carrinho/BarraCarrinho.tsx` | Barra fixa inferior com quantidade e subtotal. |
| `src/components/loja/FolhaProduto.tsx` | Tela do produto: opções, limites, observações, quantidade, valor atualizado. |
| `src/components/loja/TrocarLoja.tsx` | Confirmação ao adicionar de outra loja. |
| `src/components/loja/Favoritar.tsx` | Favoritar a loja, salvo só no navegador. |

## O que falta fazer (nesta ordem)

1. **Página da loja** — `src/app/loja/[slug]/page.tsx` (com `generateStaticParams` a partir de `LOJAS` e `notFound()` para loja inexistente) e um componente `src/components/loja/PaginaLoja.tsx` com:
   - capa na cor da loja (use `coresDaLoja()` e passe como variáveis CSS `--loja`, `--loja-sobre`, `--loja-escura`, `--loja-clara`; a `Ilustracao` já usa as duas últimas), sigla no lugar do logo, nome, tipo, `SituacaoLoja`, tempo estimado, "Entrega R$ 7,00", "Retirada grátis", `Favoritar`;
   - horários (`tabelaDeHorarios()`) e formas de pagamento marcadas como demonstração;
   - quando fechada: aviso com o próximo horário e pedidos bloqueados (o catálogo continua visível);
   - busca (`buscarProdutos()`), destaques (`loja.destaques`, nunca "mais vendidos"), barra de categorias horizontal fixa ao rolar sem cobrir o conteúdo;
   - lista de produtos com esgotado identificado e preço anterior riscado só quando `precoAnteriorCentavos` existir;
   - botão "+": abre a `FolhaProduto` se `temEscolhaObrigatoria(produto)`, senão adiciona direto;
   - ao adicionar: `acoesCarrinho.adicionar()`; se voltar `outra-loja`, mostrar `TrocarLoja` e, confirmando, `acoesCarrinho.substituirPor()`;
   - `BarraCarrinho` no fim.
2. **Tela do carrinho** — `src/app/carrinho/page.tsx`: itens com opções e observações, alterar quantidade, remover, entrega ou retirada (`acoesCarrinho.definirModo`), subtotal, frete e total separados (`resumir()`), avisos de recuperação (`useCarrinho().avisos`), pagamento só informativo. Ao concluir, rodar `conferir()` e tratar loja fechada, esgotado e preço alterado. A conclusão deve dizer exatamente: **"Pedido de demonstração. Nada foi enviado ou cobrado."**
   - Entrega: não inventar bairros nem validar cobertura. Retirada não pede endereço.
3. **Entrada para as lojas** — trocar a página "em breve" (`src/app/page.tsx`) por uma lista simples das três lojas de exemplo. A tela inicial completa é outra etapa.
4. **Validação no navegador (celular simulado)** de todos os pontos da seção 7 do `PROMPT-LOJA.md`: busca, categorias, obrigatórios, limites, cálculos, esgotados, loja fechada, troca de loja, recuperação do carrinho, entrega e retirada.
5. **Documentos** — atualizar `CLAUDE.md`, `ROADMAP.md` e `CHANGELOG.md` com o que realmente ficou pronto.

## Decisões já tomadas com o Tiago nesta conversa

- Sem fotos reais: usar ilustrações com o texto "Imagem ilustrativa".
- Loja aberta ou fechada calculada pelo relógio de verdade e pelos horários cadastrados.
- A página "em breve" vira uma lista simples das três lojas de exemplo.
- Testes automáticos para as contas do carrinho.
- Trabalho em ramo separado, sem publicar o app.

## Cuidados

- O protótipo em `materiais/prototipo/` está desatualizado (entrega a R$ 5,00, cupom, endereço fixo). Serve só de referência visual.
- O vermelho da marca com texto branco tem contraste 4,3 (abaixo de 4,5): use essa combinação só em texto grande e forte, como nos botões.
- Cores sempre pelas classes do tema em `src/app/globals.css` (`bg-marca`, `text-texto-2`, `text-sucesso`...). A única exceção é a cor da loja, que vem dos dados.
- Sem emojis, botões com pelo menos 44 px, celular primeiro.
