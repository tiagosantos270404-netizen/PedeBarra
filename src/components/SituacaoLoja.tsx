"use client";

import type { Horarios } from "@/dados/tipos";
import { situacaoDaLoja, textoSituacao } from "@/lib/horarios";
import { useAgora } from "./estado";

/** Mostra "Aberta até 23h" ou "Fechada · abre hoje às 18h", sempre com texto além da cor. */
export function SituacaoLoja({ horarios }: { horarios: Horarios }) {
  const agora = useAgora();
  if (!agora) return <span className="text-sm text-texto-2">Conferindo horário…</span>;
  const s = situacaoDaLoja(horarios, agora);
  return (
    <span className={`text-sm font-bold ${s.aberta ? "text-sucesso" : "text-marca-escuro"}`}>
      {textoSituacao(s)}
    </span>
  );
}
