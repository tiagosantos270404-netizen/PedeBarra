import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.QA_BROWSER || "msedge",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
page.setDefaultTimeout(10000);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.clock.setFixedTime(new Date("2026-11-12T12:00:00-03:00"));
const base = process.env.QA_URL || "http://127.0.0.1:3000";
const text = async () => page.locator("body").innerText();
const cart = async () =>
  page.evaluate(() => JSON.parse(localStorage.getItem("pedebarra:carrinho")));
const checkWidth = async () =>
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Sem transbordamento horizontal",
  );
try {
  await page.goto(base);
  await page.getByRole("link").filter({ hasText: "Léo Restaurante" }).click();
  await page
    .getByRole("button", { name: "Favoritar Léo Restaurante & Lancheria" })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Favoritar Léo Restaurante & Lancheria" })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page
      .getByRole("button", { name: "Favoritar Léo Restaurante & Lancheria" })
      .getAttribute("aria-pressed"),
    "true",
  );
  const search = page.getByRole("searchbox");
  await search.fill("coracao");
  assert.equal(await page.locator("article").count(), 1);
  await search.fill("desfiado");
  assert.equal(await page.locator("article").count(), 1);
  assert.equal(
    await page
      .getByRole("button", { name: "Adicionar Xis Frango", exact: true })
      .isDisabled(),
    true,
  );
  await search.fill("inexistente");
  assert.match(await text(), /Nenhum produto encontrado/);
  await page.getByRole("button", { name: "Limpar busca" }).click();
  await page.getByRole("link", { name: "Bebidas", exact: true }).click();
  assert.ok((await page.locator("#secao-bebidas").boundingBox()).y >= 65);
  await checkWidth();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: ".qa/preview-loja.png", fullPage: true });
  await page
    .getByRole("button", { name: "Adicionar Xis Salada", exact: true })
    .first()
    .click();
  let d = page.getByRole("dialog");
  await d.getByRole("button", { name: /^Adicionar R/ }).click();
  assert.match(await d.innerText(), /Escolha uma opção/);
  await d.getByRole("radio", { name: /Grande/ }).check();
  await d.getByRole("checkbox", { name: /Bacon/ }).check();
  await d.getByRole("checkbox", { name: /Ovo/ }).check();
  await d.getByRole("checkbox", { name: /Queijo extra/ }).check();
  assert.equal(
    await d.getByRole("checkbox", { name: /Cheddar/ }).isDisabled(),
    true,
  );
  await d.getByLabel("Observações", { exact: true }).fill("sem cebola");
  await d
    .getByRole("button", { name: "Aumentar quantidade de Xis Salada" })
    .click();
  assert.match(
    await d.getByRole("button", { name: /^Adicionar R/ }).innerText(),
    /76,00/,
  );
  await page.screenshot({ path: ".qa/preview-produto.png" });
  await d.getByRole("button", { name: /^Adicionar R/ }).click();
  assert.equal((await cart()).itens[0].quantidade, 2);
  await page.getByRole("link", { name: /Ver carrinho/ }).click();
  await page
    .getByRole("heading", { name: "Teu carrinho", exact: true })
    .waitFor();
  assert.match(await text(), /83,00/);
  await page.getByRole("radio", { name: /Retirada na loja/ }).check();
  assert.match(await text(), /Frete da retirada/);
  assert.equal((await cart()).modo, "retirada");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.getByRole("radio", { name: /Retirada na loja/ }).isChecked(),
    true,
  );
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  d = page.getByRole("dialog");
  assert.equal(
    await d.getByLabel("Observações", { exact: true }).inputValue(),
    "sem cebola",
  );
  await d.getByRole("radio", { name: /Normal/ }).check();
  await d.getByRole("button", { name: /^Salvar R/ }).click();
  assert.equal((await cart()).itens[0].precoVistoCentavos, 3200);
  await page.getByRole("radio", { name: /Entrega R/ }).check();
  await page.screenshot({ path: ".qa/preview-carrinho.png", fullPage: true });
  await page
    .getByRole("button", { name: "Concluir simulação", exact: true })
    .click();
  await page.getByRole("heading", { name: "Simulação concluída" }).waitFor();
  assert.match(
    await text(),
    /Pedido de demonstração\. Nada foi enviado ou cobrado\./,
  );
  assert.equal((await cart()).itens.length, 0);
  console.log(
    "PASS compra completa, obrigatórios, limites, adicionais, edição, retirada, persistência, favorito, busca e categorias",
  );
  await page.goto(base + "/loja/leo");
  await page
    .getByRole("button", { name: "Adicionar Água mineral 500 ml", exact: true })
    .click();
  const anterior = await cart();
  await page.goto(base + "/loja/mercado-exemplo");
  const add = page
    .getByRole("button", { name: /^Adicionar / })
    .filter({ visible: true });
  await add.first().click();

  if (
    (await page.getByRole("dialog", { name: "Trocar de loja?" }).count()) === 0
  )
    throw new Error("Escolher item simples do mercado para troca");
  await page.getByRole("button", { name: "Manter carrinho atual" }).click();
  assert.deepEqual(await cart(), anterior);
  await add.first().click();
  await page.getByRole("button", { name: "Esvaziar e adicionar" }).click();
  assert.equal((await cart()).lojaId, "mercado-exemplo");
  console.log("PASS troca de loja com cancelar e confirmar");
  await page.goto(base + "/loja/leo");
  await page.clock.setFixedTime(new Date("2026-11-12T15:00:00-03:00"));
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page
      .getByRole("button", {
        name: "Adicionar Água mineral 500 ml",
        exact: true,
      })
      .isDisabled(),
    true,
  );
  assert.match(await text(), /abre hoje às 18h/);
  console.log("PASS loja fechada");
  await page.clock.setFixedTime(new Date("2026-11-12T12:00:00-03:00"));
  await page.evaluate(() =>
    localStorage.setItem(
      "pedebarra:carrinho",
      JSON.stringify({
        v: 1,
        lojaId: "leo",
        modo: "entrega",
        itens: [
          {
            produtoId: "agua",
            quantidade: 1,
            opcoes: {},
            observacao: "",
            precoVistoCentavos: 100,
          },
          { produtoId: "sumiu", quantidade: 1 },
        ],
      }),
    ),
  );
  await page.goto(base + "/carrinho", { waitUntil: "networkidle" });
  assert.match(await text(), /foi removido/);
  await page.getByRole("button", { name: "Concluir simulação" }).click();
  assert.match(
    await page
      .getByRole("alert")
      .filter({ hasText: "Confira e aceite" })
      .innerText(),
    /novos preços/,
  );
  await page
    .getByRole("button", { name: "Aceitar preços atualizados" })
    .click();
  await page.getByRole("button", { name: "Concluir simulação" }).click();
  assert.match(await text(), /Simulação concluída/);
  console.log("PASS recuperação e alteração de preço");
  await page.goto(base + "/loja/farmacia-exemplo", {
    waitUntil: "networkidle",
  });
  await checkWidth();
  assert.match(await text(), /higiene e beleza/);
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await checkWidth();
  }
  await page.goto(base + "/loja/inexistente", { waitUntil: "networkidle" });
  assert.match(await text(), /404/);
  await page.goto(base + "/loja/leo", { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 320, height: 640 });
  await page
    .getByRole("button", { name: "Adicionar Prato feito", exact: true })
    .first()
    .click();
  d = page.getByRole("dialog");
  await d.getByRole("radio", { name: /Bife acebolado/ }).check();
  await d.getByRole("checkbox", { name: /Arroz/ }).check();
  await d.getByRole("button", { name: /^Adicionar R/ }).click();
  assert.match(await d.innerText(), /faltam 1/);
  await d.getByRole("checkbox", { name: /Feijão/ }).check();
  assert.equal(
    await d.getByRole("checkbox", { name: /Batata frita/ }).isDisabled(),
    true,
  );
  assert.ok(await d.evaluate((el) => el.scrollWidth <= innerWidth));
  await page.screenshot({ path: ".qa/preview-produto-320.png" });
  await d.getByRole("button", { name: /^Adicionar R/ }).click();
  await page.goto(base + "/carrinho", { waitUntil: "networkidle" });
  await checkWidth();
  await page.clock.setFixedTime(new Date("2026-11-12T15:00:00-03:00"));
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.getByRole("button", { name: "Concluir simulação" }).isDisabled(),
    true,
  );
  await page.clock.setFixedTime(new Date("2026-11-12T12:00:00-03:00"));
  await page.evaluate(() =>
    localStorage.setItem(
      "pedebarra:carrinho",
      JSON.stringify({
        v: 1,
        lojaId: "leo",
        modo: "entrega",
        itens: [
          {
            produtoId: "xis-frango",
            quantidade: 1,
            opcoes: { tamanho: ["normal"] },
            observacao: "",
            precoVistoCentavos: 2500,
          },
        ],
      }),
    ),
  );
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Concluir simulação" }).click();
  assert.match(
    await page
      .getByRole("alert")
      .filter({ hasText: "Remova os produtos" })
      .innerText(),
    /Xis Frango/,
  );
  await page
    .getByRole("button", { name: "Remover item Xis Frango", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Teu carrinho está vazio" })
    .waitFor();
  console.log(
    "PASS mínimo de duas opções, produto a 320px, bloqueio no carrinho, esgotado restaurado e remoção",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS farmácia, 404, larguras 320/390/768/1280 e sem erros JavaScript",
  );
} catch (e) {
  console.log((await text()).slice(-5000));
  await page.screenshot({ path: ".qa/falha.png", fullPage: true });
  throw e;
} finally {
  await browser.close();
}
