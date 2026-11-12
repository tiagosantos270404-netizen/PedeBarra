import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TAXA_ENTREGA_CENTAVOS } from "../src/config/entrega.ts";
import { LOJAS, buscarLoja } from "../src/dados/lojas.ts";
import { buscarProdutos } from "../src/lib/busca.ts";
import {
  CARRINHO_VAZIO,
  aceitarPrecos,
  adicionar,
  alterarQuantidade,
  conferir,
  definirModo,
  errosDaSelecao,
  precoUnitario,
  remover,
  restaurar,
  resumir,
  substituirPor,
  temEscolhaObrigatoria,
  type Carrinho,
} from "../src/lib/carrinho.ts";
import { contraste, coresDaLoja } from "../src/lib/cores.ts";
import { formatarPreco } from "../src/lib/dinheiro.ts";
import { situacaoDaLoja, textoSituacao } from "../src/lib/horarios.ts";

const leo = buscarLoja("leo")!;
const mercado = buscarLoja("mercado-exemplo")!;
const farmacia = buscarLoja("farmacia-exemplo")!;
const produto = (loja: typeof leo, id: string) => loja.produtos.find((p) => p.id === id)!;

/** Horário de Brasília (UTC-3). 12/11/2026 é uma quinta-feira. */
const em = (data: string, hora: string) => new Date(`${data}T${hora}:00-03:00`);
const QUINTA_MEIO_DIA = em("2026-11-12", "12:00");

function ok(c: Carrinho, loja: typeof leo, id: string, selecao = {}, observacao = "", quantidade = 1) {
  const r = adicionar(c, { loja, produto: produto(loja, id), selecao, observacao, quantidade });
  assert.equal(r.tipo, "ok");
  return (r as { carrinho: Carrinho }).carrinho;
}

describe("dados de exemplo", () => {
  it("tem o Léo primeiro, um mercado e uma farmácia", () => {
    assert.deepEqual(LOJAS.map((l) => l.categoria), ["restaurantes", "mercados", "farmacias"]);
    assert.ok(LOJAS.every((l) => l.exemplo));
  });

  it("não tem ids repetidos e toda referência existe", () => {
    for (const loja of LOJAS) {
      const ids = loja.produtos.map((p) => p.id);
      assert.equal(new Set(ids).size, ids.length, loja.id);
      const secoes = new Set(loja.secoes.map((s) => s.id));
      for (const p of loja.produtos) assert.ok(secoes.has(p.secaoId), `${loja.id}/${p.id}`);
      for (const s of loja.secoes) assert.ok(loja.produtos.some((p) => p.secaoId === s.id), s.id);
      for (const d of loja.destaques) assert.ok(ids.includes(d), `${loja.id}/${d}`);
    }
  });

  it("promoção sempre tem preço anterior maior que o atual", () => {
    for (const p of LOJAS.flatMap((l) => l.produtos)) {
      if (p.precoAnteriorCentavos !== undefined) assert.ok(p.precoAnteriorCentavos > p.precoCentavos, p.id);
    }
  });

  it("grupos de opções têm limites possíveis", () => {
    for (const p of LOJAS.flatMap((l) => l.produtos)) {
      for (const g of p.grupos ?? []) {
        assert.ok(g.min >= 0 && g.max >= 1 && g.min <= g.max && g.max <= g.opcoes.length, `${p.id}/${g.id}`);
      }
    }
  });

  it("horários abrem antes de fechar", () => {
    for (const loja of LOJAS) {
      for (const d of loja.horarios) for (const i of d) assert.ok(i.abre < i.fecha, loja.id);
    }
  });

  it("farmácia de exemplo não tem medicamentos", () => {
    const texto = farmacia.produtos.map((p) => `${p.nome} ${p.descricao}`).join(" ").toLowerCase();
    for (const termo of ["remédio", "medicamento", "comprimido", "mg", "xarope", "analgésico", "antibiótico"]) {
      assert.ok(!new RegExp(`\\b${termo}\\b`).test(texto), termo);
    }
  });
});

