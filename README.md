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
<i>This project was conceived to solve a real pain point: the slowness of the product curation process for affiliates across multiple marketplaces (Mercado Livre, Amazon, Nike, and Centauro). Unlike general-purpose scrapers, Garimpei focuses on "the essentials done right," delivering only the critical data required for conversion (Prices, Title, Image (with markdown), and Affiliate Link) quickly and securely, eliminating exhaustive manual work for affiliates.</i>
</p>

<h2 id="tech">💻 Technologies</h2>

Node.js (Main Runtime)

Express (Framework web)

Puppeteer & Puppeteer Extra (WebScraping with Stealth & Evasion capabilities)

PostgreSQL / Neon DB (Database for JSONB cookie storage and Short Links)

Jest (Unit and integration testing)

Docker (Containerization for scalable deployment)

<h2 id="features">🧾 Key Features & Architecture</h2>

To ensure speed and resilience, the API implements several architectural patterns:

- **Advanced Anti-Bot Evasion:** Implements professional bypass techniques for high-security firewalls (Akamai and Cloudflare), ensuring successful extractions even in heavily protected environments like Nike and Centauro.
- **Isolated Contexts:** Each extraction runs in a secure, anonymous browser context `createBrowserContext()`, preventing session leaking between users and ensuring accurate affiliate metrics.
- **Multi-Marketplace Routing (Strategy Pattern):** The extraction controller automatically detects the provided URL (Mercado Livre, Amazon, Nike, or Centauro) and routes it to the specific scraping service.
- **SKU-Aware URL Resolution:** Automatically follows shortened links and cleans tracking parameters while intelligently preserving critical data (e.g., `?cor=`) required by marketplaces to display correct variation prices.
- **Precision Semantic Extraction:** High-accuracy scrapers using `data-testid` and advanced Regex to filter out "trash" data like price-per-liter, installment text, or recommended products.
- **Built-in URL Shortener:** Generates clean, secure, and trackable short links (e.g., `/s/A7x9P`) for Amazon and Awin products to protect affiliate tags via HTTP 301 redirects.
- **Separation of Concerns (SoC):** DOM extraction logic is completely decoupled from the Puppeteer engine, making maintenance and CSS selector updates much easier.
- **API Security & Rate Limiting:** Protected endpoints using strict CORS policies, `x-api-key` header authentication, and IP-based rate limiting to prevent unauthorized access and infrastructure abuse.

<h2 id="started">🚀 Getting started</h2>

This project uses Puppeteer in Singleton mode to manage Chromium instances and ensure data extraction performance across different marketplaces with varying security levels.

<h3>Prerequisites</h3>

NodeJS (v18 or higher recommended)

Git

PostgreSQL Instance (Neon DB account recommended)

Docker and Docker Compose

<h3>Cloning</h3>

```bash
git clone https://github.com/jglucian0/garimpei-api-rest
```

<h3>Config .env variables</h3>

Create a .env file in the root of the project with the following variables:

```yaml
PORT=3001
DATABASE_URL=postgres://user:password@neon-db-url/dbname
NODE_ENV=development
APP_URL=http://localhost:3001
INTERNAL_API_KEY=your_secure_api_key
FRONTEND_URL=http://localhost:3000
```

<h3>Starting</h3>

1. For Local Development (Fast reloading):

```bash
cd garimpei-api
npm install   # To run in development
npm run dev   # To run tests
npm test
```

2. For Production / VPS (Dockerized):
   The Docker setup automatically installs a lightweight Linux environment along with all necessary Chrome/Puppeteer dependencies.

```bash
npm run docker:build  # Builds the image and starts the container
npm run docker:up     # Starts the container in detached mode (background)
npm run docker:logs   # Attach to container logs
npm run docker:down   # Stops and removes the container
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
</p>

<h2 id="routes">📍 API Endpoints</h2>

| route                                  | description                                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| <kbd>POST /api/v1/config/cookies</kbd> | validates and saves Mercado Livre cookies and tag in the database. [response details](#post-cookies-detail)   |
| <kbd>POST /api/v1/config/api</kbd>     | saves ML/Amazon/Awin Affiliate Tag/Cookie/ID in the database. [response details](#post-amazon-api-detail)     |
| <kbd>POST /api/v1/extract</kbd>        | Performs data extraction from a product (ML, Amazon, Nike, Centauro). [request details](#post-extract-detail) |
| <kbd>GET /s/:code</kbd>                | Built-in Short Link Redirector. Performs HTTP 301 redirect to the original Amazon affiliate link.             |

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

<h3 id="post-amazon-api-detail">POST /api/v1/config/api (Amazon)</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "tag": "ogarimpei-20"
}
```

