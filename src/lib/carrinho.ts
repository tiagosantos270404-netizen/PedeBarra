/**
 * Regras do carrinho, sem nada de tela: contas, validações e recuperação.
 * Fica separado para poder ser testado sozinho.
 */
import {
  TAXA_ENTREGA_CENTAVOS,
  TAXA_RETIRADA_CENTAVOS,
} from "../config/entrega.ts";
import type { GrupoOpcoes, Loja, Produto } from "../dados/tipos.ts";
import { situacaoDaLoja } from "./horarios.ts";

export type Modo = "entrega" | "retirada";

/** Opções marcadas: para cada grupo, os ids escolhidos. */
export type Selecao = Record<string, string[]>;

export type ItemCarrinho = {
  /** Identifica a linha: mesmo produto com opções ou observação diferentes vira outra linha. */
  chave: string;
  produtoId: string;
  quantidade: number;
  opcoes: Selecao;
  observacao: string;
  /** Preço unitário que a pessoa viu ao adicionar, para avisar se mudar. */
  precoVistoCentavos: number;
};

export type Carrinho = {
  v: 1;
  lojaId: string | null;
  itens: ItemCarrinho[];
  modo: Modo;
};

export const QUANTIDADE_MAXIMA = 99;
export const OBSERVACAO_MAXIMA = 140;

export const CARRINHO_VAZIO: Carrinho = {
  v: 1,
  lojaId: null,
  itens: [],
  modo: "entrega",
};

/* ---------- Opções e preços ---------- */

/** Explica a regra do grupo em uma frase curta. */
export function regraDoGrupo(g: GrupoOpcoes): string {
  if (g.min === 0) return g.max === 1 ? "Escolha até 1" : `Escolha até ${g.max}`;
  if (g.min === g.max) return g.min === 1 ? "Escolha 1" : `Escolha ${g.min}`;
  return `Escolha de ${g.min} a ${g.max}`;
}

export function temEscolhaObrigatoria(produto: Produto): boolean {
  return (produto.grupos ?? []).some((g) => g.min > 0);
}

/** Mantém só o que existe no produto, sem repetidos. */
export function limparSelecao(produto: Produto, selecao: Selecao): Selecao {
  const limpa: Selecao = {};
  for (const g of produto.grupos ?? []) {
    const validos = new Set(g.opcoes.map((o) => o.id));
    const marcados = [...new Set(selecao[g.id] ?? [])].filter((id) => validos.has(id));
    if (marcados.length > 0) limpa[g.id] = marcados.sort();
  }
  return limpa;
}

/** Devolve, por grupo, a mensagem do que falta ou sobra. Vazio = tudo certo. */
export function errosDaSelecao(produto: Produto, selecao: Selecao): Record<string, string> {
  const erros: Record<string, string> = {};
  for (const g of produto.grupos ?? []) {
    const n = (selecao[g.id] ?? []).length;
    if (n < g.min) {
      erros[g.id] =
        g.min === 1 ? "Escolha uma opção." : `Escolha ${g.min} opções (faltam ${g.min - n}).`;
    } else if (n > g.max) {
      erros[g.id] = `Escolha no máximo ${g.max}.`;
    }
  }
  return erros;
}

export function selecaoValida(produto: Produto, selecao: Selecao): boolean {
  const limpa = limparSelecao(produto, selecao);
  const mesmaQuantidade = Object.keys(selecao).every(
    (g) => (selecao[g]?.length ?? 0) === (limpa[g]?.length ?? 0),
  );
  return mesmaQuantidade && Object.keys(errosDaSelecao(produto, limpa)).length === 0;
}

export function precoUnitario(produto: Produto, selecao: Selecao): number {
  let total = produto.precoCentavos;
  for (const g of produto.grupos ?? []) {
    for (const id of selecao[g.id] ?? []) {
      total += g.opcoes.find((o) => o.id === id)?.precoCentavos ?? 0;
    }
  }
  return total;
}

/** Texto das opções escolhidas, grupo a grupo, para revisar no carrinho. */
export function descreverSelecao(produto: Produto, selecao: Selecao): string[] {
  const linhas: string[] = [];
  for (const g of produto.grupos ?? []) {
    const nomes = (selecao[g.id] ?? [])
      .map((id) => g.opcoes.find((o) => o.id === id)?.nome)
      .filter((n): n is string => Boolean(n));
    if (nomes.length > 0) linhas.push(`${g.nome}: ${nomes.join(", ")}`);
  }
  return linhas;
}

export function arrumarObservacao(texto: string): string {
  return texto.replace(/\s+/g, " ").trim().slice(0, OBSERVACAO_MAXIMA);
}

function arrumarQuantidade(q: number): number {
  if (!Number.isFinite(q)) return 1;
  return Math.max(1, Math.min(QUANTIDADE_MAXIMA, Math.floor(q)));
}

