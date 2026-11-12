import type { Produto } from "../dados/tipos.ts";

/** Tira acentos e maiúsculas: "Açúcar" e "acucar" passam a ser iguais. */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Busca por nome e descrição. Todas as palavras digitadas precisam aparecer. */
export function buscarProdutos(produtos: Produto[], termo: string): Produto[] {
  const palavras = normalizar(termo).split(/\s+/).filter(Boolean);
  if (palavras.length === 0) return produtos;
  return produtos.filter((p) => {
    const alvo = normalizar(`${p.nome} ${p.descricao}`);
    return palavras.every((w) => alvo.includes(w));
  });
}
