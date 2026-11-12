import type { ReactNode } from "react";
import type { IlustracaoId } from "@/dados/tipos";

/**
 * Desenhos simples usados no lugar das fotos enquanto não há fotos reais.
 * São sempre apresentados como "imagem ilustrativa".
 */
const DESENHOS: Record<IlustracaoId, ReactNode> = {
  lanche: (
    <>
      <path d="M10 22a14 11 0 0 1 28 0z" />
      <path d="M8 27h32M10 32h28" />
      <path d="M10 37h28v1a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" />
    </>
  ),
  prato: (
    <>
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="8" />
    </>
  ),
  porcao: (
    <>
      <path d="M13 22h22l-3 20H16z" />
      <path d="M17 22V9M22 22V6M27 22V8M31 22V11" />
    </>
  ),
  bebida: (
    <>
      <path d="M14 14h20l-2 28H16z" />
      <path d="M13 14h22M27 14l3-9h4" />
    </>
  ),
  sobremesa: (
    <>
      <path d="M12 32l4-14h16l4 14z" />
      <path d="M8 36h32M19 18a5 4 0 0 1 10 0" />
    </>
  ),
  fruta: (
    <>
      <path d="M24 15c-9-5-15 2-13 11 2 10 8 15 13 13 5 2 11-3 13-13 2-9-4-16-13-11z" />
      <path d="M24 15c0-4 2-7 5-9" />
    </>
  ),
  pao: (
    <>
      <path d="M8 26c0-8 7-12 16-12s16 4 16 12c0 5-4 8-8 8H16c-4 0-8-3-8-8z" />
      <path d="M17 19l3 6M24 18l3 6M31 19l2 5" />
    </>
  ),
  pacote: (
    <>
      <path d="M14 10h20l2 6v24a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V16z" />
      <path d="M12 16h24M18 25h12M18 31h8" />
    </>
  ),
  garrafa: (
    <>
      <path d="M20 5h8v7l4 7v21a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V19l4-7z" />
      <path d="M16 26h16M16 34h16" />
    </>
  ),
  limpeza: (
    <>
      <path d="M17 18h14l2 6v16a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2V24z" />
      <path d="M20 18v-7h8v7M28 11h6l2 4" />
      <circle cx="24" cy="31" r="4" />
    </>
  ),
  tubo: (
    <>
      <path d="M17 8h14l-2 26H19z" />
      <path d="M19 34h10v8H19zM21 16h6" />
    </>
  ),
  frasco: (
    <>
      <path d="M16 18h16a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V20a2 2 0 0 1 2-2z" />
      <path d="M20 18v-6h8v6M22 12V7h7M19 27h10M19 33h6" />
    </>
  ),
  escova: (
    <>
      <path d="M9 39L30 18" />
      <path d="M28 10l10 10-5 5-10-10zM31 13l-3 3M35 17l-3 3" />
    </>
  ),
  sabonete: (
    <>
      <rect x="9" y="20" width="30" height="18" rx="7" />
      <path d="M17 29h14" />
      <circle cx="16" cy="11" r="3" />
      <circle cx="26" cy="9" r="2" />
    </>
  ),
};

export function Ilustracao({ tipo, className = "" }: { tipo: IlustracaoId; className?: string }) {
  return (
    <span
      className={`flex items-center justify-center bg-(--loja-clara,var(--color-cinza)) text-(--loja-escura,var(--color-texto-2)) ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        className="h-3/5 max-h-28 w-3/5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {DESENHOS[tipo]}
      </svg>
    </span>
  );
}
