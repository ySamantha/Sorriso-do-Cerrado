<p align="center">
  <img src="https://i.imgur.com/CGdLk4r.png" width="550" alt="Logo Sorriso do Cerrado">
</p>

<h1 align="center">Sorriso do Cerrado - Marketplace de Artesanato</h1>

<p align="center">
  Plataforma web de marketplace colaborativo desenvolvida por estudantes de Engenharia de Software da Universidade Católica de Brasília (UCB) para conectar artesãos locais a clientes em todo o Brasil.
</p>

---

## Sobre o Projeto

O **Sorriso do Cerrado** nasceu como uma vitrine digital para apoiar o trabalho artesanal local e evoluiu para um **marketplace multi-artesãos completo**, permitindo que cada artesão tenha sua própria loja pública, gerencie catálogo e estoque, converse diretamente com clientes e receba pagamentos com divisão automática via **AbacatePay**.

---

## Principais Funcionalidades

### Para Clientes
- **Vitrine e Busca:** página inicial com banners e produtos em destaque, além de catálogo (`/explorar`) com busca e filtros.
- **Lojas Públicas de Artesãos:** página dedicada para cada artesão (`/loja-artesao/:id`) com apresentação, produtos e acesso direto a partir dos detalhes do produto.
- **Favoritos e Carrinho:** lista de favoritos persistida no banco de dados e carrinho com cálculo dinâmico de totais.
- **Checkout com AbacatePay:** pagamento integrado com validação de estoque e registro de pedidos.
- **Central de Mensagens:** chat direto entre clientes e lojas para tirar dúvidas sobre peças e encomendas.
- **Perfil Unificado:** abas para visão geral, histórico de pedidos, edição de dados e alteração de senha.

### Para Artesãos
- **Cadastro Profissional:** solicitação e ativação do perfil de artesão com criação de subconta na AbacatePay e dados pessoais/financeiros cifrados (AES-256-GCM).
- **Painel do Artesão (`/admin`):**
  - **Resumo:** indicadores de vendas no mês, produtos ativos, mensagens não lidas, saldo AbacatePay e gráfico de faturamento (6 meses / 30 dias).
  - **Catálogo e Pedidos:** CRUD completo de produtos isolados por loja e acompanhamento de vendas e repasses.
  - **Configurações da Loja e Recebimentos:** personalização de nome público, descrição, imagens e dados financeiros.
- **Comunicação:** atendimento a clientes e conversa com outras lojas pela Central de Mensagens.

### Para Administradores
- Gestão de banners promocionais na página inicial.
- **Painel Administrativo (`/painel-administrativo`):** acompanhamento de indicadores, gerenciamento de contas de clientes/artesãos e controle hierárquico (`admin` e `super_admin`) com auditoria e exclusão lógica (*soft delete*).

---

## Tecnologias Utilizadas

| Área | Tecnologias |
| :--- | :--- |
| **Front-End** | React 19, TypeScript, Vite, React Router, Axios, CSS Modules |
| **Back-End** | Node.js, TypeScript, Fastify |
| **Banco de Dados & ORM** | MySQL (`mysql2`), Drizzle ORM |
| **Autenticação** | Better Auth (sessões via cookies e controle por papéis) |
| **Pagamentos** | AbacatePay API v2 (subcontas, split e webhooks HMAC) |
| **Infraestrutura** | Docker & Docker Compose |

---

## Como Rodar o Projeto

### Opção 1 - Com Docker Compose (Recomendado)

**Pré-requisitos:** [Docker](https://www.docker.com/), [Node.js](https://nodejs.org/) e [Git](https://git-scm.com/).

1. Clone o repositório:
```bash
git clone https://github.com/ySamantha/Sorriso-do-Cerrado.git
cd Sorriso-do-Cerrado
```

2. **(Obrigatório)** Gere o arquivo `.env` na raiz com a chave de criptografia dos perfis de artesão:
```bash
node setup-env.mjs
```
> Sem esse passo, o Docker Compose não sobe porque a variável `ARTESAO_DADOS_ENCRYPTION_KEY` é obrigatória. Após gerada, **não altere nem versione** essa chave - trocá-la impede a leitura de perfis já salvos no banco.
>

3. Suba os containers (MySQL, Back-End e Front-End):
```bash
docker compose up --build
```
- **Front-End:** `http://localhost:5173`
- **Back-End:** `http://localhost:3000`
- **MySQL (porta externa):** `localhost:3307` (banco `sorrisodb`, usuário/senha `root`)

---

### Opção 2 - Localmente (sem Docker)

**Pré-requisitos:** [Node.js](https://nodejs.org/), [Git](https://git-scm.com/) e um servidor **MySQL** rodando localmente.

1. Crie o arquivo `.env` dentro da pasta `Back-End/` configurando o banco e a chave obrigatória:
```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=suasenha
DB_NAME=sorrisodb

# Autenticação e URLs
BETTER_AUTH_SECRET=sua_chave_secreta_longa
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@exemplo.com
ADMIN_PASSWORD=sua_senha_admin

# Criptografia de dados do artesão (mínimo 32 caracteres estáveis)
ARTESAO_DADOS_ENCRYPTION_KEY=sua_chave_de_criptografia_com_32_ou_mais_caracteres

# AbacatePay (modo teste padrão)
ABACATEPAY_MODE=test
ABACATEPAY_API_KEY_DEV=abc_dev_sua_chave
ABACATEPAY_COMMISSION_TEST=10
ABACATEPAY_SPLIT_HABILITADO=true
ABACATEPAY_WEBHOOK_SECRET=seu_webhook_secret_com_32_caracteres
```

2. Inicie o Back-End:
```bash
cd Back-End
npm install
npm run dev
```

3. Em outro terminal, a partir da raiz do projeto, inicie o Front-End:
```bash
cd Front-End
npm install
npm run dev
```

---

## Segurança, Administração e Pagamentos

- **Papéis de Usuário:** cadastros públicos recebem o papel `cliente`. O papel `artisan` é atribuído após confirmação do cadastro profissional. Contas administrativas usam `admin` ou `super_admin` (com trilha de auditoria e exclusão lógica).
- **Produção (`NODE_ENV=production`):** configure obrigatoriamente `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `ADMIN_EMAIL`, `ARTESAO_DADOS_ENCRYPTION_KEY` e `VITE_API_URL` (no Front-End).
- **AbacatePay:** em modo teste (`ABACATEPAY_MODE=test`), a tela de pagamento disponibiliza **Simular pagamento (Dev Mode)**. Caso as subcontas ainda não estejam habilitadas na conta, defina `ABACATEPAY_SPLIT_HABILITADO=false`. Para webhooks, configure o endpoint `/webhooks/abacatepay` (API v2).

---

## 👩‍💻 Autores
* [Gabriel Cézar Peres Matos](https://github.com/gbrielzera) - UC23102346
* [Pedro Henrique Cavalcante de Sousa](https://github.com/pedrocavati) - UC24102627
* [Samantha Yumi Tanaka](https://github.com/ySamantha) - UC23201068
* [Samuel Batista Rennó](https://github.com/SamuelBati) - UC23102986
* [Vinicios Trindade Costa](https://github.com/Vinhicious) - UC23102647

* Matéria: Soluções Computacionais
* Turma: GPE17M80081
* [Apresentação do projeto Sorriso do Cerrado disponível no YouTube](https://youtu.be/uac34t2DagU) 
