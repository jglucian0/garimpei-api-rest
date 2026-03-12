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

<h2 id="started">🚀 Getting started</h2>

This project uses Puppeteer in Singleton mode to manage Chromium instances and ensure data extraction performance, since Mercado Livre restricts access to public data and does not provide an API for such functions.

<h3>Prerequisites</h3>

NodeJS (v18 or higher recommended)

Git

PostgreSQL Instance (Neon DB account recommended)

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
```

<h3>Starting</h3>

```bash
cd garimpei-api
npm install   # To run in development
npm run dev   # To run tests
npm test
```

<h2 id="routes">📍 API Endpoints</h2>
​
| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>POST /api/v1/config/cookies</kbd>     | validates and saves Mercado Livre cookies in the database. [response details](#post-cookies-detail)
| <kbd>POST /api/v1/extract</kbd>     | Performs data extraction from a product using isolated context [request details](#post-extract-detail)

<h3 id="post-cookies-detail">POST /api/v1/config/cookies</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "cookie": "# Netscape HTTP Cookie File\n.mercadolivre.com.br\tTRUE\t/\tTRUE\t..."
}
```

**_RESPONSE_**

```json
{
  "message": "Cookies validated and saved successfully in the database!",
  "active": true
}
```

<h3 id="post-extract-detail">POST /api/v1/extract</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "url": "https://www.mercadolivre.com.br/apple-macbook-pro-pro-m4-mw2u..."
}
```

**_RESPONSE_**

```json
{
  "imagePath": "imagemParaEnviar",
  "product": "Macbook Pro 14 Apple M4 SSD de 16 GB, 512 GB de espaço",
  "color": "Preto-espacial, prateado",
  "link": "https://meli.la/213wWUb",
  "linkOriginal": "https://www.mercadolivre.com.br/apple-macbook-pro-pro-m4-mw2u...",
  "original_price": 14972,
  "current_price": 11972,
  "discount": "20% OFF",
  "free_shipping": true,
  "seller": "Loja Oficial Apple"
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

<h2 id="tech">💻 Technologies</h2>

Node.js (Runtime principal)

Express (Framework web)

Puppeteer (WebScraping para Mercado Livre apenas)

PostgreSQL / Neon DB (Banco de dados para armazenamento de cookies JSONB)

Jest (Testes unitários e de integração)

Docker (Containerização para deploy escalável)

<h2 id="started">🚀 Getting started</h2>

Este projeto utiliza o Puppeteer em modo Singleton para gerenciar instâncias do Chromium e garantir performance na extração de dados, uma vez que o Mercado Livre dificulta o acesso a dados públicos e não disponibiliza API para tal função.

<h3>Prerequisites</h3>

NodeJS (v18 ou superior recomendado)

Git

PostgreSQL Instance (Conta no Neon DB recomendada)

<h3>Cloning</h3>

```bash
git clone https://github.com/jglucian0/garimpei-api-rest
```

<h3>Config .env variables</h3>

Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

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

<h2 id="routes">📍 API Endpoints</h2>

Here you can list the main routes of your API, and what are their expected request bodies.
​
| route | description  
|----------------------|-----------------------------------------------------
| <kbd>POST /api/v1/config/cookies</kbd> | validates and saves Mercado Livre cookies in the database. [response details](#post-cookies-detail)
| <kbd>POST /api/v1/extract</kbd> | Performs data extraction from a product using isolated context [request details](#post-extract-detail)

<h3 id="post-cookies-detail">POST /api/v1/config/cookies</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "cookie": "# Netscape HTTP Cookie File\n.mercadolivre.com.br\tTRUE\t/\tTRUE\t..."
}
```

**_RESPONSE_**

```json
{
  "message": "Cookies validados e salvos com sucesso no banco de dados!",
  "active": true
}
```

<h3 id="post-extract-detail">POST /api/v1/extract</h3>

**_REQUEST BODY_**

```json
{
  "userId": "garimpei_user_01",
  "url": "https://www.mercadolivre.com.br/apple-macbook-pro-pro-m4-mw2u..."
}
```

**_RESPONSE_**

```json
{
  "imagePath": "imagemParaEnviar",
  "product": "Macbook Pro 14 Apple M4 SSD de 16 GB, 512 GB de espaço",
  "color": "Preto-espacial, prateado",
  "link": "https://meli.la/213wWUb",
  "linkOriginal": "https://www.mercadolivre.com.br/apple-macbook-pro-pro-m4-mw2u...",
  "original_price": 14972,
  "current_price": 11972,
  "discount": "20% OFF",
  "free_shipping": true,
  "seller": "Loja Oficial Apple"
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

git checkout -b feature/sua-feature

Siga os padrões de commit (Conventional Commits).

Certifique-se de que os testes estão passando: npm test.

Abra um Pull Request detalhando as alterações.
