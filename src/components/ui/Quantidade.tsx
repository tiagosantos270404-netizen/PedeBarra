"use client";

import { IconeLixeira, IconeMais, IconeMenos } from "./Icones";

type Props = {
  valor: number;
  aoMudar: (novo: number) => void;
  maximo: number;
  /** Nome do produto, para leitores de tela. */
  nome: string;
  /** Quando verdadeiro, diminuir de 1 remove o item (mostra a lixeira). */
  removeNoZero?: boolean;
};

/** Botões de menos e mais com a quantidade no meio. */
export function Quantidade({ valor, aoMudar, maximo, nome, removeNoZero = false }: Props) {
  const noMinimo = valor <= 1;
  const botao =
    "flex size-11 items-center justify-center rounded-xl text-marca-escuro disabled:text-borda";
  return (
    <div className="inline-flex items-center rounded-xl border border-borda bg-white">
      <button
        type="button"
        className={botao}
        disabled={noMinimo && !removeNoZero}
        onClick={() => aoMudar(valor - 1)}
        aria-label={noMinimo && removeNoZero ? `Remover ${nome}` : `Diminuir quantidade de ${nome}`}
      >
        {noMinimo && removeNoZero ? <IconeLixeira tamanho={20} /> : <IconeMenos tamanho={20} />}
      </button>
      <span className="min-w-8 text-center font-bold tabular-nums" aria-live="polite">
        <span className="sr-only">Quantidade: </span>
        {valor}
      </span>
      <button
        type="button"
        className={botao}
        disabled={valor >= maximo}
        onClick={() => aoMudar(valor + 1)}
        aria-label={`Aumentar quantidade de ${nome}`}
      >
        <IconeMais tamanho={20} />
      </button>
    </div>
  );
}
