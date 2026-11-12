import { FUSO_HORARIO } from "../config/entrega.ts";
import type { Horarios } from "../dados/tipos.ts";

export const DIAS = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
] as const;

export type Situacao =
  | { aberta: true; fecha: string }
  | {
      aberta: false;
      /** null quando a loja não tem nenhum horário cadastrado. */
      proxima: { diasAFrente: number; diaSemana: number; abre: string } | null;
    };

const SIGLAS: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const emMinutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Dia da semana e minutos do dia no horário de Barra do Ribeiro, em qualquer aparelho. */
export function momentoLocal(agora: Date): { diaSemana: number; minutos: number } {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO_HORARIO,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(agora);
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "";
  return {
    diaSemana: SIGLAS[valor("weekday")] ?? 0,
    minutos: Number(valor("hour")) * 60 + Number(valor("minute")),
  };
}

export function situacaoDaLoja(horarios: Horarios, agora: Date): Situacao {
  const { diaSemana, minutos } = momentoLocal(agora);

  for (const i of horarios[diaSemana]) {
    if (minutos >= emMinutos(i.abre) && minutos < emMinutos(i.fecha)) {
      return { aberta: true, fecha: i.fecha };
    }
  }

  for (let d = 0; d <= 7; d++) {
    const dia = (diaSemana + d) % 7;
    const proximo = horarios[dia]
      .filter((i) => d > 0 || emMinutos(i.abre) > minutos)
      .sort((a, b) => emMinutos(a.abre) - emMinutos(b.abre))[0];
    if (proximo) {
      return {
        aberta: false,
        proxima: { diasAFrente: d, diaSemana: dia, abre: proximo.abre },
      };
    }
  }
  return { aberta: false, proxima: null };
}

/** "18:00" vira "18h"; "14:30" vira "14h30". */
export function formatarHora(hhmm: string): string {
  const [h, m] = hhmm.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
}

/** Frase curta para mostrar na tela. */
export function textoSituacao(s: Situacao): string {
  if (s.aberta) return `Aberta até ${formatarHora(s.fecha)}`;
  if (!s.proxima) return "Fechada";
  const { diasAFrente, diaSemana, abre } = s.proxima;
  const quando =
    diasAFrente === 0 ? "hoje" : diasAFrente === 1 ? "amanhã" : DIAS[diaSemana];
  return `Fechada · abre ${quando} às ${formatarHora(abre)}`;
}

/** Lista "dia: horários" para a seção de horários da loja. */
export function tabelaDeHorarios(horarios: Horarios): { dia: string; texto: string }[] {
  // Começa na segunda, como as pessoas costumam ler.
  return [1, 2, 3, 4, 5, 6, 0].map((d) => ({
    dia: DIAS[d],
    texto:
      horarios[d].length === 0
        ? "Fechada"
        : horarios[d]
            .map((i) => `${formatarHora(i.abre)} às ${formatarHora(i.fecha)}`)
            .join(" e "),
  }));
}
