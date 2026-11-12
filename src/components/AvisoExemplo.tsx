import { IconeInfo } from "./ui/Icones";

/** Faixa que deixa claro que o conteúdo é de demonstração. */
export function AvisoExemplo({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-2xl bg-aviso-claro px-3 py-2.5 text-sm font-medium text-aviso">
      <IconeInfo tamanho={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
