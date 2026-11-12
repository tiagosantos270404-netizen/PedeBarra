"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { Loja, Produto } from "@/dados/tipos";
import { AREA_ATENDIDA, TAXA_ENTREGA_CENTAVOS } from "@/config/entrega";
import { buscarProdutos } from "@/lib/busca";
import { coresDaLoja } from "@/lib/cores";
import { formatarPreco } from "@/lib/dinheiro";
import {
  situacaoDaLoja,
  tabelaDeHorarios,
  textoSituacao,
} from "@/lib/horarios";
import { temEscolhaObrigatoria, type Pedido } from "@/lib/carrinho";
import { acoesCarrinho, useAgora, useCarrinho } from "../estado";
import { AvisoExemplo } from "../AvisoExemplo";
import { SituacaoLoja } from "../SituacaoLoja";
import { BarraCarrinho } from "../carrinho/BarraCarrinho";
import { IconeBusca, IconeMais, IconeVoltar } from "../ui/Icones";
import { Ilustracao } from "../ui/Ilustracao";
import { Favoritar } from "./Favoritar";
import { FolhaProduto } from "./FolhaProduto";
import { TrocarLoja } from "./TrocarLoja";

export function PaginaLoja({ loja }: { loja: Loja }) {
  const [busca, setBusca] = useState("");
  const [produto, setProduto] = useState<Produto | null>(null);
  const [pendente, setPendente] = useState<Pedido | null>(null);
  const [mensagem, setMensagem] = useState("");
  const agora = useAgora();
  const { loja: lojaAtual } = useCarrinho();
  const situacao = agora ? situacaoDaLoja(loja.horarios, agora) : null;
  const bloqueio = !situacao
    ? "Conferindo horário…"
    : !situacao.aberta
      ? textoSituacao(situacao)
      : null;
  const cores = coresDaLoja(loja.cor);
  const estilo = {
    "--loja": cores.cor,
    "--loja-sobre": cores.sobre,
    "--loja-escura": cores.escura,
    "--loja-clara": cores.clara,
  } as CSSProperties;
  const encontrados = buscarProdutos(loja.produtos, busca);
  const secoes = loja.secoes.filter((s) =>
    encontrados.some((p) => p.secaoId === s.id),
  );

  function adicionar(pedido: Pedido, trocar = false) {
    // Confere o relógio novamente no clique, mesmo se o diálogo ficou aberto.
    if (!situacaoDaLoja(loja.horarios, new Date()).aberta) {
      setMensagem("A loja fechou. Teu carrinho foi preservado.");
      setPendente(null);
      return;
    }
    const resultado = trocar
      ? acoesCarrinho.substituirPor(pedido)
      : acoesCarrinho.adicionar(pedido);
    if (resultado.tipo === "outra-loja") {
      setProduto(null);
      setPendente(pedido);
    } else if (resultado.tipo === "invalido") {
      setMensagem(resultado.motivo);
    } else {
      setProduto(null);
      setPendente(null);
      setMensagem(`${pedido.produto.nome} adicionado ao carrinho.`);
    }
  }

  function rapido(p: Produto) {
    if (bloqueio || p.esgotado) return;
    if (temEscolhaObrigatoria(p)) setProduto(p);
    else
      adicionar({
        loja,
        produto: p,
        selecao: {},
        observacao: "",
        quantidade: 1,
      });
  }

  function card(p: Produto, destaque = false) {
    return (
      <article
        key={p.id}
        className={`relative rounded-2xl border border-borda bg-white ${destaque ? "w-64 shrink-0" : "w-full"}`}
      >
        <button
          type="button"
          onClick={() => setProduto(p)}
          aria-label={`Ver detalhes de ${p.nome}`}
          className={`flex w-full gap-4 p-4 pb-14 text-left ${destaque ? "flex-col" : "items-start"}`}
        >
          <div className={`min-w-0 flex-1 ${destaque ? "order-2" : ""}`}>
            <h3 className="text-base">{p.nome}</h3>
            <p className="mt-1 text-sm text-texto-2">{p.descricao}</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-2 pr-10">
              <span className="font-bold">
                {formatarPreco(p.precoCentavos)}
              </span>
              {p.precoAnteriorCentavos !== undefined && (
                <s className="text-xs text-texto-2">
                  <span className="sr-only">Preço anterior: </span>
                  {formatarPreco(p.precoAnteriorCentavos)}
                </s>
              )}
            </div>
            {p.esgotado && (
              <span className="mt-2 inline-block rounded-lg bg-cinza px-2 py-1 text-xs font-bold">
                Esgotado
              </span>
            )}
          </div>
          <div className={destaque ? "w-full" : "w-24 shrink-0 sm:w-28"}>
            <Ilustracao
              tipo={p.ilustracao}
              className={`w-full rounded-xl ${destaque ? "h-28" : "h-24"} ${p.esgotado ? "opacity-50" : ""}`}
            />
            <span className="mt-1 block text-center text-[10px] text-texto-2">
              Imagem ilustrativa
            </span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => rapido(p)}
          disabled={!!bloqueio || p.esgotado}
          aria-label={`Adicionar ${p.nome}`}
          className="absolute bottom-2 right-2 flex size-11 items-center justify-center rounded-xl border border-borda bg-white text-marca-escuro disabled:bg-cinza disabled:text-texto-2"
        >
          <IconeMais />
        </button>
      </article>
    );
  }

  return (
    <div style={estilo}>
      <header className="bg-[var(--loja)] text-[var(--loja-sobre)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 text-lg font-bold"
          >
            <IconeVoltar /> Todas as lojas
          </Link>
          <span className="text-lg font-bold">pede barra</span>
        </div>
        <div className="mx-auto flex max-w-4xl items-center gap-5 px-4 pb-10 pt-6">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl border-2 border-current text-3xl font-extrabold">
            {loja.sigla}
          </div>
          <div>
            <p className="text-lg font-bold">{loja.tipo}</p>
            <h1 className="mt-1 text-2xl sm:text-4xl">{loja.nome}</h1>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <SituacaoLoja horarios={loja.horarios} />
          <Favoritar lojaId={loja.id} nome={loja.nome} />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <span>
            {loja.tempoMin}–{loja.tempoMax} min estimados
          </span>
          <span>Entrega {formatarPreco(TAXA_ENTREGA_CENTAVOS)}</span>
          <span className="text-sucesso">Retirada grátis</span>
        </div>
        <details className="my-4 rounded-xl border border-borda px-4">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-bold">
            Horários e formas de pagamento
          </summary>
          <dl className="space-y-2 border-t border-borda py-3 text-sm">
            {tabelaDeHorarios(loja.horarios).map((h) => (
              <div key={h.dia} className="flex justify-between gap-3">
                <dt className="capitalize">{h.dia}</dt>
                <dd>{h.texto}</dd>
              </div>
            ))}
          </dl>
          <p className="pb-3 text-sm text-texto-2">
            Pagamentos previstos (demonstração): {loja.pagamentos.join(" · ")}.
            Nenhuma cobrança será feita.
          </p>
        </details>
        <AvisoExemplo>
          Modo demonstração: produtos, preços e horários são exemplos, não o
          catálogo real da loja.
        </AvisoExemplo>
        <p className="mt-3 text-xs text-texto-2">{AREA_ATENDIDA}</p>
        {situacao && !situacao.aberta && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-marca-claro p-4 font-semibold text-marca-escuro"
          >
            {textoSituacao(situacao)}. Pode olhar o catálogo; os pedidos estão
            indisponíveis.
          </p>
        )}
        <label className="my-6 flex min-h-12 items-center gap-3 rounded-2xl bg-cinza px-4">
          <IconeBusca className="shrink-0 text-texto-2" />
          <span className="sr-only">Buscar nesta loja</span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="O que tu procura nesta loja?"
            className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none"
          />
        </label>
        <p role="status" className="sr-only">
          {busca ? `${encontrados.length} produtos encontrados` : ""}
        </p>
        {!busca.trim() && (
          <section aria-labelledby="destaques">
            <h2 id="destaques" className="text-xl">
              Destaques da loja
            </h2>
            <p className="mt-1 text-sm text-texto-2">
              Uma seleção para conhecer o catálogo.
            </p>
            <div className="sem-barra -mx-1 flex gap-3 overflow-x-auto px-1 py-4">
              {loja.destaques
                .map((id) => loja.produtos.find((p) => p.id === id))
                .filter((p): p is Produto => !!p)
                .map((p) => card(p, true))}
            </div>
          </section>
        )}
        <nav
          aria-label="Seções do catálogo"
          className="sem-barra sticky top-0 z-10 -mx-4 flex gap-2 overflow-x-auto border-b border-borda bg-white px-4 py-3"
        >
          {secoes.map((s) => (
            <a
              key={s.id}
              href={`#secao-${s.id}`}
              className="flex min-h-11 shrink-0 items-center rounded-xl bg-[var(--loja-clara)] px-4 text-sm font-bold text-[var(--loja-escura)]"
            >
              {s.nome}
            </a>
          ))}
        </nav>
        {secoes.map((s) => (
          <section
            key={s.id}
            id={`secao-${s.id}`}
            className="scroll-mt-24 py-6"
          >
            <h2 className="mb-4 text-xl">{s.nome}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {encontrados
                .filter((p) => p.secaoId === s.id)
                .map((p) => card(p))}
            </div>
          </section>
        ))}
        {encontrados.length === 0 && (
          <div className="py-12 text-center">
            <h2>Nenhum produto encontrado</h2>
            <p className="mt-2 text-texto-2">
              Tente outro nome ou uma palavra da descrição.
            </p>
            <button
              onClick={() => setBusca("")}
              className="mt-3 min-h-11 px-4 font-bold text-marca-escuro"
            >
              Limpar busca
            </button>
          </div>
        )}
        <p role="status" className="py-3 text-sm font-semibold text-sucesso">
          {mensagem}
        </p>
      </main>
      <BarraCarrinho />
      {produto && (
        <FolhaProduto
          key={produto.id}
          produto={produto}
          bloqueio={bloqueio}
          aoFechar={() => setProduto(null)}
          aoAdicionar={(selecao, observacao, quantidade) =>
            adicionar({ loja, produto, selecao, observacao, quantidade })
          }
        />
      )}
      {pendente && (
        <TrocarLoja
          lojaAtual={lojaAtual?.nome ?? "outra loja"}
          lojaNova={loja.nome}
          aoManter={() => setPendente(null)}
          aoTrocar={() => adicionar(pendente, true)}
        />
      )}
    </div>
  );
}
