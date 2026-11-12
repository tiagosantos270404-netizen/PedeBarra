"use client";

import { Dialogo } from "../ui/Dialogo";

type Props = {
  lojaAtual: string;
  lojaNova: string;
  aoManter: () => void;
  aoTrocar: () => void;
};

/** Pergunta antes de esvaziar o carrinho de outra loja. */
export function TrocarLoja({ lojaAtual, lojaNova, aoManter, aoTrocar }: Props) {
  return (
    <Dialogo aoFechar={aoManter} rotulo="Trocar de loja?" formato="aviso">
      <div className="p-5">
        <h2 className="text-xl">Trocar de loja?</h2>
        <p className="mt-2 text-texto-2">
          Teu carrinho tem itens de{" "}
          <strong className="text-texto">{lojaAtual}</strong>. Cada pedido é de
          uma loja só. Para adicionar de{" "}
          <strong className="text-texto">{lojaNova}</strong>, o carrinho atual
          será esvaziado.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={aoManter}
            autoFocus
            className="min-h-12 rounded-2xl bg-marca-escuro px-4 font-extrabold text-white"
          >
            Manter carrinho atual
          </button>
          <button
            type="button"
            onClick={aoTrocar}
            className="min-h-12 rounded-2xl border border-borda px-4 font-bold text-marca-escuro"
          >
            Esvaziar e adicionar
          </button>
        </div>
      </div>
    </Dialogo>
  );
}