describe("dinheiro", () => {
  it("formata em reais", () => {
    assert.equal(formatarPreco(2200), "R$ 22,00");
    assert.equal(formatarPreco(5), "R$ 0,05");
    assert.equal(formatarPreco(0), "R$ 0,00");
    assert.equal(formatarPreco(123456), "R$ 1.234,56");
  });
});

describe("cor da loja", () => {
  it("escolhe texto branco em cor escura e texto escuro em cor clara", () => {
    assert.equal(coresDaLoja("#0F766E").sobre, "#ffffff");
    assert.equal(coresDaLoja("#CDE7DB").sobre, "#221a1c");
    assert.equal(coresDaLoja("#F2B705").sobre, "#221a1c");
  });

  it("garante leitura boa em todas as lojas e em cores extremas", () => {
    for (const cor of [...LOJAS.map((l) => l.cor), "#FFFFFF", "#000000", "#FFFF00", "#7A3FC2"]) {
      const c = coresDaLoja(cor);
      // Tons médios (como o vermelho da marca) não chegam a 4,5 nem com branco nem com escuro:
      // o app escolhe sempre o melhor dos dois, e usa essa combinação só em texto grande e forte.
      const outro = c.sobre === "#ffffff" ? "#221a1c" : "#ffffff";
      assert.ok(contraste(c.sobre, c.cor) >= contraste(outro, c.cor), `melhor opção ${cor}`);
      assert.ok(contraste(c.sobre, c.cor) >= 3.9, `sobre ${cor}`);
      assert.ok(contraste(c.escura, c.clara) >= 4.5, `escura/clara ${cor}`);
      assert.ok(contraste(c.escura, "#ffffff") >= 4.5, `escura/branco ${cor}`);
    }
  });

  it("cor inválida cai na cor do Pede Barra", () => {
    assert.equal(coresDaLoja("azul").cor, "#e8213d");
  });
});

describe("horários", () => {
  it("Léo aberto no almoço e fechado no intervalo da tarde", () => {
    assert.deepEqual(situacaoDaLoja(leo.horarios, QUINTA_MEIO_DIA), { aberta: true, fecha: "14:30" });
    const tarde = situacaoDaLoja(leo.horarios, em("2026-11-12", "16:00"));
    assert.equal(textoSituacao(tarde), "Fechada · abre hoje às 18h");
  });

  it("fecha exatamente no horário de fechar", () => {
    assert.equal(situacaoDaLoja(leo.horarios, em("2026-11-12", "14:29")).aberta, true);
    assert.equal(situacaoDaLoja(leo.horarios, em("2026-11-12", "14:30")).aberta, false);
  });

  it("depois de fechar à noite, mostra amanhã", () => {
    const s = situacaoDaLoja(leo.horarios, em("2026-11-12", "23:30"));
    assert.equal(textoSituacao(s), "Fechada · abre amanhã às 11h");
  });

  it("pula o dia de folga (Léo fecha segunda)", () => {
    const domingoNoite = situacaoDaLoja(leo.horarios, em("2026-11-15", "23:30"));
    assert.equal(textoSituacao(domingoNoite), "Fechada · abre terça às 11h");
    const segunda = situacaoDaLoja(leo.horarios, em("2026-11-16", "12:00"));
    assert.equal(textoSituacao(segunda), "Fechada · abre amanhã às 11h");
  });

  it("farmácia fechada sábado à tarde só abre segunda", () => {
    const s = situacaoDaLoja(farmacia.horarios, em("2026-11-14", "15:00"));
    assert.equal(textoSituacao(s), "Fechada · abre segunda às 8h");
  });

  it("usa o horário de Barra do Ribeiro, não o do aparelho", () => {
    // 15:00 em UTC = 12:00 em Barra do Ribeiro
    assert.equal(situacaoDaLoja(leo.horarios, new Date("2026-11-12T15:00:00Z")).aberta, true);
  });

  it("loja sem horário nenhum aparece só como fechada", () => {
    const s = situacaoDaLoja([[], [], [], [], [], [], []], QUINTA_MEIO_DIA);
    assert.equal(textoSituacao(s), "Fechada");
  });
});