export function chaveDoItem(produtoId: string, selecao: Selecao, observacao: string): string {
  const grupos = Object.keys(selecao)
    .sort()
    .map((g) => `${g}=${[...selecao[g]].sort().join(",")}`)
    .join(";");
  return `${produtoId}|${grupos}|${observacao.toLowerCase()}`;
}

/* ---------- Mexer no carrinho ---------- */

export type Pedido = {
  loja: Loja;
  produto: Produto;
  selecao: Selecao;
  observacao: string;
  quantidade: number;
};

export type ResultadoAdicionar =
  | { tipo: "ok"; carrinho: Carrinho }
  /** O carrinho tem itens de outra loja: precisa de confirmação para trocar. */
  | { tipo: "outra-loja"; lojaAtualId: string }
  | { tipo: "invalido"; motivo: string };

function montarItem(p: Pedido): ItemCarrinho | string {
  if (p.produto.esgotado) return "Este produto está esgotado.";
  const selecao = limparSelecao(p.produto, p.selecao);
  if (!selecaoValida(p.produto, p.selecao)) return "Confira as opções do produto.";
  const observacao = arrumarObservacao(p.observacao);
  return {
    chave: chaveDoItem(p.produto.id, selecao, observacao),
    produtoId: p.produto.id,
    quantidade: arrumarQuantidade(p.quantidade),
    opcoes: selecao,
    observacao,
    precoVistoCentavos: precoUnitario(p.produto, selecao),
  };
}

function juntar(itens: ItemCarrinho[], novo: ItemCarrinho): ItemCarrinho[] {
  const existe = itens.some((i) => i.chave === novo.chave);
  if (!existe) return [...itens, novo];
  return itens.map((i) =>
    i.chave === novo.chave
      ? {
          ...i,
          quantidade: arrumarQuantidade(i.quantidade + novo.quantidade),
          precoVistoCentavos: novo.precoVistoCentavos,
        }
      : i,
  );
}

export function adicionar(carrinho: Carrinho, p: Pedido): ResultadoAdicionar {
  const item = montarItem(p);
  if (typeof item === "string") return { tipo: "invalido", motivo: item };
  if (carrinho.lojaId && carrinho.lojaId !== p.loja.id && carrinho.itens.length > 0) {
    return { tipo: "outra-loja", lojaAtualId: carrinho.lojaId };
  }
  return {
    tipo: "ok",
    carrinho: { ...carrinho, lojaId: p.loja.id, itens: juntar(carrinho.itens, item) },
  };
}

/** Usado depois que a pessoa confirma a troca de loja: esvazia e começa de novo. */
export function substituirPor(carrinho: Carrinho, p: Pedido): ResultadoAdicionar {
  return adicionar({ ...carrinho, lojaId: null, itens: [] }, p);
}

export function alterarQuantidade(carrinho: Carrinho, chave: string, quantidade: number): Carrinho {
  if (quantidade < 1) return remover(carrinho, chave);
  return {
    ...carrinho,
    itens: carrinho.itens.map((i) =>
      i.chave === chave ? { ...i, quantidade: arrumarQuantidade(quantidade) } : i,
    ),
  };
}

export function remover(carrinho: Carrinho, chave: string): Carrinho {
  const itens = carrinho.itens.filter((i) => i.chave !== chave);
  return { ...carrinho, itens, lojaId: itens.length === 0 ? null : carrinho.lojaId };
}

export function definirModo(carrinho: Carrinho, modo: Modo): Carrinho {
  return { ...carrinho, modo };
}

/** Aceita os preços atuais (depois de avisar a pessoa que algum mudou). */
export function aceitarPrecos(carrinho: Carrinho, loja: Loja): Carrinho {
  return {
    ...carrinho,
    itens: carrinho.itens.map((i) => {
      const produto = loja.produtos.find((p) => p.id === i.produtoId);
      return produto ? { ...i, precoVistoCentavos: precoUnitario(produto, i.opcoes) } : i;
    }),
  };
}

/* ---------- Contas ---------- */

export type Linha = {
  item: ItemCarrinho;
  produto: Produto;
  unitarioCentavos: number;
  totalCentavos: number;
  opcoes: string[];
  esgotado: boolean;
  precoMudou: boolean;
};

export type Resumo = {
  linhas: Linha[];
  /** Soma das quantidades. */
  quantidade: number;
  subtotalCentavos: number;
  freteCentavos: number;
  totalCentavos: number;
};

export function freteDoModo(modo: Modo): number {
  return modo === "entrega" ? TAXA_ENTREGA_CENTAVOS : TAXA_RETIRADA_CENTAVOS;
}

