"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  /** Chamado quando a pessoa fecha (Esc, toque fora ou botão). */
  aoFechar: () => void;
  /** Texto que descreve a janela para leitores de tela. */
  rotulo: string;
  /** "folha" ocupa a tela no celular; "aviso" é uma caixa pequena no centro. */
  formato?: "folha" | "aviso";
  children: ReactNode;
};

/** Janela por cima da tela. Prende o foco, fecha com Esc e trava a rolagem do fundo. */
export function Dialogo({ aoFechar, rotulo, formato = "folha", children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!el.open) el.showModal();
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    return () => {
      raiz.style.overflow = antes;
      if (el.open) el.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={rotulo}
      onCancel={(e) => {
        e.preventDefault();
        aoFechar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
      className={
        formato === "folha"
          ? "fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-texto sm:py-6"
          : "fixed inset-0 m-auto h-fit w-[calc(100%-2rem)] max-w-sm rounded-3xl bg-white p-0 text-texto"
      }
    >
      {formato === "folha" ? (
        <div className="mx-auto flex h-full w-full max-w-lg flex-col overflow-hidden bg-white sm:rounded-3xl">
          {children}
        </div>
      ) : (
        children
      )}
    </dialog>
  );
}
