# MAHALO AÇAÍ BOWLS — conceito visual não oficial

**Protótipo de site responsivo desenvolvido para apresentação pela JN Santos Web Studio.**

> **IMPORTANTE:** Este é um estudo visual **não aprovado pela Mahalo Açaí Bowls**. Não se apresenta como site oficial, não realiza pagamentos e não reproduz um cardápio validado. Publicar somente como prévia identificada; obtenha autorização antes de transformar em site oficial.

![Tela inicial do conceito](preview/01_home_desktop.png)

## O que funciona

- Menu responsivo e navegação por seções;
- Catálogo de apresentação com acesso ao **cardápio oficial da Anota AI**;
- Montador ilustrativo de pedido (tamanhos/adicionais são exemplos **a confirmar**);
- Carrinho local com quantidades, exclusão de itens e mensagem preparada para o WhatsApp;
- Formulário que prepara contato no WhatsApp, sem coletar dados em servidor;
- Links para Instagram e rota no Google Maps;
- Layout para desktop e celular, sem necessidade de React, Node ou banco de dados.

**O carrinho não cobra e não confirma compras.** O pedido no WhatsApp informa que as escolhas são ilustrativas e pede confirmação de valores/disponibilidade. As fotografias reais, produtos, preços, opções de adicionais, endereço detalhado e horários precisam ser confirmados pela empresa.

## Estrutura do repositório

```text
mahalo-acai-bowls/
├── index.html                 # Página completa, CSS e JavaScript
├── assets/
│   ├── mahalo-logo.png       # Logo fornecido para a apresentação
│   ├── bowl-conceitual.svg   # Ilustração conceitual, não foto real
│   └── onda-mahalo.svg       # Elemento gráfico
├── preview/                  # Capturas reais do protótipo
├── .github/workflows/
│   └── deploy-pages.yml      # Publicação automática no GitHub Pages
├── .gitignore
├── .nojekyll
└── README.md
```

## Como colocar no GitHub (sem terminal)

1. No GitHub, crie um repositório, por exemplo **`mahalo-acai-bowls`**. Recomendo mantê-lo **privado** enquanto você obtém autorização para uma prévia pública.
2. Descompacte o arquivo `MAHALO_GITHUB_PRONTO.zip` no computador.
3. Dentro do novo repositório, escolha **Add file → Upload files**. Arraste **todo o conteúdo de dentro da pasta `MAHALO_GITHUB`**, incluindo `index.html`, `assets`, `preview` e `.github`. Não envie somente o HTML nem deixe todos os arquivos dentro de uma pasta adicional.
4. Salve com **Commit changes** na branch `main`.
5. Vá em **Settings → Pages → Build and deployment → Source** e escolha **GitHub Actions**.
6. Em **Actions**, abra o fluxo **Publicar demonstração no GitHub Pages**. Se necessário, clique em **Run workflow**. Depois do primeiro deploy, as alterações enviadas para `main` serão publicadas automaticamente.
7. A URL terá o formato `https://SEU_USUARIO.github.io/mahalo-acai-bowls/` (exemplo de formato, **não é um link ativo deste projeto**).

> A disponibilidade de GitHub Pages para repositórios privados depende das permissões/plano do GitHub. Em muitos casos, uma demonstração GitHub Pages será **publicamente acessível**. O marcador `noindex` ajuda a não aparecer em mecanismos de busca, mas **não protege o acesso**. Não publique a prévia sem avaliar isso.

### Pelo terminal (alternativa)

Crie primeiro um repositório **vazio** no GitHub, sem README automático, e execute **dentro da pasta extraída**:

```bash
git init
git add .
git commit -m "Adiciona prototipo Mahalo Acai Bowls"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/mahalo-acai-bowls.git
git push -u origin main
```

Depois habilite **Settings → Pages → GitHub Actions**.

## Visualizar antes de publicar

Abra `index.html` com o navegador. Para simular um servidor local:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000/`.

## Pontos a validar com a Mahalo antes da versão final

- [ ] Autorização para uso público da marca e publicação da prévia;
- [ ] Cardápio: produtos, tamanhos, adicionais, preços e disponibilidade;
- [ ] Fotos oficiais dos produtos e do estabelecimento;
- [ ] Localização completa, horário e bairros/condições de entrega;
- [ ] Responsável pelo recebimento das mensagens do WhatsApp;
- [ ] Textos definitivos, informações legais e política de privacidade;
- [ ] Domínio definitivo, hospedagem, configurações de analytics e SEO.

**SEO:** este protótipo contém `<meta name="robots" content="noindex, nofollow, noarchive">`, por ser **não oficial**. Remova essa linha apenas quando o projeto estiver aprovado para publicação definitiva.

## Direitos e responsabilidade

Conceito visual não oficial — JN Santos Web Studio. A marca e identidade Mahalo são de seus respectivos titulares. O material é destinado à negociação e demonstração, não à representação como canal oficial de vendas.