**_RESPONSE_**

```json
{
  "message": "Amazon Tag successfully validated and saved in the database!",
  "active": true
}
```

<h3 id="post-extract-detail">POST /api/v1/extract</h3>

_Note: The API automatically detects the marketplace and applies the specific bypass logic for Nike, Centauro, ML or Amazon._

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "url": "https://meli.la/2NtGUez"
}
```

**_RESPONSE_**

```json
{
  "marketplace": "ML",
  "imagePath": "![product_image](https://http2.mlstatic.com/D_NQ_NP_2X_608153-MLB97012029091_112025-F-relogio-masculino-de-pulso-social-classico-casual-original.webp)",
  "product": "Relógio Masculino De Pulso Social Clássico Casual Original",
  "link": "https://meli.la/2NtGUez",
  "linkOriginal": "https://produto.mercadolivre.com.br/MLB-4210056475-relogio-masculino-de-pulso-social-classico-casual-original-_JM",
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
<i>Este projeto foi concebido para resolver uma dor real: a morosidade no processo de curadoria de produtos para afiliados de múltiplos marketplaces (Mercado Livre, Amazon, Nike e Centauro). Diferente de scrapers generalistas, o Garimpei foca no "essencial bem feito", entregando apenas os dados críticos necessários para conversão (Preços, Título, Imagem (com markdown) e Link de affiliado) de forma rápida e segura.</i>
</p>

<h2 id="tech">💻 Tecnologias</h2>

Node.js (Runtime principal)

Express (Framework web)

Puppeteer & Puppeteer Extra (WebScraping com Stealth e Evasão avançada)

PostgreSQL / Neon DB (Banco de dados para cookies e Links Curtos)

Jest (Testes unitários e de integração)

Docker (Containerização para deploy escalável)

<h2 id="features-pt">🧾 Principais Funcionalidades e Arquitetura</h2>

Para garantir velocidade e resiliência, a API implementa os seguintes padrões arquiteturais:

- **Evasão Avançada Anti-Bot:** Implementa técnicas profissionais de bypass para firewalls de alta segurança (Akamai e Cloudflare), garantindo extrações bem-sucedidas mesmo em ambientes fortemente protegidos como Nike e Centauro.
- **Contextos Isolados:** Cada extração roda em um contexto de navegador seguro e anônimo `createBrowserContext()`, evitando vazamento de sessão entre usuários e garantindo métricas de afiliado precisas.
- **Roteamento Multi-Marketplace (Strategy Pattern):** O controlador de extração detecta automaticamente a URL fornecida (Mercado Livre, Amazon, Nike ou Centauro) e a direciona para o serviço de scraping específico.
- **Resolução de URL com Consciência de SKU:** Segue automaticamente links encurtados e limpa parâmetros de rastreamento, preservando de forma inteligente dados críticos (ex: `?cor=`) necessários para que os marketplaces exibam corretamente as variações de preço.
- **Extração Semântica de Alta Precisão:** Scrapers de alta precisão utilizando `data-testid` e Regex avançado para filtrar dados irrelevantes, como preço por litro, textos de parcelamento ou produtos recomendados.
- **Encurtador de URL Integrado:** Gera links curtos, limpos, seguros e rastreáveis (ex: `/s/A7x9P`) para produtos da Amazon e Awin, protegendo tags de afiliado via redirecionamentos HTTP 301.
- **Separação de Responsabilidades (SoC):** A lógica de extração do DOM é completamente desacoplada do motor Puppeteer, facilitando muito a manutenção e a atualização de seletores CSS.
- **Segurança e Rate Limiting:** Endpoints protegidos utilizando autenticação via header `x-api-key`, CORS restrito ao frontend e limitação de requisições por IP para evitar abusos na infraestrutura.

<h2 id="started">🚀 Primeiros Passos</h2>

Este projeto utiliza o Puppeteer em modo Singleton para gerir instâncias do Chromium e garantir performance na extração de dados, uma vez que o Mercado Livre dificulta o acesso a dados públicos e não disponibiliza API para tal função.

<h3>Prerequisites</h3>

NodeJS (v18 ou superior recomendado)

Git

PostgreSQL Instance (Conta no Neon DB recomendada)

Docker e Docker Compose

<h3>Cloning</h3>

```bash
git clone https://github.com/jglucian0/garimpei-api-rest
```

<h3>Config .env variables</h3>

Crie um ficheiro .env na raiz do projeto com as seguintes variáveis:

```yaml
PORT=3001
DATABASE_URL=postgres://user:password@neon-db-url/dbname
NODE_ENV=development
APP_URL=http://localhost:3001
INTERNAL_API_KEY=sua_chave_de_api
FRONTEND_URL=http://localhost:3000
```

<h3>Starting</h3>

1. Para Desenvolvimento Local (Fast reloading):

```bash
cd garimpei-api
npm install   # Para rodar em desenvolvimento
npm run dev   # Para rodar os testes
npm test
```

2. Para Produção / VPS (Dockerized):
   A configuração do Docker instala automaticamente um ambiente Linux leve contendo todas as dependências necessárias para o Chrome/Puppeteer rodar perfeitamente.

```bash
npm run docker:build  # Constrói a imagem e inicia o container
npm run docker:up     # Inicia o container em segundo plano (background)
npm run docker:logs   # Acompanha os logs do servidor em tempo real
npm run docker:down   # Desliga e remove o container
```

<h2 id="extension-pt">🧩 Extensão do Chrome (Coletor de Cookies)</h2>

Apenas para contexto do Mercado Livre, para facilitar a coleta de cookies de forma limpa, implementámos uma extensão personalizada do Chrome. Ela extrai automaticamente os tokens de sessão necessários (como `ssid`) do Affiliado Mercado Livre, dispensando a necessidade de inspeção manual por parte do utilizador.

**Como utilizar:**

1. **Instale:** Adicione a extensão ao seu navegador Chrome [Clicando Aqui](#) (não realizei upload da extenção no google. Mas ela se encontra na raiz do projeto, basta importala em seu navegador).
2. **Faça Login:** Aceda à sua conta de Afiliado no Mercado Livre (recomendamos o uso de uma conta de _Colaborador_ por questões de segurança).
3. **Copie:** Clique no ícone da extensão no canto superior direito do seu navegador e, em seguida, em **"Copiar Token"**.
4. **Configure:** Envie os dados copiados juntamente com a sua tag de afiliado para o nosso endpoint `/api/v1/config/cookies`.

<p align="center">
  <img src="https://github.com/user-attachments/assets/17d48e2a-db40-446b-b80b-3119c6dc03f8" alt="Chrome Extension">
  <br>
</p>

<h2 id="routes">📍 API Endpoints</h2>
​
| route                                  | description                                                                                                 |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------|
| <kbd>POST /api/v1/config/cookies</kbd> | valida e salva cookies do Mercado Livre e tags no banco de dados. [response details](#post-cookies-detail-pt)      |
| <kbd>POST /api/v1/config/api</kbd>     | salva Tag de Afiliado Amazon/Awin no banco de dados. [response details](#post-amazon-api-detail-pt)                  |
| <kbd>POST /api/v1/extract</kbd>        | realiza a extração (ML, Amazon, Nike, Centauro) usando contexto isolado e técnicas de bypass. [request details](#post-extract-detail-pt)   |
| <kbd>GET /s/:code</kbd>                | redirecionador de Link Curto. Realiza HTTP 301 para o link original de afiliado.           |

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

<h3 id="post-amazon-api-detail-pt">POST /api/v1/config/api (Amazon)</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "tag": "ogarimpei-20"
}
```

**_RESPONSE_**

```json
{
  "message": "Amazon Tag successfully validated and saved in the database!",
  "active": true
}
```

<h3 id="post-extract-detail-pt">POST /api/v1/extract</h3>

_Nota: A API detecta automaticamente se a URL pertence ao Mercado Livre, Amazon ou outro Marktplace e roteia a extração._

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "url": "https://meli.la/2NtGUez"
}
```

**_RESPONSE_**

```json
{
  "marketplace": "ML",
  "imagePath": "![product_image](https://http2.mlstatic.com/D_NQ_NP_2X_608153-MLB97012029091_112025-F-relogio-masculino-de-pulso-social-classico-casual-original.webp)",
  "product": "Relógio Masculino De Pulso Social Clássico Casual Original",
  "link": "https://meli.la/2NtGUez",
  "linkOriginal": "https://produto.mercadolivre.com.br/MLB-4210056475-relogio-masculino-de-pulso-social-classico-casual-original-_JM",
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
