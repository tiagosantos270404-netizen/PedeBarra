# Materiais do Pede Barra

Tudo que foi criado para apresentar o Pede Barra aos comerciantes.

| Pasta | O que é | Como abrir |
| --- | --- | --- |
| `site-parceiros/` | Site de apresentação: benefícios, valores, promoção e WhatsApp | Abra `pede-barra-parceiros.html` no navegador |
| `video/` | Vídeo vertical de 33 segundos, sem som | Abra `pede-barra-apresentacao.mp4` |
| `prototipo/` | Telas do app do cliente, logo, ícones das categorias e painel "Personalizar minha loja" | Arquivos de origem do artefato "Pede Barra – Protótipo" no Claude |
| `slides/` | Apresentação de 8 slides para a visita | Arquivos de origem do artefato "Pede Barra – Apresentação para parceiros" no Claude |

O protótipo e os slides estão no formato que o Claude usa para montar essas páginas. Eles servem como referência de cores, textos e layout, mas não abrem sozinhos no navegador como uma página pronta.

## Vídeo

- `video.html` desenha as cenas e `film.py` filma cada uma e gera os arquivos (precisa de Python com Playwright e do ffmpeg).
- `narracao.md` tem o texto da narração, cena por cena. O áudio ainda não foi gravado.

## Valores usados em todos os materiais

- Mensalidade fixa: R$ 89,90 por mês, sem comissão.
- Ou comissão por venda: 5% para mercados e farmácias; 6% para restaurantes, lancherias e lojas gerais.
- 1 mês grátis para as 5 primeiras lojas.
- Sem taxa de adesão. Montagem da loja a combinar, conforme a quantidade de produtos.

Se algum valor mudar, atualize o site, os slides, o vídeo e o `CLAUDE.md` juntos.
