/** Mostra centavos como dinheiro: 2200 vira "R$ 22,00". */
export function formatarPreco(centavos: number): string {
  const negativo = centavos < 0;
  const abs = Math.abs(Math.round(centavos));
  const reais = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const cents = (abs % 100).toString().padStart(2, "0");
  return `${negativo ? "- " : ""}R$ ${reais},${cents}`;
}
