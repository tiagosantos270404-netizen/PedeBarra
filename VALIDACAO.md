# Validação da página da loja e do carrinho

Conferido em 12/11/2026 no ramo `etapa-loja-carrinho`.

## Resultado

- `npm run conferir`: lint, tipos, 46 testes e build aprovados.
- `testes/navegador.mjs`: aprovado no Microsoft Edge em modo headless contra o build de produção.
- Telas revisadas visualmente: entrada das lojas, loja do Léo, seleção de produto e carrinho. Produto com rodapé adaptado a 320 px.
- Nenhum erro JavaScript durante o roteiro. Loja da farmácia sem transbordamento horizontal em 320, 390, 768 e 1280 px; carrinho também conferido a 320 px.

## Cenários exercitados no navegador

- Busca por nome sem acento, descrição, nenhum resultado e limpeza.
- Navegação pelas categorias sem esconder o título atrás da barra fixa.
- Esgotado visível e inclusão bloqueada.
- Obrigatório ausente, mínimo de dois acompanhamentos, limite de três adicionais e atualização de preço.
- Quantidade, observação, edição de complementos e totais do carrinho.
- Entrega por R$ 7,00, retirada grátis e persistência após recarregar.
- Favoritar e recuperar favorita após recarregar.
- Troca de loja: cancelar preserva o carrinho; confirmar substitui.
- Loja fechada bloqueia inclusão e conclusão, mantendo catálogo e carrinho visíveis.
- Item removido do catálogo é descartado com aviso; mudança de preço exige aceite.
- Item esgotado restaurado impede concluir; remover o último item mostra estado vazio.
- Conclusão demonstrativa com mensagem exata e limpeza do carrinho.
- Loja inexistente mostra 404.

## Repetir os testes

Os testes de regras não exigem dependências além das do projeto:

```bash
npm run conferir
```

O roteiro de navegador é opcional e usa Playwright. Ele foi instalado numa pasta de ferramentas separada nesta validação; não altera o `package.json` ou o lockfile do aplicativo. Para usar uma instalação temporária local:

```bash
npm install --no-save --package-lock=false playwright
npm run build
npm run start
```

Em outro terminal, na raiz do projeto:

```bash
node testes/navegador.mjs
```

Padrões: servidor `http://127.0.0.1:3000` e navegador Edge instalado. Variáveis opcionais: `QA_URL` para outro endereço local, `QA_BROWSER=chrome` para Chrome instalado e `PLAYWRIGHT_MODULE` para uma URL file:// de uma instalação externa do módulo. Capturas ficam em `.qa/`, ignorada pelo Git.

O roteiro usa um perfil descartável e relógio simulado apenas no navegador de teste: quinta-feira ao meio-dia para lojas abertas e 15h para fechamento do Léo. Não altera horários ou dados do aplicativo. Não execute contra um ambiente com pedidos reais.

## Limites da validação

Não foi realizado teste em aparelho físico, Safari/iOS ou leitor de tela. Não há implementação nem teste de pagamento real, geolocalização, notificações ou funcionamento offline completo. O build exige acesso ao Google Fonts, como já acontecia no projeto original.
