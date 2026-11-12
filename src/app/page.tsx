import Link from "next/link";
import { LOJAS } from "@/dados/lojas";
import { Logo } from "@/components/Logo";
import { AvisoExemplo } from "@/components/AvisoExemplo";
import { SituacaoLoja } from "@/components/SituacaoLoja";
import { BarraCarrinho } from "@/components/carrinho/BarraCarrinho";
import { IconeCategoria } from "@/components/ui/Icones";
import { coresDaLoja } from "@/lib/cores";
import { formatarPreco } from "@/lib/dinheiro";
import { AREA_ATENDIDA, TAXA_ENTREGA_CENTAVOS } from "@/config/entrega";

export default function Home() {
  return (
    <>
      <header className="border-b border-borda">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-5">
          <Logo tamanho={40} comNome />
          <span className="rounded-full bg-marca-fundo px-3 py-2 text-xs font-bold text-marca-escuro">
            Barra do Ribeiro · RS
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-5 pb-10">
        <section className="py-10 sm:py-16">
          <p className="text-sm font-bold text-marca-escuro">PERTINHO DE TI</p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Tudo de Barra do Ribeiro,
            <br />
            <span className="text-marca-escuro">na tua porta.</span>
          </h1>
          <p className="mt-4 max-w-xl text-texto-2">
            Do almoço ao cuidado do dia a dia. Conheça as lojas e experimente o
            Pede Barra.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
            <span className="rounded-xl bg-cinza px-4 py-3">
              Entrega {formatarPreco(TAXA_ENTREGA_CENTAVOS)}
            </span>
            <span className="rounded-xl bg-sucesso-claro px-4 py-3 text-sucesso">
              Retirada grátis
            </span>
          </div>
          <p className="mt-3 text-xs text-texto-2">{AREA_ATENDIDA}</p>
        </section>
        <AvisoExemplo>
          Modo demonstração. As três lojas têm produtos, preços e horários de
          exemplo. Nada será enviado ou cobrado.
        </AvisoExemplo>
        <section className="pt-8" aria-labelledby="lojas">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 id="lojas" className="text-2xl">
              Explore as lojas
            </h2>
            <span className="text-sm text-texto-2">3 lojas</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {LOJAS.map((loja) => {
              const cor = coresDaLoja(loja.cor);
              return (
                <Link
                  key={loja.id}
                  href={`/loja/${loja.id}`}
                  className="overflow-hidden rounded-3xl border border-borda transition-shadow hover:shadow-md"
                >
                  <div
                    className="flex h-28 items-center justify-between px-5"
                    style={{ background: cor.clara, color: cor.escura }}
                  >
                    <span className="text-3xl font-extrabold">
                      {loja.sigla}
                    </span>
                    <IconeCategoria categoria={loja.categoria} tamanho={48} />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-texto-2">
                      {loja.tipo}
                    </p>
                    <h3 className="mt-1 text-lg">{loja.nome}</h3>
                    <div className="mt-3">
                      <SituacaoLoja horarios={loja.horarios} />
                    </div>
                    <p className="mt-2 text-sm text-texto-2">
                      {loja.tempoMin}–{loja.tempoMax} min ·{" "}
                      {formatarPreco(TAXA_ENTREGA_CENTAVOS)}
                    </p>
                    <span className="mt-5 block text-sm font-bold text-marca-escuro">
                      Ver catálogo →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <p className="mt-10 text-center text-xs text-texto-2">
          Feito para valorizar o comércio de Barra do Ribeiro.
        </p>
      </main>
      <BarraCarrinho />
    </>
  );
}
