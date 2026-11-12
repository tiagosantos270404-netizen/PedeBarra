/** Formatos dos dados de lojas e produtos. Preços sempre em centavos. */

export type CategoriaId =
  | "restaurantes"
  | "farmacias"
  | "mercados"
  | "flash"
  | "lojas";

export type IlustracaoId =
  | "lanche"
  | "prato"
  | "porcao"
  | "bebida"
  | "sobremesa"
  | "fruta"
  | "pao"
  | "pacote"
  | "garrafa"
  | "limpeza"
  | "tubo"
  | "frasco"
  | "escova"
  | "sabonete";

/** Um período de funcionamento no dia, no formato "HH:MM". */
export type Intervalo = { abre: string; fecha: string };

/** Sete posições: 0 = domingo, 1 = segunda ... 6 = sábado. */
export type Horarios = [
  Intervalo[],
  Intervalo[],
  Intervalo[],
  Intervalo[],
  Intervalo[],
  Intervalo[],
  Intervalo[],
];

export type Opcao = {
  id: string;
  nome: string;
  /** Quanto a opção soma ao preço. 0 = sem custo. */
  precoCentavos: number;
};

export type GrupoOpcoes = {
  id: string;
  nome: string;
  /** Mínimo de opções. 1 ou mais = grupo obrigatório. */
  min: number;
  /** Máximo de opções que podem ser marcadas. */
  max: number;
  opcoes: Opcao[];
};

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  precoCentavos: number;
  /** Só existe quando a loja definiu uma promoção. Aparece riscado. */
  precoAnteriorCentavos?: number;
  ilustracao: IlustracaoId;
  secaoId: string;
  esgotado?: boolean;
  grupos?: GrupoOpcoes[];
};

export type Secao = { id: string; nome: string };

export type Loja = {
  /** Também é o endereço da página: /loja/<id> */
  id: string;
  nome: string;
  /** Letras mostradas no lugar do logo enquanto a loja não envia o dela. */
  sigla: string;
  tipo: string;
  categoria: CategoriaId;
  /** Cor escolhida pela loja para a página dela. */
  cor: string;
  tempoMin: number;
  tempoMax: number;
  horarios: Horarios;
  /** Apenas informativo nesta etapa. */
  pagamentos: string[];
  secoes: Secao[];
  produtos: Produto[];
  /** Produtos que a loja escolheu destacar (ids). */
  destaques: string[];
  /** Verdadeiro para dados de demonstração. */
  exemplo: boolean;
};
