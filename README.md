<h1 align="center" style="font-weight: bold;">Garimpei API RESTful ☕</h1>

<p align="center">
  <a href="#-english">English</a> • 
  <a href="#-português">Português</a>
</p>

<p align="center">
<a href="#tech">Technologies</a> •
<a href="#started">Getting Started</a> •
<a href="#routes">API Endpoints</a> •
<a href="#colab">Collaborators</a> •
<a href="#contribute">Contribute</a>
</p>

<h5 id="-english">🇺🇸 English</h5>

<p align="center">
<b>RESTful API for intelligent Marketplace data extraction ("garimpar") with multi-session support and context isolation.</b>
</p>

<p align="center">
<i>This project was conceived to solve a real pain point: the slowness of the product curation process for affiliates across multiple marketplaces. Unlike general-purpose scrapers, Garimpei focuses on "the essentials done right," delivering only the critical data required for conversion (Prices, Title, Image (with markdown), and Affiliate Link) quickly and securely, eliminating exhaustive manual work for affiliates.</i>
</p>

<h2 id="tech">💻 Technologies</h2>

Node.js (Main Runtime)

Express (Framework web)

Puppeteer (WebScraping for Mercado Livre only)

PostgreSQL / Neon DB (Database for JSONB cookie storage)

Jest (Unit and integration testing)

Docker (Containerization for scalable deployment)

<h2 id="features">🧾 Key Features & Architecture</h2>

To ensure speed and resilience, the API implements several architectural patterns:

- **Isolated Contexts:** Each extraction runs in a secure, anonymous browser context `createBrowserContext()`, preventing session leaking between users and ensuring accurate affiliate metrics.
- **URL Resolution Service (Unshorter):** A lightweight Axios-based service that automatically resolves shortened links (like `meli.la` or `/sec/`) and extracts the final product URL from social profile pages via Regex, saving Chromium resources.
- **Separation of Concerns (SoC):** DOM extraction logic is completely decoupled from the Puppeteer engine, making maintenance and CSS selector updates much easier.
- **Dynamic Affiliate Tags:** The affiliate generation service supports dynamic tags per request, allowing users to track different campaigns in real-time.
- **Stable Unit Testing:** Comprehensive Jest test suite using Puppeteer Mocks to ensure the logic runs smoothly without hitting real servers.

<h2 id="started">🚀 Getting started</h2>

This project uses Puppeteer in Singleton mode to manage Chromium instances and ensure data extraction performance, since Mercado Livre restricts access to public data and does not provide an API for such functions.

<h3>Prerequisites</h3>

NodeJS (v18 or higher recommended)

Git

PostgreSQL Instance (Neon DB account recommended)

<h3>Cloning</h3>

```bash
git clone [https://github.com/jglucian0/garimpei-api-rest](https://github.com/jglucian0/garimpei-api-rest)
```

<h3>Config .env variables</h3>

Create a .env file in the root of the project with the following variables:

```yaml
PORT=3001
DATABASE_URL=postgres://user:password@neon-db-url/dbname
NODE_ENV=development
```

<h3>Starting</h3>

```bash
cd garimpei-api
npm install   # To run in development
npm run dev   # To run tests
npm test
```

<h2 id="extension">🧩 Chrome Extension (Cookie Collector)</h2>

To make cookie collection easier and cleaner for the user, we implemented a custom Chrome Extension. It automatically extracts the required session tokens (like `ssid`) from Mercado Livre without manual inspection.

**How to use:**

