import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LOJAS } from "../src/dados/lojas.ts";
import {
  adicionar,
  editar,
  definirModo,
  resumir,
  CARRINHO_VAZIO,
  type Carrinho,
} from "../src/lib/carrinho.ts";

const loja = LOJAS[0];
const produto = loja.produtos.find((p) => p.id === "xis-salada")!;
const pedido = {
  loja,
  produto,
  selecao: { tamanho: ["normal"] },
  observacao: "sem cebola",
  quantidade: 1,
};
function inicial(): Carrinho {
  const r = adicionar(CARRINHO_VAZIO, pedido);
  assert.equal(r.tipo, "ok");
  if (r.tipo !== "ok") throw new Error("Produto inválido");
  return r.carrinho;
}

describe("edição do carrinho", () => {
  it("altera complementos e quantidade sem perder o modo de recebimento", () => {
    const c = definirModo(inicial(), "retirada");
    const r = editar(c, c.itens[0].chave, {
      ...pedido,
      selecao: { tamanho: ["grande"], adicionais: ["bacon"] },
      quantidade: 2,
    });
    assert.equal(r.tipo, "ok");
    if (r.tipo !== "ok") return;
    assert.equal(r.carrinho.modo, "retirada");
    assert.equal(r.carrinho.itens.length, 1);
    assert.equal(resumir(r.carrinho, loja).totalCentavos, 6400);
  });
  it("preserva o original se faltam opções obrigatórias", () => {
    const c = inicial();
    const antes = JSON.stringify(c);
    assert.equal(
      editar(c, c.itens[0].chave, { ...pedido, selecao: {} }).tipo,
      "invalido",
    );
    assert.equal(JSON.stringify(c), antes);
  });
  it("recusa edição de item removido em outra aba", () => {
    assert.equal(editar(CARRINHO_VAZIO, "antigo", pedido).tipo, "invalido");
  });
  it("combina quantidades quando a edição torna duas linhas iguais", () => {
    const segundo = adicionar(inicial(), {
      ...pedido,
      observacao: "com cebola",
      quantidade: 2,
    });
    assert.equal(segundo.tipo, "ok");
    if (segundo.tipo !== "ok") return;
    const r = editar(segundo.carrinho, segundo.carrinho.itens[1].chave, {
      ...pedido,
      quantidade: 2,
    });
    assert.equal(r.tipo, "ok");
    if (r.tipo !== "ok") return;
    assert.equal(r.carrinho.itens.length, 1);
    assert.equal(r.carrinho.itens[0].quantidade, 3);
  });
});
