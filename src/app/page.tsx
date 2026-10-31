import { Logo } from "@/components/Logo";

const categorias = [
  { nome: "Restaurantes", cor: "bg-restaurantes" },
  { nome: "Farmácias", cor: "bg-farmacias" },
  { nome: "Mercados", cor: "bg-mercados" },
  { nome: "Flash", cor: "bg-flash" },
  { nome: "Lojas Gerais", cor: "bg-lojas" },
];

/** Página provisória "em breve", até a tela inicial ficar pronta (etapa 1.3). */
export default function EmBreve() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="bg-gradient-to-b from-marca-topo to-marca px-4 pb-16 pt-10 text-white">
        <div className="mx-auto max-w-md">
          <Logo tom="claro" tamanho={44} />
          <h1 className="mt-10 text-4xl leading-[1.1]">
            Tudo de Barra do Ribeiro, na tua porta.
          </h1>
          <p className="mt-4 text-lg font-medium text-white/90">
            O app de delivery da nossa cidade está chegando.
          </p>
        </div>
      </section>

      <section className="-mt-8 px-4">
        <div className="mx-auto max-w-md rounded-3xl border border-borda bg-white p-6 shadow-[0_8px_30px_rgba(34,26,28,0.08)]">
          <h2 className="text-xl">O que vai ter</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {categorias.map((c) => (
              <li key={c.nome} className="flex items-center gap-3 font-semibold">
                <span className={`size-3 rounded-full ${c.cor}`} aria-hidden="true" />
                {c.nome}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-md">
          <h2 className="text-xl">Tem um comércio na cidade?</h2>
          <p className="mt-2 text-texto-2">
            Comissão bem menor que a dos apps grandes, atendimento daqui mesmo e
            uma página com a cara da tua loja.
          </p>
          <p className="mt-6 text-sm font-semibold text-marca-escuro">
            Primeiro parceiro: Léo Restaurante &amp; Lancheria
          </p>
        </div>
      </section>
    </main>
  );
}