describe("busca dentro da loja", () => {
  it("acha por nome, sem ligar para acento ou maiúscula", () => {
    assert.deepEqual(buscarProdutos(leo.produtos, "CORACAO").map((p) => p.id), ["xis-coracao"]);
  });
  it("acha por descrição", () => {
    assert.ok(buscarProdutos(leo.produtos, "milho").some((p) => p.id === "xis-salada"));
    assert.deepEqual(buscarProdutos(mercado.produtos, "chimarrão").map((p) => p.id), ["erva-mate"]);
  });
  it("exige todas as palavras", () => {
    assert.deepEqual(buscarProdutos(leo.produtos, "xis bacon").map((p) => p.id), ["xis-bacon"]);
  });
  it("sem resultado devolve lista vazia; busca vazia devolve tudo", () => {
    assert.equal(buscarProdutos(leo.produtos, "sushi").length, 0);
    assert.equal(buscarProdutos(leo.produtos, "   ").length, leo.produtos.length);
  });
});

describe("opções e complementos", () => {
  const xis = produto(leo, "xis-salada");
  const pf = produto(leo, "prato-feito");

  it("sabe quais produtos têm escolha obrigatória", () => {
    assert.equal(temEscolhaObrigatoria(xis), true);
    assert.equal(temEscolhaObrigatoria(produto(leo, "batata-frita")), false);
  });

  it("cobra o grupo obrigatório", () => {
    assert.deepEqual(Object.keys(errosDaSelecao(xis, {})), ["tamanho"]);
    assert.deepEqual(errosDaSelecao(xis, { tamanho: ["normal"] }), {});
  });

  it("respeita mínimo e máximo (prato feito pede exatamente 2 acompanhamentos)", () => {
    assert.ok(errosDaSelecao(pf, { carne: ["bife"], acompanhamentos: ["arroz"] }).acompanhamentos);
    assert.deepEqual(errosDaSelecao(pf, { carne: ["bife"], acompanhamentos: ["arroz", "feijao"] }), {});
    assert.ok(errosDaSelecao(pf, { carne: ["bife"], acompanhamentos: ["arroz", "feijao", "massa"] }).acompanhamentos);
    assert.ok(errosDaSelecao(xis, { tamanho: ["normal"], adicionais: ["bacon", "ovo", "queijo", "cheddar"] }).adicionais);
  });

  it("soma adicionais ao preço", () => {
    assert.equal(precoUnitario(xis, { tamanho: ["normal"] }), 2200);
    assert.equal(precoUnitario(xis, { tamanho: ["grande"], adicionais: ["bacon", "ovo"] }), 2200 + 600 + 400 + 250);
  });

  it("não deixa adicionar sem a escolha obrigatória, com opção inventada ou esgotado", () => {
    const base = { loja: leo, observacao: "", quantidade: 1 };
    assert.equal(adicionar(CARRINHO_VAZIO, { ...base, produto: xis, selecao: {} }).tipo, "invalido");
    assert.equal(adicionar(CARRINHO_VAZIO, { ...base, produto: xis, selecao: { tamanho: ["gigante"] } }).tipo, "invalido");
    assert.equal(adicionar(CARRINHO_VAZIO, { ...base, produto: xis, selecao: { tamanho: ["normal", "grande"] } }).tipo, "invalido");
    assert.equal(
      adicionar(CARRINHO_VAZIO, { ...base, produto: produto(leo, "xis-frango"), selecao: { tamanho: ["normal"] } }).tipo,
      "invalido",
    );
  });
});