export function resumir(carrinho: Carrinho, loja: Loja | undefined): Resumo {
  const linhas: Linha[] = [];
  for (const item of carrinho.itens) {
    const produto = loja?.produtos.find((p) => p.id === item.produtoId);
    if (!produto) continue;
    const unitarioCentavos = precoUnitario(produto, item.opcoes);
    linhas.push({
      item,
      produto,
      unitarioCentavos,
      totalCentavos: unitarioCentavos * item.quantidade,
      opcoes: descreverSelecao(produto, item.opcoes),
      esgotado: Boolean(produto.esgotado),
      precoMudou: unitarioCentavos !== item.precoVistoCentavos,
    });
  }
  const subtotalCentavos = linhas.reduce((s, l) => s + l.totalCentavos, 0);
  const freteCentavos = linhas.length === 0 ? 0 : freteDoModo(carrinho.modo);
  return {
    linhas,
    quantidade: linhas.reduce((s, l) => s + l.item.quantidade, 0),
    subtotalCentavos,
    freteCentavos,
    totalCentavos: subtotalCentavos + freteCentavos,
  };
}

/* ---------- Conferência antes de concluir ---------- */

export type Problema =
  | { tipo: "vazio" }
  | { tipo: "loja-fechada" }
  | { tipo: "esgotado"; nomes: string[] }
  | { tipo: "preco-mudou"; nomes: string[] };

export function conferir(carrinho: Carrinho, loja: Loja | undefined, agora: Date): Problema[] {
  const resumo = resumir(carrinho, loja);
  if (!loja || resumo.linhas.length === 0) return [{ tipo: "vazio" }];
  const problemas: Problema[] = [];
  if (!situacaoDaLoja(loja.horarios, agora).aberta) problemas.push({ tipo: "loja-fechada" });
  const esgotados = resumo.linhas.filter((l) => l.esgotado).map((l) => l.produto.nome);
  if (esgotados.length > 0) problemas.push({ tipo: "esgotado", nomes: esgotados });
  const mudaram = resumo.linhas.filter((l) => l.precoMudou).map((l) => l.produto.nome);
  if (mudaram.length > 0) problemas.push({ tipo: "preco-mudou", nomes: mudaram });
  return problemas;
}

/* ---------- Recuperar o carrinho salvo ---------- */

export type Restaurado = { carrinho: Carrinho; avisos: string[] };

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Lê o que estava salvo no navegador e devolve um carrinho seguro.
 * Qualquer coisa estranha (texto quebrado, loja ou produto que não existe mais,
 * opções que mudaram) é descartada, com um aviso para a pessoa.
 */
export function restaurar(textoSalvo: string | null, lojas: Loja[]): Restaurado {
  if (!textoSalvo) return { carrinho: CARRINHO_VAZIO, avisos: [] };

  let bruto: unknown;
  try {
    bruto = JSON.parse(textoSalvo);
  } catch {
    return { carrinho: CARRINHO_VAZIO, avisos: [] };
  }
  if (!ehObjeto(bruto) || bruto.v !== 1 || !Array.isArray(bruto.itens)) {
    return { carrinho: CARRINHO_VAZIO, avisos: [] };
  }

  const modo: Modo = bruto.modo === "retirada" ? "retirada" : "entrega";
  if (bruto.itens.length === 0) return { carrinho: { ...CARRINHO_VAZIO, modo }, avisos: [] };

  const loja = lojas.find((l) => l.id === bruto.lojaId);
  if (!loja) {
    return {
      carrinho: { ...CARRINHO_VAZIO, modo },
      avisos: ["A loja do teu carrinho não está mais disponível. O carrinho foi esvaziado."],
    };
  }

  let itens: ItemCarrinho[] = [];
  let descartados = 0;
  for (const cru of bruto.itens) {
    const produto = ehObjeto(cru)
      ? loja.produtos.find((p) => p.id === cru.produtoId)
      : undefined;
    if (!ehObjeto(cru) || !produto) {
      descartados++;
      continue;
    }
    const selecaoCrua: Selecao = {};
    if (ehObjeto(cru.opcoes)) {
      for (const [g, ids] of Object.entries(cru.opcoes)) {
        if (Array.isArray(ids)) selecaoCrua[g] = ids.filter((x) => typeof x === "string");
      }
    }
    if (!selecaoValida(produto, selecaoCrua)) {
      descartados++;
      continue;
    }
    const selecao = limparSelecao(produto, selecaoCrua);
    const observacao = arrumarObservacao(typeof cru.observacao === "string" ? cru.observacao : "");
    const atual = precoUnitario(produto, selecao);
    itens = juntar(itens, {
      chave: chaveDoItem(produto.id, selecao, observacao),
      produtoId: produto.id,
      quantidade: arrumarQuantidade(Number(cru.quantidade)),
      opcoes: selecao,
      observacao,
      precoVistoCentavos:
        typeof cru.precoVistoCentavos === "number" && Number.isFinite(cru.precoVistoCentavos)
          ? cru.precoVistoCentavos
          : atual,
    });
  }

  const avisos: string[] = [];
  if (descartados > 0) {
    avisos.push(
      descartados === 1
        ? "Um item do teu carrinho não está mais disponível e foi removido."
        : `${descartados} itens do teu carrinho não estão mais disponíveis e foram removidos.`,
    );
  }
  return {
    carrinho: { v: 1, lojaId: itens.length > 0 ? loja.id : null, itens, modo },
    avisos,
  };
}
