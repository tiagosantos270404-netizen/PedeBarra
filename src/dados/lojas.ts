/**
 * DADOS DE EXEMPLO (modo demonstração).
 * Lojas, produtos, preços e horários abaixo são demonstrativos: servem para
 * apresentar o app. Nada aqui é o cardápio real do Léo nem de outra loja.
 */
import type { GrupoOpcoes, Horarios, Intervalo, Loja } from "./tipos.ts";

const dia = (...intervalos: [string, string][]): Intervalo[] =>
  intervalos.map(([abre, fecha]) => ({ abre, fecha }));

const PAGAMENTOS = ["Pix", "Cartão na entrega", "Dinheiro"];

/* ---------- Léo Restaurante & Lancheria ---------- */

const horariosLeo: Horarios = [
  dia(["11:00", "14:30"], ["18:00", "23:00"]), // domingo
  [], // segunda: fechado
  dia(["11:00", "14:30"], ["18:00", "23:00"]),
  dia(["11:00", "14:30"], ["18:00", "23:00"]),
  dia(["11:00", "14:30"], ["18:00", "23:00"]),
  dia(["11:00", "14:30"], ["18:00", "23:00"]),
  dia(["11:00", "14:30"], ["18:00", "23:00"]),
];

const tamanhoXis: GrupoOpcoes = {
  id: "tamanho",
  nome: "Tamanho",
  min: 1,
  max: 1,
  opcoes: [
    { id: "normal", nome: "Normal", precoCentavos: 0 },
    { id: "grande", nome: "Grande", precoCentavos: 600 },
  ],
};

const adicionaisXis: GrupoOpcoes = {
  id: "adicionais",
  nome: "Adicionais",
  min: 0,
  max: 3,
  opcoes: [
    { id: "bacon", nome: "Bacon", precoCentavos: 400 },
    { id: "ovo", nome: "Ovo", precoCentavos: 250 },
    { id: "queijo", nome: "Queijo extra", precoCentavos: 350 },
    { id: "cheddar", nome: "Cheddar", precoCentavos: 350 },
  ],
};

const carnePrato: GrupoOpcoes = {
  id: "carne",
  nome: "Carne",
  min: 1,
  max: 1,
  opcoes: [
    { id: "bife", nome: "Bife acebolado", precoCentavos: 0 },
    { id: "frango", nome: "Frango grelhado", precoCentavos: 0 },
    { id: "peixe", nome: "Peixe frito", precoCentavos: 300 },
  ],
};

const acompanhamentos: GrupoOpcoes = {
  id: "acompanhamentos",
  nome: "Acompanhamentos",
  min: 2,
  max: 2,
  opcoes: [
    { id: "arroz", nome: "Arroz", precoCentavos: 0 },
    { id: "feijao", nome: "Feijão", precoCentavos: 0 },
    { id: "fritas", nome: "Batata frita", precoCentavos: 0 },
    { id: "salada", nome: "Salada", precoCentavos: 0 },
    { id: "massa", nome: "Massa", precoCentavos: 0 },
  ],
};

const saborRefri: GrupoOpcoes = {
  id: "sabor",
  nome: "Sabor",
  min: 1,
  max: 1,
  opcoes: [
    { id: "cola", nome: "Cola", precoCentavos: 0 },
    { id: "guarana", nome: "Guaraná", precoCentavos: 0 },
    { id: "laranja", nome: "Laranja", precoCentavos: 0 },
  ],
};