describe("carrinho", () => {
  it("junta itens iguais e separa opções ou observações diferentes", () => {
    let c = ok(CARRINHO_VAZIO, leo, "xis-salada", { tamanho: ["normal"] });
    c = ok(c, leo, "xis-salada", { tamanho: ["normal"] }, "", 2);
    assert.equal(c.itens.length, 1);
    assert.equal(c.itens[0].quantidade, 3);
    c = ok(c, leo, "xis-salada", { tamanho: ["grande"] });
    c = ok(c, leo, "xis-salada", { tamanho: ["normal"] }, "Sem tomate");
    c = ok(c, leo, "xis-salada", { tamanho: ["normal"] }, "  sem   TOMATE ");
    assert.equal(c.itens.length, 3);
    assert.equal(c.itens[2].quantidade, 2);
  });

  it("a ordem em que as opções foram marcadas não cria linha nova", () => {
    let c = ok(CARRINHO_VAZIO, leo, "xis-salada", { tamanho: ["normal"], adicionais: ["bacon", "ovo"] });
    c = ok(c, leo, "xis-salada", { adicionais: ["ovo", "bacon"], tamanho: ["normal"] });
    assert.equal(c.itens.length, 1);
  });

  it("calcula subtotal, frete e total na entrega e na retirada", () => {
    let c = ok(CARRINHO_VAZIO, leo, "xis-salada", { tamanho: ["grande"], adicionais: ["bacon"] }, "", 2);
    c = ok(c, leo, "batata-frita");
    const entrega = resumir(c, leo);
    assert.equal(entrega.quantidade, 3);
    assert.equal(entrega.subtotalCentavos, 2 * 3200 + 1800);
    assert.equal(entrega.freteCentavos, TAXA_ENTREGA_CENTAVOS);
    assert.equal(entrega.freteCentavos, 700);
    assert.equal(entrega.totalCentavos, 8200 + 700);
    const retirada = resumir(definirModo(c, "retirada"), leo);
    assert.equal(retirada.freteCentavos, 0);
    assert.equal(retirada.totalCentavos, 8200);
  });

  it("frete é por pedido, não por item, e carrinho vazio não tem frete", () => {
    const c = ok(CARRINHO_VAZIO, mercado, "banana", {}, "", 10);
    assert.equal(resumir(c, mercado).freteCentavos, 700);
    assert.equal(resumir(CARRINHO_VAZIO, undefined).totalCentavos, 0);
  });

  it("altera quantidade, remove e libera a loja quando esvazia", () => {
    let c = ok(CARRINHO_VAZIO, leo, "agua");
    const chave = c.itens[0].chave;
    c = alterarQuantidade(c, chave, 5);
    assert.equal(c.itens[0].quantidade, 5);
    assert.equal(alterarQuantidade(c, chave, 500).itens[0].quantidade, 99);
    assert.equal(alterarQuantidade(c, chave, 0).itens.length, 0);
    c = remover(c, chave);
    assert.equal(c.lojaId, null);
    assert.equal(adicionar(c, { loja: mercado, produto: produto(mercado, "banana"), selecao: {}, observacao: "", quantidade: 1 }).tipo, "ok");
  });

  it("uma loja por pedido: outra loja pede confirmação e cancelar preserva", () => {
    const c = ok(CARRINHO_VAZIO, leo, "agua", {}, "", 2);
    const pedido = { loja: mercado, produto: produto(mercado, "banana"), selecao: {}, observacao: "", quantidade: 1 };
    const r = adicionar(c, pedido);
    assert.deepEqual(r, { tipo: "outra-loja", lojaAtualId: "leo" });
    // cancelar = não fazer nada: o carrinho original continua igual
    assert.equal(c.lojaId, "leo");
    assert.equal(c.itens[0].quantidade, 2);
    // confirmar = substituir
    const s = substituirPor(c, pedido);
    assert.equal(s.tipo, "ok");
    const novo = (s as { carrinho: Carrinho }).carrinho;
    assert.equal(novo.lojaId, "mercado-exemplo");
    assert.deepEqual(novo.itens.map((i) => i.produtoId), ["banana"]);
  });

  it("limita o tamanho da observação", () => {
    const c = ok(CARRINHO_VAZIO, leo, "agua", {}, "a".repeat(500));
    assert.equal(c.itens[0].observacao.length, 140);
  });
});

