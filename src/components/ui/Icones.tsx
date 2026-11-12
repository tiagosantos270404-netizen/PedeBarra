import type { SVGProps } from "react";
import type { CategoriaId } from "@/dados/tipos";

/** Ícones de traço simples, todos no mesmo estilo. */

type Props = { tamanho?: number } & SVGProps<SVGSVGElement>;

function Base({ tamanho = 22, children, ...resto }: Props) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...resto}
    >
      {children}
    </svg>
  );
}

export const IconeVoltar = (p: Props) => (
  <Base {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Base>
);
export const IconeBusca = (p: Props) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </Base>
);
export const IconeMais = (p: Props) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);
export const IconeMenos = (p: Props) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
);
export const IconeFechar = (p: Props) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);
export const IconeLixeira = (p: Props) => (
  <Base {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5" />
  </Base>
);
export const IconeCoracao = ({ cheio, ...p }: Props & { cheio?: boolean }) => (
  <Base {...p} fill={cheio ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" />
  </Base>
);
export const IconeRelogio = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.500V12l3 2" />
  </Base>
);
export const IconeEntrega = (p: Props) => (
  <Base {...p}>
    <circle cx="6" cy="17" r="2.5" />
    <circle cx="18" cy="17" r="2.5" />
    <path d="M8.5 17h7M15.5 17l-2-8h-3M13.5 9h3l2 4.500M4 12h5l2 5" />
  </Base>
);
export const IconeSacola = (p: Props) => (
  <Base {...p}>
    <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" />
  </Base>
);
export const IconeCheck = (p: Props) => (
  <Base {...p}>
    <path d="M5 12.500l4.5 4.500L19 7.5" />
  </Base>
);
export const IconeInfo = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8v.01" />
  </Base>
);

const FUNDO: Record<CategoriaId, string> = {
  restaurantes: "fill-restaurantes",
  farmacias: "fill-farmacias",
  mercados: "fill-mercados",
  flash: "fill-flash",
  lojas: "fill-lojas",
};

/** Ícone quadrado da categoria, igual ao do material de apresentação. */
export function IconeCategoria({
  categoria,
  tamanho = 56,
}: {
  categoria: CategoriaId;
  tamanho?: number;
}) {
  const claro = categoria === "flash" ? "fill-texto stroke-texto" : "fill-white stroke-white";
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <rect width="120" height="120" rx="30" className={FUNDO[categoria]} />
      <g className={claro} strokeLinecap="round" strokeLinejoin="round">
        {categoria === "restaurantes" && (
          <>
            <path d="M30 76a30 30 0 0 1 60 0z" stroke="none" />
            <circle cx="60" cy="40" r="5" stroke="none" />
            <path d="M22 84h76" fill="none" strokeWidth="7" />
          </>
        )}
        {categoria === "farmacias" && (
          <>
            <rect x="48" y="26" width="24" height="68" rx="7" stroke="none" />
            <rect x="26" y="48" width="68" height="24" rx="7" stroke="none" />
          </>
        )}
        {categoria === "mercados" && (
          <>
            <path d="M22 32h12l9 40h42l8-28H38" fill="none" strokeWidth="7" />
            <circle cx="48" cy="88" r="7" stroke="none" />
            <circle cx="80" cy="88" r="7" stroke="none" />
          </>
        )}
        {categoria === "flash" && <path d="M68 16L32 66h24l-6 38 38-52H64z" strokeWidth="3" />}
        {categoria === "lojas" && (
          <>
            <path d="M22 48l9-20h58l9 20z" stroke="none" />
            <rect x="31" y="54" width="58" height="40" rx="4" fill="none" strokeWidth="6" />
            <rect x="52" y="68" width="16" height="26" stroke="none" />
          </>
        )}
      </g>
    </svg>
  );
}
