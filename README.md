# Mahalo Açaí Bowls — proposta de site v2

**Estudo visual não oficial — JN Santos Web Studio.**

Este repositório contém um **site estático responsivo real e interativo**, pronto para hospedar no GitHub Pages. É um protótipo para apresentação, ainda **não aprovado pela Mahalo Açaí Bowls**.

> O cardápio oficial da Anota AI exige JavaScript e não foi possível conferir seus produtos/imagens de forma confiável nesta execução. O Instagram oficial também não liberou o acesso às fotografias por automação. Por isso, esta versão utiliza a **logo verdadeira enviada para o projeto**, ilustrações conceituais identificadas como tal e **opções de montagem apenas demonstrativas**. Não estão incluídos fotos oficiais, tamanhos, preços nem adicionais confirmados.

## O que foi melhorado

- Primeira tela com **copo animado** em vez de tigela. O copo é uma ilustração de produto, a ser substituída por **foto real autorizada**, quando recebida.
- Cardápio redesenhado com **três abas funcionais**: montar, copos prontos e compra oficial.
- Chamadas para o **cardápio Anota AI** em destaque em toda a jornada.
- “Nossa essência” com **logo real da Mahalo** em uma composição mais marcante.
- “Universo Mahalo” com **galeria ampliável (lightbox)**, além de acesso direto às fotos reais no Instagram e ao WhatsApp.
- **Montador animado**: cada ingrediente ilustrativo clicado cai visualmente no copo e permanece na composição.
- Alternância entre montar um copo e consultar os **copos prontos no cardápio oficial**.
- Carrinho local demonstrativo, seleção de tamanho, quantidade, inclusão/remoção de adicionais e envio de **consulta** ao WhatsApp.
- Formulário demonstrativo, mapa, navegação para celular e acessibilidade básica.

**Importante:** nenhum pedido é confirmado ou cobrado no protótipo. A Anota AI não recebe os itens do carrinho do site: a compra oficial é feita diretamente na plataforma da empresa. Os itens do carrinho experimental podem gerar apenas uma mensagem de **consulta** por WhatsApp com ressalva explícita de que são exemplos.

## Estrutura

```
MAHALO_GITHUB_V2/
├── index.html
├── styles.css
├── app.js
├── assets/
│   ├── mahalo-logo.png           # Logo original enviada pelo usuário, recortada em círculo
│   └── copo-conceitual.svg       # Arte ilustrativa editável, não fotografia
├── preview/                     # Capturas verdadeiras no Chromium
├── .github/workflows/
│   └── deploy-pages.yml          # Deploy automático no GitHub Pages
├── .nojekyll
├── .gitignore
└── README.md
```

## Como publicar no GitHub

1. Crie um repositório no GitHub chamado, por exemplo, **`mahalo-acai-bowls`**.
2. Extraia o arquivo ZIP e **envie o conteúdo da pasta extraída para a raiz do repositório** — não somente o ZIP e não dentro de uma subpasta extra.
3. Confirme que na raiz estão `index.html`, `styles.css`, `app.js`, `assets/` e `.github/`.
4. Abra **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Faça um commit na branch `main` ou vá em **Actions → Publicar demonstração no GitHub Pages → Run workflow**.
6. O endereço normalmente terá o formato `https://SEU-USUARIO.github.io/mahalo-acai-bowls/`.

O endereço acima é apenas um **formato ilustrativo**, não uma publicação efetuada por este pacote. O deploy não será feito sem acesso/autorização ao seu GitHub.

> GitHub Pages pode tornar uma demonstração publicamente acessível; repositório privado e `noindex` **não substituem controle de acesso**. Recomenda-se aprovação da Mahalo para divulgação pública. Enquanto isso, use o ZIP ou rode localmente.

## Visualizar localmente

Abra `index.html` num navegador moderno. Alternativamente, dentro da pasta, use:

```bash
python -m http.server 8000
```

E visite `http://localhost:8000`.

## Para colocar as fotos oficiais

Solicite à equipe Mahalo autorização e os arquivos originais (JPG/WebP). Depois de inserir as imagens em `assets/`:

- **Copo do topo:** em `index.html`, encontre a classe `hero-cup` e substitua o caminho `assets/copo-conceitual.svg` por uma fotografia recortada com fundo transparente, mantendo `alt` apropriado.
- **Copo do montador:** em `index.html`, encontre `id="builderCup"` e atualize a imagem. Uma fotografia com perspectiva frontal e espaço para os elementos sobrepostos funciona melhor.
- **Produtos:** substitua os componentes gráficos de `catalog-grid` pelas fotos e nomes autorizados do cardápio.
- **Galeria:** substitua os arquivos dos botões `data-gallery="logo"` e `data-gallery="cup"` pelo conteúdo licenciado. Atualize também o objeto `galleries` em `app.js` para a função ampliar abrir a mesma foto.
- **Nossa essência:** a versão atual já privilegia a logo real; se for usar uma foto da loja, peça aprovação e adapte a composição para não simular embalagem/produto diferente do real.

## Para atualizar os adicionais reais

Em `app.js`, encontre a lista `EXAMPLE_INGREDIENTS`. Somente quando receber o cardápio oficial, substitua-a pelos nomes autorizados e ajuste textos em `index.html` que dizem **exemplo/ilustrativo**. Para alterar tamanhos, atualize os botões `data-size` e a seleção padrão `selectedSize` do JavaScript. Depois, revise as mensagens de WhatsApp, preços e a disponibilidade com o cliente.

**Não declare integração automática Anota AI sem autenticação/API e autorização do estabelecimento.** A documentação pública de integração da Anota AI menciona autenticação Bearer e identificador de página para operações de cardápio.

## Verificação realizada

- Abertura e renderização nos tamanhos **1440 × 900** e **390 × 844**;
- Sem overflow horizontal nos dois tamanhos;
- Abas do cardápio e alternância dos modos de montagem;
- Seleção de ingredientes com renderização no copo;
- Seleção de tamanho, quantidade, carrinho, remoção e fechamento;
- Galeria com abertura e fechamento;
- Menu mobile, links relativos e JavaScript sem erros de execução durante os testes.

Os testes foram executados carregando o HTML/CSS/JS e as imagens no navegador Chromium. Os serviços externos (Instagram, Anota AI, Maps, WhatsApp) requerem conexão à internet para carregar na versão publicada.

## Antes de virar site oficial

- [ ] Autorização formal para publicar a marca e as fotos;
- [ ] Fotografias reais da loja, do açaí e dos copos prontos;
- [ ] Tamanhos, complementos, sabores e preços conferidos na Anota AI;
- [ ] Endereço, horários, entrega/retirada, política comercial;
- [ ] Confirmação de WhatsApp, domínio e permissões de integração;
- [ ] Remover a tag `noindex` apenas após aprovação e revisão final;
- [ ] Políticas de privacidade, acessibilidade e desempenho em produção.

**Conceito visual não oficial — JN Santos Web Studio.**