const leo: Loja = {
  id: "leo",
  nome: "Léo Restaurante & Lancheria",
  sigla: "LÉO",
  tipo: "Restaurante e lancheria",
  categoria: "restaurantes",
  cor: "#E8213D",
  tempoMin: 30,
  tempoMax: 40,
  horarios: horariosLeo,
  pagamentos: PAGAMENTOS,
  exemplo: true,
  secoes: [
    { id: "xis", nome: "Xis" },
    { id: "pratos", nome: "Pratos" },
    { id: "porcoes", nome: "Porções" },
    { id: "bebidas", nome: "Bebidas" },
    { id: "sobremesas", nome: "Sobremesas" },
  ],
  destaques: ["xis-salada", "prato-feito", "batata-frita"],
  produtos: [
    {
      id: "xis-salada",
      nome: "Xis Salada",
      descricao: "Hambúrguer, ovo, queijo, alface, tomate e milho.",
      precoCentavos: 2200,
      ilustracao: "lanche",
      secaoId: "xis",
      grupos: [tamanhoXis, adicionaisXis],
    },
    {
      id: "xis-coracao",
      nome: "Xis Coração",
      descricao: "Coração de frango, queijo, presunto e salada.",
      precoCentavos: 2800,
      ilustracao: "lanche",
      secaoId: "xis",
      grupos: [tamanhoXis, adicionaisXis],
    },
    {
      id: "xis-bacon",
      nome: "Xis Bacon",
      descricao: "Hambúrguer, bacon, queijo, ovo e salada.",
      precoCentavos: 2600,
      ilustracao: "lanche",
      secaoId: "xis",
      grupos: [tamanhoXis, adicionaisXis],
    },
    {
      id: "xis-frango",
      nome: "Xis Frango",
      descricao: "Frango desfiado, queijo, milho, ervilha e salada.",
      precoCentavos: 2500,
      ilustracao: "lanche",
      secaoId: "xis",
      esgotado: true,
      grupos: [tamanhoXis, adicionaisXis],
    },
    {
      id: "prato-feito",
      nome: "Prato feito",
      descricao: "Uma carne e dois acompanhamentos à tua escolha.",
      precoCentavos: 2400,
      ilustracao: "prato",
      secaoId: "pratos",
      grupos: [carnePrato, acompanhamentos],
    },
    {
      id: "a-la-minuta",
      nome: "À la minuta",
      descricao: "Arroz, feijão, ovo frito, batata frita, salada e a carne escolhida.",
      precoCentavos: 2900,
      ilustracao: "prato",
      secaoId: "pratos",
      grupos: [carnePrato],
    },
    {
      id: "batata-frita",
      nome: "Batata frita (porção)",
      descricao: "Serve 2 pessoas.",
      precoCentavos: 1800,
      precoAnteriorCentavos: 2200,
      ilustracao: "porcao",
      secaoId: "porcoes",
    },
    {
      id: "polenta-frita",
      nome: "Polenta frita (porção)",
      descricao: "Crocante por fora, macia por dentro. Serve 2 pessoas.",
      precoCentavos: 1600,
      ilustracao: "porcao",
      secaoId: "porcoes",
    },
    {
      id: "refri-lata",
      nome: "Refrigerante lata 350 ml",
      descricao: "Escolhe o sabor.",
      precoCentavos: 600,
      ilustracao: "bebida",
      secaoId: "bebidas",
      grupos: [saborRefri],
    },
    {
      id: "agua",
      nome: "Água mineral 500 ml",
      descricao: "Sem gás.",
      precoCentavos: 400,
      ilustracao: "garrafa",
      secaoId: "bebidas",
    },
    {
      id: "pudim",
      nome: "Pudim de leite",
      descricao: "Fatia individual.",
      precoCentavos: 800,
      ilustracao: "sobremesa",
      secaoId: "sobremesas",
    },
  ],
};

/* ---------- Mercado de exemplo ---------- */

const horariosMercado: Horarios = [
  dia(["08:00", "12:00"]),
  dia(["08:00", "20:00"]),
  dia(["08:00", "20:00"]),
  dia(["08:00", "20:00"]),
  dia(["08:00", "20:00"]),
  dia(["08:00", "20:00"]),
  dia(["08:00", "20:00"]),
];