1. **Install:** Add the extension to your Chrome browser [Clicking Here](#) (i didn't upload the extension to Google. But it's located in the project's root directory; you just need to import it into your browser.).
2. **Log in:** Access your Mercado Livre Affiliates account (we recommend using a _Collaborator_ account for security).
3. **Copy:** Click the extension icon in your browser's top right corner and click **"Copy Token"**.
4. **Configure:** Send the copied data along with your affiliate tag to our `/api/v1/config/cookies` endpoint.

<p align="center">
  <img src="https://github.com/user-attachments/assets/c2ccc70b-ee70-446e-be43-bb11a6846ec8" alt="Chrome Extension">
  <br>
  <i>(Replace this placeholder with the actual extension screenshot)</i>
</p>

<h2 id="routes">📍 API Endpoints</h2>

| route                                  | description                                                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| <kbd>POST /api/v1/config/cookies</kbd> | validates and saves Mercado Livre cookies and tag in the database. [response details](#post-cookies-detail) |
| <kbd>POST /api/v1/extract</kbd>        | Performs data extraction from a product using isolated context [request details](#post-extract-detail)      |

<h3 id="post-cookies-detail">POST /api/v1/config/cookies</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "cookies": "ssid=ghy-031018...; _d2id=8b86...; _csrf=eGDB...",
  "tag": "minha_campanha_insta"
}
```

**_RESPONSE_**

```json
{
  "message": "Cookies and Tag successfully validated and saved in the database!",
  "active": true
}
```

<h3 id="post-extract-detail">POST /api/v1/extract</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "url": "[https://meli.la/2NtGUez](https://meli.la/2NtGUez)"
}
```

**_RESPONSE_**

```json
{
  "imagePath": "![product_image](https://http2.mlstatic.com/D_NQ_NP_2X_608153-MLB97012029091_112025-F-relogio-masculino-de-pulso-social-classico-casual-original.webp)",
  "product": "Relógio Masculino De Pulso Social Clássico Casual Original",
  "link": "[https://meli.la/2NtGUez](https://meli.la/2NtGUez)",
  "linkOriginal": "[https://produto.mercadolivre.com.br/MLB-4210056475-relogio-masculino-de-pulso-social-classico-casual-original-_JM](https://produto.mercadolivre.com.br/MLB-4210056475-relogio-masculino-de-pulso-social-classico-casual-original-_JM)",
  "original_price": 99,
  "current_price": 63.36,
  "discount": "36% OFF",
  "free_shipping": true,
  "soldQuantity": "+1000 vendidos",
  "coupon_applied": false
}
```

<h2 id="colab">🤝 Collaborators</h2>

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/169113323?v=4" width="100px;" alt="João Gabriel Profile Picture"/><br>
        <sub>
          <b>João Gabriel Luciano</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://t.ctcdn.com.br/n7eZ74KAcU3iYwnQ89-ul9txVxc=/400x400/smart/filters:format(webp)/i490769.jpeg" width="100px;" alt="Elon Musk Picture"/><br>
        <sub>
          <b>Elon Musk</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://miro.medium.com/max/360/0*1SkS3mSorArvY9kS.jpg" width="100px;" alt="Foto do Steve Jobs"/><br>
        <sub>
          <b>Steve Jobs</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

<h2 id="contribute">📫 Contribute</h2>

git checkout -b feature/yout-feature

Follow commit patterns (Conventional Commits).

Ensure tests are passing

Open a Pull Request detailing the changes.

---

<h5 id="-português">🇧🇷 Português</h5>

<p align="center">
<b>API RESTful para extração ("garimpar") inteligente de dados de Marktplaces com suporte a multi-sessão e isolamento de contextos.</b>
</p>

<p align="center">
<i>Este projeto foi concebido para resolver uma dor real: a morosidade no processo de curadoria de produtos para afiliados de múltiplos marketplaces. Diferente de scrapers generalistas, o Garimpei foca no "essencial bem feito", entregando apenas os dados críticos necessários para conversão (Preços, Título, Imagem (com markdown) e Link de affiliado) de forma rápida e segura, eliminando o trabalho manual exaustivo dos afiliados.</i>
</p>

<h2 id="tech">💻 Tecnologias</h2>

Node.js (Runtime principal)

Express (Framework web)

Puppeteer (WebScraping para Mercado Livre apenas)

PostgreSQL / Neon DB (Banco de dados para armazenamento de cookies JSONB)

Jest (Testes unitários e de integração)

Docker (Containerização para deploy escalável)

<h2 id="features-pt">🧾 Principais Funcionalidades e Arquitetura</h2>

Para garantir velocidade e resiliência, a API implementa os seguintes padrões arquiteturais:

- **Contextos Isolados:** Cada extração ocorre num contexto anónimo do navegador `createBrowserContext()`, evitando o vazamento de sessão entre os clientes do SaaS e protegendo métricas de afiliados.
- **Serviço de Resolução de URL (Unshorter):** Uma camada ultra leve via Axios que processa links encurtados (`meli.la`, etc.) e extrai o link real do produto de páginas sociais via Regex antes de abrir o Chromium.
- **Separação de Responsabilidades:** A lógica de extração do DOM (`mercadoLivreExtractor.js`) é totalmente isolada do motor do Puppeteer, facilitando manutenções futuras em seletores CSS.
- **Tags Dinâmicas de Afiliado:** O serviço de requisição de links suporta injeção de tags em tempo real, flexibilizando as campanhas dos utilizadores.
- **Testes Unitários Estáveis:** Cobertura de testes com Jest utilizando "Mocks" do Puppeteer, permitindo testar a lógica complexa de negócios sem risco de timeout ou bloqueios de CAPTCHA do Mercado Livre.
- **Coleta Fácil de Cookies:** Utilizamos uma extensão personalizada do Chrome para coletar os cookies de sessão do Mercado Livre de forma simples e limpa, melhorando a experiência do utilizador e a funcionalidade do sistema.

<h2 id="started">🚀 Primeiros Passos</h2>

Este projeto utiliza o Puppeteer em modo Singleton para gerir instâncias do Chromium e garantir performance na extração de dados, uma vez que o Mercado Livre dificulta o acesso a dados públicos e não disponibiliza API para tal função.

<h3>Prerequisites</h3>

NodeJS (v18 ou superior recomendado)

Git

PostgreSQL Instance (Conta no Neon DB recomendada)

<h3>Cloning</h3>

```bash
git clone [https://github.com/jglucian0/garimpei-api-rest](https://github.com/jglucian0/garimpei-api-rest)
```

<h3>Config .env variables</h3>

Crie um ficheiro .env na raiz do projeto com as seguintes variáveis:

```yaml
PORT=3001
DATABASE_URL=postgres://user:password@neon-db-url/dbname
NODE_ENV=development
```

<h3>Starting</h3>

```bash
cd garimpei-api
npm install   # Para rodar em desenvolvimento
npm run dev   # Para rodar os testes
npm test
```

<h2 id="extension-pt">🧩 Extensão do Chrome (Coletor de Cookies)</h2>

Para facilitar a coleta de cookies de forma limpa, implementámos uma extensão personalizada do Chrome. Ela extrai automaticamente os tokens de sessão necessários (como `ssid`) do Mercado Livre, dispensando a necessidade de inspeção manual por parte do utilizador.

**Como utilizar:**

1. **Instale:** Adicione a extensão ao seu navegador Chrome [Clicando Aqui](#) (não realizei upload da extenção no google. Mas ela se encontra na raiz do projeto, basta importala em seu navegador).
2. **Faça Login:** Aceda à sua conta de Afiliado no Mercado Livre (recomendamos o uso de uma conta de _Colaborador_ por questões de segurança).
3. **Copie:** Clique no ícone da extensão no canto superior direito do seu navegador e, em seguida, em **"Copiar Token"**.
4. **Configure:** Envie os dados copiados juntamente com a sua tag de afiliado para o nosso endpoint `/api/v1/config/cookies`.

<p align="center">
  <img src="https://github.com/user-attachments/assets/17d48e2a-db40-446b-b80b-3119c6dc03f8" alt="Chrome Extension">
  <br>
  <i>(Substitua este placeholder com o print real da extensão)</i>
</p>

<h2 id="routes">📍 API Endpoints</h2>
​
| route | description  
|----------------------|-----------------------------------------------------
| <kbd>POST /api/v1/config/cookies</kbd> | validates and saves Mercado Livre cookies in the database. [response details](#post-cookies-detail-pt)
| <kbd>POST /api/v1/extract</kbd> | Performs data extraction from a product using isolated context [request details](#post-extract-detail-pt)

<h3 id="post-cookies-detail-pt">POST /api/v1/config/cookies</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "cookies": "ssid=ghy-031018...; _d2id=8b86...; _csrf=eGDB...",
  "tag": "minha_campanha_insta"
}
```

**_RESPONSE_**

```json
{
  "message": "Cookies and Tag successfully validated and saved in the database!",
  "active": true
}
```

<h3 id="post-extract-detail-pt">POST /api/v1/extract</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "url": "[https://meli.la/2NtGUez](https://meli.la/2NtGUez)"
}
```

**_RESPONSE_**

```json
{
  "imagePath": "![product_image](https://http2.mlstatic.com/D_NQ_NP_2X_608153-MLB97012029091_112025-F-relogio-masculino-de-pulso-social-classico-casual-original.webp)",
  "product": "Relógio Masculino De Pulso Social Clássico Casual Original",
  "link": "[https://meli.la/2NtGUez](https://meli.la/2NtGUez)",
  "linkOriginal": "[https://produto.mercadolivre.com.br/MLB-4210056475-relogio-masculino-de-pulso-social-classico-casual-original-_JM](https://produto.mercadolivre.com.br/MLB-4210056475-relogio-masculino-de-pulso-social-classico-casual-original-_JM)",
  "original_price": 99,
  "current_price": 63.36,
  "discount": "36% OFF",
  "free_shipping": true,
  "soldQuantity": "+1000 vendidos",
  "coupon_applied": false
}
```

<h2 id="colab">🤝 Colaboradores</h2>

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/169113323?v=4" width="100px;" alt="João Gabriel Profile Picture"/><br>
        <sub>
          <b>João Gabriel Luciano</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://t.ctcdn.com.br/n7eZ74KAcU3iYwnQ89-ul9txVxc=/400x400/smart/filters:format(webp)/i490769.jpeg" width="100px;" alt="Elon Musk Picture"/><br>
        <sub>
          <b>Elon Musk</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://miro.medium.com/max/360/0*1SkS3mSorArvY9kS.jpg" width="100px;" alt="Foto do Steve Jobs"/><br>
        <sub>
          <b>Steve Jobs</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

<h2 id="contribute">📫 Contribuições</h2>

git checkout -b feature/sua-feature

Siga os padrões de commit (Conventional Commits).

Certifique-se de que os testes estão passando: npm test.

Abra um Pull Request detalhando as alterações.
