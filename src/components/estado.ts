"use client";

/**
 * Tudo que o app guarda no navegador da pessoa: carrinho, lojas favoritas e a hora atual.
 * No primeiro instante (antes de o navegador responder) os valores vêm como "ainda não sei" (null).
 */
import { useSyncExternalStore } from "react";
import { LOJAS } from "@/dados/lojas";
import {
  aceitarPrecos,
  adicionar,
  alterarQuantidade,
  CARRINHO_VAZIO,
  definirModo,
  editar,
  remover,
  restaurar,
  substituirPor,
  type Carrinho,
  type Modo,
  type Pedido,
  type Restaurado,
  type ResultadoAdicionar,
} from "@/lib/carrinho";
import type { Loja } from "@/dados/tipos";

const CHAVE_CARRINHO = "pedebarra:carrinho";
const CHAVE_FAVORITAS = "pedebarra:favoritas";

const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());

function lerTexto(chave: string): string | null {
  try {
    return window.localStorage.getItem(chave);
  } catch {
    return null; // navegação privada ou armazenamento bloqueado
  }
}

function gravarTexto(chave: string, texto: string) {
  try {
    window.localStorage.setItem(chave, texto);
  } catch {
    // Sem espaço ou bloqueado: o app segue funcionando só na memória.
  }
}

/* ---------- Carrinho ---------- */

let carrinhoAtual: Restaurado | null = null;

function lerCarrinho(): Restaurado {
  if (!carrinhoAtual) {
    const salvo = lerTexto(CHAVE_CARRINHO);
    carrinhoAtual = restaurar(salvo, LOJAS);
    // Se algo foi consertado ou descartado, já deixa o salvo limpo.
    const limpo = JSON.stringify(carrinhoAtual.carrinho);
    if (salvo !== null && salvo !== limpo) gravarTexto(CHAVE_CARRINHO, limpo);
  }
  return carrinhoAtual;
}

function gravarCarrinho(carrinho: Carrinho, avisos = lerCarrinho().avisos) {
  carrinhoAtual = { carrinho, avisos };
  gravarTexto(CHAVE_CARRINHO, JSON.stringify(carrinho));
  avisar();
}

/* ---------- Favoritas ---------- */

let favoritasAtuais: string[] | null = null;

function lerFavoritas(): string[] {
  if (!favoritasAtuais) {
    let lista: unknown = [];
    try {
      lista = JSON.parse(lerTexto(CHAVE_FAVORITAS) ?? "[]");
    } catch {
      lista = [];
    }
    const validas = new Set(LOJAS.map((l) => l.id));
    favoritasAtuais = Array.isArray(lista)
      ? [...new Set(lista.filter((x): x is string => typeof x === "string" && validas.has(x)))]
      : [];
  }
  return favoritasAtuais;
}

/* ---------- Ligação com o navegador ---------- */

let escutando = false;

function assinar(f: () => void) {
  ouvintes.add(f);
  if (!escutando) {
    escutando = true;
    // Outra aba mudou o carrinho ou as favoritas: relê.
    window.addEventListener("storage", (e) => {
      if (e.key === null || e.key === CHAVE_CARRINHO) carrinhoAtual = null;
      if (e.key === null || e.key === CHAVE_FAVORITAS) favoritasAtuais = null;
      avisar();
    });
  }
  return () => {
    ouvintes.delete(f);
  };
}

const semNada = () => null;

export function useCarrinho() {
  const estado = useSyncExternalStore(assinar, lerCarrinho, semNada);
  const carrinho = estado?.carrinho ?? CARRINHO_VAZIO;
  return {
    /** Falso só no primeiro instante, antes de ler o que estava salvo. */
    pronto: estado !== null,
    carrinho,
    loja: LOJAS.find((l) => l.id === carrinho.lojaId),
    avisos: estado?.avisos ?? [],
  };
}

function aplicar(r: ResultadoAdicionar): ResultadoAdicionar {
  if (r.tipo === "ok") gravarCarrinho(r.carrinho);
  return r;
}

/** Ações do carrinho. Podem ser chamadas de qualquer tela. */
export const acoesCarrinho = {
  editar: (chave: string, p: Pedido) => aplicar(editar(lerCarrinho().carrinho, chave, p)),
  adicionar: (p: Pedido) => aplicar(adicionar(lerCarrinho().carrinho, p)),
  substituirPor: (p: Pedido) => aplicar(substituirPor(lerCarrinho().carrinho, p)),
  alterarQuantidade: (chave: string, q: number) =>
    gravarCarrinho(alterarQuantidade(lerCarrinho().carrinho, chave, q)),
  remover: (chave: string) => gravarCarrinho(remover(lerCarrinho().carrinho, chave)),
  definirModo: (modo: Modo) => gravarCarrinho(definirModo(lerCarrinho().carrinho, modo)),
  aceitarPrecos: (loja: Loja) => gravarCarrinho(aceitarPrecos(lerCarrinho().carrinho, loja)),
  esvaziar: () => gravarCarrinho({ ...CARRINHO_VAZIO, modo: lerCarrinho().carrinho.modo }, []),
  dispensarAvisos: () => gravarCarrinho(lerCarrinho().carrinho, []),
};

export function useFavorita(lojaId: string) {
  const lista = useSyncExternalStore(assinar, lerFavoritas, semNada);
  return {
    pronto: lista !== null,
    favorita: lista?.includes(lojaId) ?? false,
    alternar: () => {
      const atual = lerFavoritas();
      favoritasAtuais = atual.includes(lojaId)
        ? atual.filter((id) => id !== lojaId)
        : [...atual, lojaId];
      gravarTexto(CHAVE_FAVORITAS, JSON.stringify(favoritasAtuais));
      avisar();
    },
  };
}

/* ---------- Hora atual (muda de minuto em minuto) ---------- */

const minutoAtual = () => Math.floor(Date.now() / 60000);

function assinarRelogio(f: () => void) {
  const id = window.setInterval(f, 15000);
  document.addEventListener("visibilitychange", f);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", f);
  };
}

/** Hora atual, ou null no primeiro instante. Atualiza sozinha. */
export function useAgora(): Date | null {
  const minuto = useSyncExternalStore(assinarRelogio, minutoAtual, semNada);
  return minuto === null ? null : new Date(minuto * 60000);
}
