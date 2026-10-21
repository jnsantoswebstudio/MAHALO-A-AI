# Mahalo Açaí Bowls — site + editor de conteúdo

Projeto da JN Santos Web Studio, atualizado com as informações de cardápio fornecidas em 21/10/2026.

## O que está pronto

- Site responsivo em HTML, CSS e JavaScript, sem framework ou build obrigatório.
- Home com animação do copo de açaí, identidade Mahalo e CTA para o Anota AI.
- Catálogo com **9 itens**: 6 tigelas/açaís, 2 sucos e 1 melado, com preços recebidos.
- **6 complementos**, com limites configuráveis e até **2 acompanhamentos gratuitos**, conforme texto recebido.
- Formulário de personalização por produto, observações, quantidade, carrinho e mensagem pronta no WhatsApp (não há pagamento na página).
- Montador animado com os **ícones visuais clássicos da V2** para os ingredientes, novamente contidos dentro do copo (sem os chips circulares de fotos da V3).
- Galeria, logo, essência, Instagram, WhatsApp, mapa e formulário de contato.
- Área `admin.html` para editar produtos, complementos, textos, links, imagens, galeria, preços, visibilidade, cores e regras.
- Arquivo de conteúdo `site-data.js`, separando dados comerciais do código. Publicação automática via GitHub Actions/Pages.

## Arquivos

- `index.html`: site público.
- `styles.css` e `modern.css`: estilos do site.
- `app.js`: catálogo, montador, carrinho, contato e interações.
- `site-data.js`: **arquivo publicado com todo o conteúdo editável**.
- `site-data.json`: cópia inicial de referência (não é lida pelo site; não sincroniza automaticamente com o JS).
- `admin.html`, `admin.css`, `admin.js`: editor visual local.
- `assets/`: logo e copo ilustrado; substitua as artes pelas fotos autorizadas, ou use o editor.
- `.github/workflows/deploy-pages.yml`: GitHub Pages.
- `preview_final/`: imagens reais de teste obtidas em navegador (podem ser removidas do repositório).

## Subir no GitHub Pages

1. Crie um repositório (por exemplo, `mahalo-acai-bowls`).
2. Extraia o ZIP e envie **todo o conteúdo da pasta extraída para a raiz** do repositório, incluindo `.github/` e `site-data.js`.
3. Em **Settings → Pages**, altere **Source** para `GitHub Actions`.
4. Faça o commit na branch `main`; o workflow publica os arquivos estáticos.
5. Visite `https://SEU-USUARIO.github.io/mahalo-acai-bowls/` depois da publicação. O link é ilustrativo; ainda não foi publicado por esta entrega.

**Autorização:** obtenha aprovação da empresa para exibir o site publicamente. O projeto mantém `noindex` enquanto isso não ocorrer.

## Como usar o administrador

1. Abra `admin.html` pelo navegador (na mesma pasta do site).
2. Use as abas para modificar marca, textos, links, cores, catálogo, fotos e regras.
3. Clique em **Salvar prévia**; ao abrir `index.html` **no mesmo navegador** verá os novos dados por meio do armazenamento local (quando permitido).
4. Para **publicar para todo mundo**, clique em **Exportar e publicar → Baixar site-data.js**.
5. Substitua `site-data.js` no repositório GitHub e confirme o commit; o workflow atualiza o site online.
6. Faça também um backup pelo botão **Backup JSON**.

O painel **NÃO É um CMS remoto autenticado**. O GitHub Pages é hospedagem estática: alterações feitas no navegador não ficam disponíveis para outros visitantes até o arquivo ser publicado no repositório. O painel não armazena senhas nem tokens. Para oferecer login seguro e gravação/publicação automática pela internet, é necessário instalar um backend/CMS com autenticação e provedor de hospedagem compatível. Não coloque senha do admin ou token do GitHub em JavaScript público.

## Imagens e dados pendentes

- **Fotos oficiais** das 6 tigelas de açaí, da loja e da galeria do Universo Mahalo. No lugar são mostrados espaços estilizados. O copo animado é uma ilustração, não uma foto real.
- Os 6 links dos complementos e 2 links dos sucos são os que foram enviados pelo solicitante, hospedados em `client-assets.anota.ai`. A disponibilidade futura desses links depende do provedor. Para evitar perder as fotos, peça autorização e salve imagens otimizadas em `assets/` na versão definitiva.
- **Conferir** a composição do açaí 500ml *batido com tâmara*: nome contém tâmara, mas descrição recebida cita guaraná. O site identifica a divergência.
- **Preço extra a confirmar** de banana, morango e granola quando excederem os 2 acompanhamentos gratuitos: não foram fornecidos. No site, o subtotal é considerado mínimo se houver esses extras.
- **Validar regra comercial dos 2 acompanhamentos gratuitos** versus preços adicionais informados: a implementação conta os primeiros dois como gratuitos e aplica os preços extra divulgados às unidades além disso. Essa interpretação deve ser aprovada antes da venda real.
- Confirmar endereço completo, horários e regras de entrega/retirada. O link de mapa usa coordenadas fornecidas.

## Compra e privacidade

O carrinho é armazenado apenas no navegador do cliente (`localStorage`). A finalização **abre uma mensagem para o WhatsApp**, onde a equipe confirma disponibilidade, preço final e condições de atendimento. O botão Anota AI abre o catálogo oficial. Não há integração de API de catálogo, estoque ou pagamentos com Anota AI, nem backend de pedidos.

## Testes

Sintaxe JavaScript validada com Node.js. Testes interativos realizados em Chromium com conteúdo local inline para conferir produtos, modal, carrinho, montador e dashboard, além de verificação de largura mobile. Fotografias externas podem não aparecer no ambiente de teste por bloqueios de rede; os links fornecidos são mantidos no site.

## Alteração pontual — retorno do montador clássico

A apresentação dos ingredientes **na seção Monte seu pedido** voltou ao estilo visual da V2 (ícones coloridos, sem fichas redondas). As fotos dos complementos continuam disponíveis no catálogo/modal e no painel; as regras de preços, produtos e carrinho não foram alteradas.

## Acesso rápido — onde fica o administrador?

**Abra `INICIAR_AQUI.html`**, e escolha **Abrir administrador** (que leva a `admin.html`).
Esse arquivo é um menu de uso da JN Santos, não é enviado ao GitHub Pages pelo workflow.
Em um repositório Pages publicado, `admin.html` também existe no mesmo caminho do site, mas **não tem login**: é um editor de conteúdo e exporta os dados para atualização via commit no GitHub. Não confunda com um CMS autenticado. Não compartilhe esse endereço como interface segura.

O painel só visualiza alterações no site quando ambos são abertos na mesma origem do navegador (por exemplo, site e admin na mesma hospedagem/servidor). Abrir cada HTML isolado em visualizadores diferentes pode impedir o compartilhamento da prévia. O backup JSON e o arquivo `site-data.js` exportado funcionam sem essa dependência.

**Aprimoramento desta revisão:** a imagem principal do copo e o logotipo editados no painel agora também são aplicados na galeria e no montador; a incorporação do mapa tem campo próprio.
