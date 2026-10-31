import { useId } from "react";

type LogoProps = {
  /** Tamanho do ícone em pixels. */
  tamanho?: number;
  /** Mostra o nome "pede barra" ao lado do ícone. */
  comNome?: boolean;
  /** Use "claro" quando o logo ficar sobre fundo vermelho ou escuro. */
  tom?: "escuro" | "claro";
  className?: string;
};

/** Ícone do Pede Barra: sacola branca com as ondinhas do Guaíba. */
export function LogoIcone({ tamanho = 48 }: { tamanho?: number }) {
  const id = useId();
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FB5C74" />
          <stop offset="1" stopColor="#E8213D" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />
      {/* alça */}
      <path
        d="M25 25v-5a7 7 0 0 1 14 0v5"
        fill="none"
        stroke="#fff"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* corpo da sacola */}
      <path
        d="M17 24h30l-1.8 24.6a3 3 0 0 1-3 2.8H21.8a3 3 0 0 1-3-2.8Z"
        fill="#fff"
      />
      {/* ondinhas do Guaíba */}
      <path
        d="M22 37.5q2.5-2.6 5 0t5 0 5 0 5 0M22 43.5q2.5-2.6 5 0t5 0 5 0 5 0"
        fill="none"
        stroke="#E8213D"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Logo completo: ícone + nome escrito em minúsculo. */
export function Logo({
  tamanho = 40,
  comNome = true,
  tom = "escuro",
  className = "",
}: LogoProps) {
  const corPede = tom === "claro" ? "text-white" : "text-texto";
  const corBarra = tom === "claro" ? "text-white/85" : "text-marca";
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      role="img"
      aria-label="pede barra"
    >
      <span
        className={`inline-flex rounded-[25%] ${
          tom === "claro" ? "shadow-lg shadow-black/15 ring-2 ring-white/70" : ""
        }`}
      >
        <LogoIcone tamanho={tamanho} />
      </span>
      {comNome && (
        <span
          className="font-extrabold leading-none tracking-tight"
          style={{ fontSize: tamanho * 0.6 }}
          aria-hidden="true"
        >
          <span className={corPede}>pede</span>{" "}
          <span className={corBarra}>barra</span>
        </span>
      )}
    </span>
  );
}
