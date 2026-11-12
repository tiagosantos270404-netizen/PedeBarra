/**
 * Cor personalizada da loja.
 * A partir da cor escolhida, calcula sozinho os tons que garantem boa leitura.
 */

type RGB = [number, number, number];

const TEXTO_ESCURO: RGB = [34, 26, 28]; // #221A1C

function lerHex(cor: string): RGB | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(cor.trim());
  if (!m) return null;
  const h = m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
}

function paraHex(rgb: RGB): string {
  return (
    "#" +
    rgb
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function luminancia(rgb: RGB): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
}

/** Contraste entre duas cores, de 1 (igual) a 21 (preto no branco). */
export function contraste(a: string, b: string): number {
  const ra = lerHex(a);
  const rb = lerHex(b);
  if (!ra || !rb) return 1;
  const la = luminancia(ra);
  const lb = luminancia(rb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export type CoresDaLoja = {
  /** A cor escolhida pela loja. */
  cor: string;
  /** Cor do texto por cima da cor da loja (branco ou escuro). */
  sobre: string;
  /** Versão escura, para texto e detalhes sobre fundo branco. */
  escura: string;
  /** Versão bem clara, para fundos de etiquetas. */
  clara: string;
};

const PADRAO = "#E8213D";

export function coresDaLoja(corEscolhida: string): CoresDaLoja {
  const rgb = lerHex(corEscolhida) ?? (lerHex(PADRAO) as RGB);
  const cor = paraHex(rgb);
  const L = luminancia(rgb);
  const comBranco = 1.05 / (L + 0.05);
  const comEscuro = (L + 0.05) / (luminancia(TEXTO_ESCURO) + 0.05);
  const sobre = comBranco >= comEscuro ? "#ffffff" : "#221a1c";

  // Escurece aos poucos até dar leitura boa sobre o tom claro e sobre branco.
  const clara = paraHex(rgb.map((v) => v + (255 - v) * 0.86) as RGB);
  let escuraRgb = rgb;
  let k = 1;
  while (k > 0.1 && contraste(paraHex(escuraRgb), clara) < 4.5) {
    k -= 0.05;
    escuraRgb = rgb.map((v) => v * k) as RGB;
  }
  return { cor, sobre, escura: paraHex(escuraRgb), clara };
}