describe("recuperação do carrinho salvo", () => {
  it("volta igual depois de salvar", () => {
    let c = ok(CARRINHO_VAZIO, leo, "xis-salada", { tamanho: ["grande"] }, "Sem milho", 2);
    c = definirModo(c, "retirada");
    const r = restaurar(JSON.stringify(c), LOJAS);
    assert.deepEqual(r.carrinho, c);
    assert.deepEqual(r.avisos, []);
  });

  it("ignora lixo sem quebrar", () => {
    for (const lixo of [null, "", "{quebrado", "42", "[]", '"texto"', '{"v":2,"itens":[]}', '{"v":1}', '{"v":1,"itens":"x"}']) {
      assert.deepEqual(restaurar(lixo, LOJAS), { carrinho: CARRINHO_VAZIO, avisos: [] });
    }
  });

  it("esvazia e avisa quando a loja não existe mais", () => {
    const r = restaurar(JSON.stringify({ v: 1, lojaId: "sumiu", modo: "entrega", itens: [{ produtoId: "x", quantidade: 1 }] }), LOJAS);
    assert.equal(r.carrinho.itens.length, 0);
    assert.equal(r.avisos.length, 1);
  });

  it("descarta só os itens ruins e avisa", () => {
    const salvo = {
      v: 1,
      lojaId: "leo",
      modo: "qualquer",
      itens: [
        { produtoId: "agua", quantidade: 2, opcoes: {}, observacao: "" },
        { produtoId: "nao-existe", quantidade: 1 },
        { produtoId: "xis-salada", quantidade: 1, opcoes: {} }, // falta o tamanho
        { produtoId: "xis-salada", quantidade: 1, opcoes: { tamanho: ["gigante"] } },
        "texto solto",
        { produtoId: "pudim", quantidade: -3, observacao: 99 },
        { produtoId: "refri-lata", quantidade: "abc", opcoes: { sabor: ["cola"] } },
      ],
    };
    const r = restaurar(JSON.stringify(salvo), LOJAS);
    assert.deepEqual(r.carrinho.itens.map((i) => [i.produtoId, i.quantidade]), [["agua", 2], ["pudim", 1], ["refri-lata", 1]]);
    assert.equal(r.carrinho.modo, "entrega");
    assert.match(r.avisos[0], /^4 itens/);
  });

  it("carrinho salvo só com itens ruins fica vazio e sem loja", () => {
    const r = restaurar(JSON.stringify({ v: 1, lojaId: "leo", modo: "entrega", itens: [{ produtoId: "nao-existe" }] }), LOJAS);
    assert.equal(r.carrinho.lojaId, null);
  });
});

describe("conferência antes de concluir", () => {
  const cheio = ok(CARRINHO_VAZIO, leo, "agua");

  it("tudo certo com loja aberta", () => {
    assert.deepEqual(conferir(cheio, leo, QUINTA_MEIO_DIA), []);
  });

  it("bloqueia carrinho vazio e loja fechada", () => {
    assert.deepEqual(conferir(CARRINHO_VAZIO, undefined, QUINTA_MEIO_DIA), [{ tipo: "vazio" }]);
    assert.deepEqual(conferir(cheio, leo, em("2026-11-16", "12:00")), [{ tipo: "loja-fechada" }]);
  });

  it("aponta produto que esgotou depois de entrar no carrinho", () => {
    const lojaMudou = { ...leo, produtos: leo.produtos.map((p) => (p.id === "agua" ? { ...p, esgotado: true } : p)) };
    assert.deepEqual(conferir(cheio, lojaMudou, QUINTA_MEIO_DIA), [{ tipo: "esgotado", nomes: ["Água mineral 500 ml"] }]);
  });

  it("aponta preço que mudou, usa o preço novo e libera depois de aceitar", () => {
    const lojaMudou = { ...leo, produtos: leo.produtos.map((p) => (p.id === "agua" ? { ...p, precoCentavos: 450 } : p)) };
    assert.deepEqual(conferir(cheio, lojaMudou, QUINTA_MEIO_DIA), [{ tipo: "preco-mudou", nomes: ["Água mineral 500 ml"] }]);
    assert.equal(resumir(cheio, lojaMudou).subtotalCentavos, 450);
    assert.deepEqual(conferir(aceitarPrecos(cheio, lojaMudou), lojaMudou, QUINTA_MEIO_DIA), []);
  });
});
