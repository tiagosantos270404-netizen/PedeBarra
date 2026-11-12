"use client";

import { useState } from "react";
import { useFavorita } from "../estado";
import { IconeCoracao } from "../ui/Icones";

/** Favoritar a loja, sem login: fica salvo só neste navegador. */
export function Favoritar({ lojaId, nome }: { lojaId: string; nome: string }) {
  const { pronto, favorita, alternar } = useFavorita(lojaId);
  const [mensagem, setMensagem] = useState("");
  return (
    <div className="relative">
      <button
        type="button"
        disabled={!pronto}
        aria-pressed={favorita}
        aria-label={`Favoritar ${nome}`}
        onClick={() => {
          setMensagem(
            favorita
              ? "Removida das favoritas."
              : "Loja favoritada. Fica salvo só neste navegador.",
          );
          alternar();
        }}
        className="flex size-11 items-center justify-center rounded-full bg-white text-marca shadow-md"
      >
        <IconeCoracao cheio={favorita} />
      </button>
      <p
        role="status"
        className={`absolute right-0 top-13 z-10 w-56 rounded-xl bg-texto px-3 py-2 text-sm font-medium text-white ${
          mensagem ? "" : "hidden"
        }`}
      >
        {mensagem}
      </p>
    </div>
  );
}