const mercado: Loja = {
  id: "mercado-exemplo",
  nome: "Mercado Exemplo",
  sigla: "ME",
  tipo: "Mercado",
  categoria: "mercados",
  cor: "#0F766E",
  tempoMin: 40,
  tempoMax: 50,
  horarios: horariosMercado,
  pagamentos: PAGAMENTOS,
  exemplo: true,
  secoes: [
    { id: "hortifruti", nome: "Hortifrúti" },
    { id: "padaria", nome: "Padaria" },
    { id: "mercearia", nome: "Mercearia" },
    { id: "bebidas", nome: "Bebidas" },
    { id: "limpeza", nome: "Limpeza" },
  ],
  destaques: ["arroz-5kg", "pao-frances", "banana"],
  produtos: [
    {
      id: "banana",
      nome: "Banana prata",
      descricao: "Preço por quilo.",
      precoCentavos: 599,
      ilustracao: "fruta",
      secaoId: "hortifruti",
    },
    {
      id: "tomate",
      nome: "Tomate",
      descricao: "Preço por quilo.",
      precoCentavos: 799,
      ilustracao: "fruta",
      secaoId: "hortifruti",
    },
    {
      id: "alface",
      nome: "Alface crespa",
      descricao: "Unidade.",
      precoCentavos: 350,
      ilustracao: "fruta",
      secaoId: "hortifruti",
    },
    {
      id: "pao-frances",
      nome: "Pão francês",
      descricao: "Pacote com 10 unidades.",
      precoCentavos: 700,
      ilustracao: "pao",
      secaoId: "padaria",
    },
    {
      id: "cuca",
      nome: "Cuca de uva",
      descricao: "Unidade de 500 g.",
      precoCentavos: 1800,
      ilustracao: "pao",
      secaoId: "padaria",
      esgotado: true,
    },
    {
      id: "arroz-5kg",
      nome: "Arroz branco 5 kg",
      descricao: "Tipo 1.",
      precoCentavos: 2790,
      precoAnteriorCentavos: 3190,
      ilustracao: "pacote",
      secaoId: "mercearia",
    },
    {
      id: "feijao-1kg",
      nome: "Feijão preto 1 kg",
      descricao: "Tipo 1.",
      precoCentavos: 890,
      ilustracao: "pacote",
      secaoId: "mercearia",
    },
    {
      id: "cafe-500g",
      nome: "Café torrado e moído 500 g",
      descricao: "Tradicional.",
      precoCentavos: 1890,
      ilustracao: "pacote",
      secaoId: "mercearia",
    },
    {
      id: "erva-mate",
      nome: "Erva-mate 1 kg",
      descricao: "Para chimarrão. Escolhe o tipo.",
      precoCentavos: 1690,
      ilustracao: "pacote",
      secaoId: "mercearia",
      grupos: [
        {
          id: "tipo",
          nome: "Tipo",
          min: 1,
          max: 1,
          opcoes: [
            { id: "tradicional", nome: "Tradicional", precoCentavos: 0 },
            { id: "moida-grossa", nome: "Moída grossa", precoCentavos: 0 },
          ],
        },
      ],
    },
    {
      id: "leite-1l",
      nome: "Leite integral 1 L",
      descricao: "Longa vida.",
      precoCentavos: 549,
      ilustracao: "garrafa",
      secaoId: "bebidas",
    },
    {
      id: "agua-5l",
      nome: "Água mineral 5 L",
      descricao: "Sem gás.",
      precoCentavos: 990,
      ilustracao: "garrafa",
      secaoId: "bebidas",
    },
    {
      id: "refri-2l",
      nome: "Refrigerante 2 L",
      descricao: "Sabor guaraná.",
      precoCentavos: 950,
      ilustracao: "bebida",
      secaoId: "bebidas",
    },
    {
      id: "detergente",
      nome: "Detergente líquido 500 ml",
      descricao: "Neutro.",
      precoCentavos: 299,
      ilustracao: "limpeza",
      secaoId: "limpeza",
    },
    {
      id: "sabao-po",
      nome: "Sabão em pó 1 kg",
      descricao: "Para roupas brancas e coloridas.",
      precoCentavos: 1490,
      ilustracao: "limpeza",
      secaoId: "limpeza",
    },
  ],
};

