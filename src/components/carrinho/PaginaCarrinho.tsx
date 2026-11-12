"use client";

import Link from "next/link";
import { useState } from "react";
import { AREA_ATENDIDA, TAXA_ENTREGA_CENTAVOS } from "@/config/entrega";
import {
  conferir,
  resumir,
  QUANTIDADE_MAXIMA,
  type Linha,
  type Problema,
} from "@/lib/carrinho";
import { formatarPreco } from "@/lib/dinheiro";
import { situacaoDaLoja, textoSituacao } from "@/lib/horarios";
import { useCarrinho, useAgora, acoesCarrinho } from "../estado";
import { AvisoExemplo } from "../AvisoExemplo";
import { IconeCheck, IconeSacola, IconeVoltar } from "../ui/Icones";
import { Quantidade } from "../ui/Quantidade";
import { FolhaProduto } from "../loja/FolhaProduto";

export function PaginaCarrinho() {
  const { pronto, carrinho, loja, avisos } = useCarrinho();
  const agora = useAgora();
  const [edicao, setEdicao] = useState<Linha | null>(null);
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [erro, setErro] = useState("");
  const [concluido, setConcluido] = useState(false);
  const resumo = resumir(carrinho, loja);
  const situacao = loja && agora ? situacaoDaLoja(loja.horarios, agora) : null;
  const bloqueio = !situacao
    ? "Conferindo horário…"
    : !situacao.aberta
      ? textoSituacao(situacao)
      : null;

  function concluir() {
    const encontrados = conferir(carrinho, loja, new Date());
    setProblemas(encontrados);
    if (encontrados.length) return;
    setConcluido(true);
    acoesCarrinho.esvaziar();
    window.scrollTo(0, 0);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-10">
      <header className="flex items-center gap-3 py-5">
        <Link
          href={loja ? `/loja/${loja.id}` : "/"}
          aria-label="Voltar ao catálogo"
          className="flex size-11 items-center justify-center rounded-xl border border-borda"
        >
          <IconeVoltar />
        </Link>
        <h1 className="text-2xl">Teu carrinho</h1>
      </header>
      <AvisoExemplo>
        Esta é uma simulação. Nenhum pedido será enviado e nenhum valor será
        cobrado.
      </AvisoExemplo>
      {avisos.length > 0 && (
        <div
          role="status"
          className="mt-4 rounded-xl bg-aviso-claro p-4 text-sm text-aviso"
        >
          {avisos.map((a) => (
            <p key={a}>{a}</p>
          ))}
          <button
            onClick={acoesCarrinho.dispensarAvisos}
            className="mt-2 min-h-11 font-bold"
          >
            Entendi
          </button>
        </div>
      )}
      {!pronto ? (
        <p role="status" className="py-12 text-center">
          Recuperando teu carrinho…
        </p>
      ) : concluido ? (
        <section className="py-16 text-center">
          <IconeCheck tamanho={48} className="mx-auto text-sucesso" />
          <h2 className="mt-5 text-2xl">Simulação concluída</h2>
          <p className="mt-3">
            Pedido de demonstração. Nada foi enviado ou cobrado.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-marca-escuro px-6 font-bold text-white"
          >
            Voltar às lojas
          </Link>
        </section>
      ) : !loja || resumo.linhas.length === 0 ? (
        <section className="py-16 text-center">
          <IconeSacola tamanho={48} className="mx-auto text-marca-escuro" />
          <h2 className="mt-5 text-xl">Teu carrinho está vazio</h2>
          <p className="mt-2 text-texto-2">
            Escolha uma loja e conheça os produtos de exemplo.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-marca-escuro px-6 font-bold text-white"
          >
            Explorar lojas
          </Link>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 py-6">
            <h2 className="text-xl">{loja.nome}</h2>
            <Link
              href={`/loja/${loja.id}`}
              className="flex min-h-11 items-center text-sm font-bold text-marca-escuro"
            >
              Adicionar mais itens
            </Link>
          </div>
          {bloqueio && (
            <p
              role="status"
              className="mb-4 rounded-xl bg-marca-claro p-3 text-sm font-bold text-marca-escuro"
            >
              {bloqueio}. O carrinho fica salvo para depois.
            </p>
          )}
          <ul className="divide-y divide-borda rounded-2xl border border-borda px-4">
            {resumo.linhas.map((linha) => (
              <li key={linha.item.chave} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <h3>{linha.produto.nome}</h3>
                  <strong className="shrink-0">
                    {formatarPreco(linha.totalCentavos)}
                  </strong>
                </div>
                <p className="mt-1 text-xs text-texto-2">
                  {formatarPreco(linha.unitarioCentavos)} por unidade
                </p>
                {linha.opcoes.map((opcao) => (
                  <p key={opcao} className="mt-1 text-sm text-texto-2">
                    {opcao}
                  </p>
                ))}
                {linha.item.observacao && (
                  <p className="mt-1 text-sm text-texto-2">
                    Observação: {linha.item.observacao}
                  </p>
                )}
                {linha.esgotado && (
                  <p className="mt-2 font-bold text-marca-escuro">
                    Esgotado — remova este item para continuar.
                  </p>
                )}
                {linha.precoMudou && (
                  <p className="mt-2 text-sm font-bold text-marca-escuro">
                    Preço atualizado: antes{" "}
                    {formatarPreco(linha.item.precoVistoCentavos)}, agora{" "}
                    {formatarPreco(linha.unitarioCentavos)} por unidade.
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setErro("");
                        setEdicao(linha);
                      }}
                      className="min-h-11 text-sm font-bold text-marca-escuro"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        acoesCarrinho.remover(linha.item.chave);
                        setProblemas([]);
                      }}
                      className="min-h-11 text-sm text-texto-2"
                      aria-label={`Remover item ${linha.produto.nome}`}
                    >
                      Remover
                    </button>
                  </div>
                  <Quantidade
                    valor={linha.item.quantidade}
                    maximo={QUANTIDADE_MAXIMA}
                    nome={linha.produto.nome}
                    removeNoZero
                    aoMudar={(q) => {
                      acoesCarrinho.alterarQuantidade(linha.item.chave, q);
                      setProblemas([]);
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <fieldset className="mt-7">
            <legend className="mb-3 text-lg font-extrabold">
              Como tu quer receber?
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(["entrega", "retirada"] as const).map((modo) => (
                <label
                  key={modo}
                  className={`flex min-h-20 cursor-pointer items-center gap-3 rounded-2xl border p-3 ${carrinho.modo === modo ? "border-marca-escuro bg-marca-fundo" : "border-borda"}`}
                >
                  <input
                    type="radio"
                    name="modo"
                    value={modo}
                    checked={carrinho.modo === modo}
                    onChange={() => acoesCarrinho.definirModo(modo)}
                    className="size-5 shrink-0 accent-marca-escuro"
                  />
                  <span className="text-sm font-bold">
                    {modo === "entrega" ? "Entrega" : "Retirada na loja"}
                    <span className="mt-1 block font-medium text-texto-2">
                      {modo === "entrega"
                        ? formatarPreco(TAXA_ENTREGA_CENTAVOS)
                        : "Grátis"}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="mt-3 text-sm text-texto-2">
            {carrinho.modo === "entrega"
              ? `${AREA_ATENDIDA} Nesta demonstração, não coletamos endereço nem validamos cobertura.`
              : "Retirada sem taxa e sem endereço de entrega. Não vá à loja: este pedido é apenas uma simulação."}
          </p>
          <section className="mt-6 rounded-2xl bg-cinza p-4">
            <h2 className="text-base">Pagamento — demonstração</h2>
            <p className="mt-2 text-sm text-texto-2">
              {loja.pagamentos.join(" · ")}. Apenas informativo; não informe
              dados de pagamento.
            </p>
          </section>
          <dl className="my-6 space-y-3">
            <div className="flex justify-between">
              <dt>Subtotal dos produtos</dt>
              <dd>{formatarPreco(resumo.subtotalCentavos)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>
                {carrinho.modo === "entrega"
                  ? "Taxa de entrega"
                  : "Frete da retirada"}
              </dt>
              <dd>{formatarPreco(resumo.freteCentavos)}</dd>
            </div>
            <div className="flex justify-between border-t border-borda pt-4 text-xl font-extrabold">
              <dt>Total</dt>
              <dd>{formatarPreco(resumo.totalCentavos)}</dd>
            </div>
          </dl>
          {resumo.linhas.some((l) => l.precoMudou) && (
            <button
              onClick={() => {
                acoesCarrinho.aceitarPrecos(loja);
                setProblemas([]);
              }}
              className="mb-4 min-h-12 w-full rounded-xl border border-marca-escuro px-3 font-bold text-marca-escuro"
            >
              Aceitar preços atualizados
            </button>
          )}
          {problemas.length > 0 && (
            <div
              role="alert"
              className="mb-4 rounded-xl bg-marca-claro p-4 text-sm font-bold text-marca-escuro"
            >
              {problemas.map((p) => (
                <p key={p.tipo}>
                  {p.tipo === "vazio"
                    ? "O carrinho está vazio."
                    : p.tipo === "loja-fechada"
                      ? "A loja está fechada. Aguarde a próxima abertura."
                      : p.tipo === "esgotado"
                        ? `Remova os produtos esgotados: ${p.nomes.join(", ")}.`
                        : `Confira e aceite os novos preços: ${p.nomes.join(", ")}.`}
                </p>
              ))}
            </div>
          )}
          <button
            disabled={!!bloqueio}
            onClick={concluir}
            className="min-h-14 w-full rounded-2xl bg-marca-escuro px-4 text-lg font-extrabold text-white disabled:bg-cinza disabled:text-texto-2"
          >
            Concluir simulação
          </button>
          <p className="mt-3 text-center text-xs text-texto-2">
            Nenhum pagamento ou pedido real.
          </p>
        </>
      )}
      {erro && (
        <p role="alert" className="mt-4 text-marca-escuro">
          {erro}
        </p>
      )}
      {edicao && loja && (
        <FolhaProduto
          key={edicao.item.chave}
          produto={edicao.produto}
          bloqueio={bloqueio}
          inicial={{
            selecao: edicao.item.opcoes,
            observacao: edicao.item.observacao,
            quantidade: edicao.item.quantidade,
          }}
          aoFechar={() => setEdicao(null)}
          aoAdicionar={(selecao, observacao, quantidade) => {
            if (!situacaoDaLoja(loja.horarios, new Date()).aberta) {
              setErro("A loja fechou. O item original foi preservado.");
              setEdicao(null);
              return;
            }
            const r = acoesCarrinho.editar(edicao.item.chave, {
              loja,
              produto: edicao.produto,
              selecao,
              observacao,
              quantidade,
            });
            if (r.tipo === "invalido") setErro(r.motivo);
            setEdicao(null);
            setProblemas([]);
          }}
        />
      )}
    </main>
  );
}
