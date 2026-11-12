"use client";

import { useRef, useState } from "react";
import type { GrupoOpcoes, Produto } from "@/dados/tipos";
import {
  errosDaSelecao,
  OBSERVACAO_MAXIMA,
  precoUnitario,
  QUANTIDADE_MAXIMA,
  regraDoGrupo,
  type Selecao,
} from "@/lib/carrinho";
import { formatarPreco } from "@/lib/dinheiro";
import { Dialogo } from "../ui/Dialogo";
import { IconeFechar } from "../ui/Icones";
import { Ilustracao } from "../ui/Ilustracao";
import { Quantidade } from "../ui/Quantidade";

type Props = {
  produto: Produto;
  /** Motivo pelo qual não dá para pedir agora (loja fechada), ou null. */
  bloqueio: string | null;
  aoFechar: () => void;
  aoAdicionar: (selecao: Selecao, observacao: string, quantidade: number) => void;
};

/** Tela do produto: imagem maior, opções, observações e quantidade. */
export function FolhaProduto({ produto, bloqueio, aoFechar, aoAdicionar }: Props) {
  const [selecao, setSelecao] = useState<Selecao>({});
  const [observacao, setObservacao] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [tentou, setTentou] = useState(false);
  const corpo = useRef<HTMLDivElement>(null);

  const grupos = produto.grupos ?? [];
  const erros = errosDaSelecao(produto, selecao);
  const total = precoUnitario(produto, selecao) * quantidade;
  const impedimento = produto.esgotado ? "Produto esgotado" : bloqueio;

  function alternar(g: GrupoOpcoes, id: string) {
    setSelecao((atual) => {
      const marcados = atual[g.id] ?? [];
      let novos: string[];
      if (marcados.includes(id)) {
        // Grupo obrigatório de uma opção só funciona como "escolha uma": não desmarca.
        novos = g.min === 1 && g.max === 1 ? marcados : marcados.filter((x) => x !== id);
      } else if (g.max === 1) {
        novos = [id];
      } else if (marcados.length < g.max) {
        novos = [...marcados, id];
      } else {
        novos = marcados; // limite atingido
      }
      return { ...atual, [g.id]: novos };
    });
  }

  function confirmar() {
    const pendentes = Object.keys(erros);
    if (pendentes.length > 0) {
      setTentou(true);
      // Leva a pessoa até o primeiro grupo que falta preencher.
      const alvo = corpo.current?.querySelector<HTMLElement>(`[data-grupo="${pendentes[0]}"]`);
      alvo?.scrollIntoView({ block: "center" });
      alvo?.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
      return;
    }
    aoAdicionar(selecao, observacao, quantidade);
  }

  return (
    <Dialogo aoFechar={aoFechar} rotulo={produto.nome}>
      <div ref={corpo} className="relative flex-1 overflow-y-auto overscroll-contain">
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 flex size-11 items-center justify-center rounded-full bg-white text-texto shadow-md"
        >
          <IconeFechar />
        </button>

        <Ilustracao tipo={produto.ilustracao} className="h-48 w-full" />
        <p className="px-4 pt-2 text-xs text-texto-2">Imagem ilustrativa</p>

        <div className="px-4 pb-2 pt-3">
          <h2 className="text-2xl leading-tight">{produto.nome}</h2>
          <p className="mt-1 text-texto-2">{produto.descricao}</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-extrabold">{formatarPreco(produto.precoCentavos)}</span>
            {produto.precoAnteriorCentavos !== undefined && (
              <s className="text-sm text-texto-2">
                <span className="sr-only">Preço anterior: </span>
                {formatarPreco(produto.precoAnteriorCentavos)}
              </s>
            )}
            {produto.esgotado && (
              <span className="rounded-full bg-cinza px-2.5 py-1 text-xs font-bold text-texto">
                Esgotado
              </span>
            )}
          </p>
        </div>

        {grupos.map((g) => {
          const marcados = selecao[g.id] ?? [];
          const unico = g.min === 1 && g.max === 1;
          const cheio = !unico && g.max > 1 && marcados.length >= g.max;
          const erro = tentou ? erros[g.id] : undefined;
          return (
            <fieldset key={g.id} data-grupo={g.id} className="mt-3 border-t-8 border-cinza">
              <legend className="sr-only">
                {g.nome}. {g.min > 0 ? "Obrigatório" : "Opcional"}. {regraDoGrupo(g)}.
              </legend>
              <div className="flex items-start justify-between gap-3 px-4 pt-4" aria-hidden="true">
                <div>
                  <p className="text-base font-extrabold">{g.nome}</p>
                  <p className="text-sm text-texto-2">
                    {regraDoGrupo(g)}
                    {g.max > 1 && ` · ${marcados.length} de ${g.max}`}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                    g.min > 0 ? "bg-texto text-white" : "bg-cinza text-texto-2"
                  }`}
                >
                  {g.min > 0 ? "Obrigatório" : "Opcional"}
                </span>
              </div>
              {erro && (
                <p role="alert" className="mx-4 mt-2 rounded-xl bg-marca-claro px-3 py-2 text-sm font-bold text-marca-escuro">
                  {erro}
                </p>
              )}
              <div className="px-4 pb-1">
                {g.opcoes.map((o) => {
                  const marcado = marcados.includes(o.id);
                  const travado = cheio && !marcado;
                  return (
                    <label
                      key={o.id}
                      className={`flex min-h-12 items-center gap-3 border-b border-borda py-2 last:border-b-0 ${
                        travado ? "text-texto-2" : ""
                      }`}
                    >
                      <input
                        type={unico ? "radio" : "checkbox"}
                        name={`${produto.id}-${g.id}`}
                        checked={marcado}
                        disabled={travado}
                        onChange={() => alternar(g, o.id)}
                        className="size-5 shrink-0 accent-marca-escuro"
                      />
                      <span className="flex-1 font-medium">{o.nome}</span>
                      <span className="text-sm text-texto-2">
                        {o.precoCentavos > 0 ? `+ ${formatarPreco(o.precoCentavos)}` : "Sem custo"}
                      </span>
                    </label>
                  );
                })}
              </div>
              {cheio && (
                <p className="px-4 pb-2 text-sm text-texto-2" role="status">
                  Limite de {g.max} atingido. Desmarque uma opção para trocar.
                </p>
              )}
            </fieldset>
          );
        })}

        <div className="mt-3 border-t-8 border-cinza px-4 pb-6 pt-4">
          <label htmlFor="observacao" className="text-base font-extrabold">
            Observações
          </label>
          <p id="observacao-dica" className="text-sm text-texto-2">
            Opcional. Exemplo: sem cebola.
          </p>
          <textarea
            id="observacao"
            aria-describedby="observacao-dica"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value.slice(0, OBSERVACAO_MAXIMA))}
            maxLength={OBSERVACAO_MAXIMA}
            rows={2}
            className="mt-2 w-full rounded-xl border border-borda p-3 text-base"
          />
          <p className="text-right text-xs text-texto-2">
            {observacao.length}/{OBSERVACAO_MAXIMA}
          </p>
        </div>
      </div>

      {/* Rodapé fora da área que rola: fica sempre à mão e nunca cobre os campos. */}
      <div className="flex items-center gap-3 border-t border-borda bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        {impedimento ? (
          <p className="flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-cinza px-4 text-center font-bold text-texto-2">
            {impedimento}
          </p>
        ) : (
          <>
            <Quantidade
              valor={quantidade}
              aoMudar={setQuantidade}
              maximo={QUANTIDADE_MAXIMA}
              nome={produto.nome}
            />
            <button
              type="button"
              onClick={confirmar}
              className="flex min-h-12 flex-1 items-center justify-between gap-2 rounded-2xl bg-marca px-4 font-extrabold text-white"
            >
              <span>Adicionar</span>
              <span>{formatarPreco(total)}</span>
            </button>
          </>
        )}
      </div>
    </Dialogo>
  );
}