/* ---------- Farmácia de exemplo (só higiene e beleza, sem medicamentos) ---------- */

const horariosFarmacia: Horarios = [
  [],
  dia(["08:00", "19:00"]),
  dia(["08:00", "19:00"]),
  dia(["08:00", "19:00"]),
  dia(["08:00", "19:00"]),
  dia(["08:00", "19:00"]),
  dia(["08:00", "12:00"]),
];

const farmacia: Loja = {
  id: "farmacia-exemplo",
  nome: "Farmácia Exemplo",
  sigla: "FE",
  tipo: "Farmácia · higiene e beleza",
  categoria: "farmacias",
  cor: "#CDE7DB",
  tempoMin: 20,
  tempoMax: 30,
  horarios: horariosFarmacia,
  pagamentos: PAGAMENTOS,
  exemplo: true,
  secoes: [
    { id: "bucal", nome: "Higiene bucal" },
    { id: "banho", nome: "Banho" },
    { id: "cabelos", nome: "Cabelos" },
    { id: "pele", nome: "Cuidados com a pele" },
  ],
  destaques: ["hidratante", "creme-dental", "shampoo"],
  produtos: [
    {
      id: "creme-dental",
      nome: "Creme dental 90 g",
      descricao: "Com flúor.",
      precoCentavos: 690,
      ilustracao: "tubo",
      secaoId: "bucal",
    },
    {
      id: "escova-dental",
      nome: "Escova dental macia",
      descricao: "Unidade.",
      precoCentavos: 990,
      ilustracao: "escova",
      secaoId: "bucal",
    },
    {
      id: "fio-dental",
      nome: "Fio dental 50 m",
      descricao: "Encerado.",
      precoCentavos: 890,
      ilustracao: "tubo",
      secaoId: "bucal",
    },
    {
      id: "sabonete",
      nome: "Sabonete em barra 90 g",
      descricao: "Hidratante.",
      precoCentavos: 349,
      ilustracao: "sabonete",
      secaoId: "banho",
    },
    {
      id: "desodorante",
      nome: "Desodorante aerossol 150 ml",
      descricao: "Escolhe a fragrância.",
      precoCentavos: 1490,
      ilustracao: "frasco",
      secaoId: "banho",
      grupos: [
        {
          id: "fragrancia",
          nome: "Fragrância",
          min: 1,
          max: 1,
          opcoes: [
            { id: "suave", nome: "Suave", precoCentavos: 0 },
            { id: "fresca", nome: "Fresca", precoCentavos: 0 },
            { id: "sem-perfume", nome: "Sem perfume", precoCentavos: 0 },
          ],
        },
      ],
    },
    {
      id: "shampoo",
      nome: "Shampoo 350 ml",
      descricao: "Uso diário.",
      precoCentavos: 1990,
      ilustracao: "frasco",
      secaoId: "cabelos",
    },
    {
      id: "condicionador",
      nome: "Condicionador 350 ml",
      descricao: "Uso diário.",
      precoCentavos: 2190,
      ilustracao: "frasco",
      secaoId: "cabelos",
      esgotado: true,
    },
    {
      id: "hidratante",
      nome: "Hidratante corporal 200 ml",
      descricao: "Para pele seca.",
      precoCentavos: 2490,
      precoAnteriorCentavos: 2990,
      ilustracao: "frasco",
      secaoId: "pele",
    },
    {
      id: "protetor-labial",
      nome: "Protetor labial",
      descricao: "Unidade.",
      precoCentavos: 1290,
      ilustracao: "tubo",
      secaoId: "pele",
    },
  ],
};

/** A ordem daqui é a ordem em que as lojas aparecem no app. */
export const LOJAS: Loja[] = [leo, mercado, farmacia];

export function buscarLoja(id: string): Loja | undefined {
  return LOJAS.find((l) => l.id === id);
}
