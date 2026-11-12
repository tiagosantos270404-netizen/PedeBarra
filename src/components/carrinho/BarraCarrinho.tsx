"use client";

import Link from "next/link";
import { resumir } from "@/lib/carrinho";
import { formatarPreco } from "@/lib/dinheiro";
import { useCarrinho } from "../estado";

/**
 * Barra fixa no pé da tela com a quantidade e o subtotal dos produtos.
 * Sempre na cor do Pede Barra, mesmo dentro de uma loja com cor própria.
 * Reserva o próprio espaço no fim da página para nunca cobrir o conteúdo.
 */
export function BarraCarrinho() {
  const { carrinho, loja } = useCarrinho();
  const resumo = resumir(carrinho, loja);
  const tem = resumo.quantidade > 0;
  return (
    <>
      <p className="sr-only" role="status">
        {tem
          ? `Carrinho: ${resumo.quantidade} ${resumo.quantidade === 1 ? "item" : "itens"}, subtotal ${formatarPreco(resumo.subtotalCentavos)}`
          : ""}
      </p>
      {tem && (
        <>
          <div className="h-24" aria-hidden="true" />
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-borda bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <Link
              href="/carrinho"
              className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 rounded-2xl bg-marca-escuro px-5 text-base font-extrabold text-white"
            >
              <span>
                Ver carrinho · {resumo.quantidade}{" "}
                {resumo.quantidade === 1 ? "item" : "itens"}
              </span>
              <span>{formatarPreco(resumo.subtotalCentavos)}</span>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
