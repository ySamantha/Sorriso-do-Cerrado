# Casos de Teste Detalhados (v2.0)

Relação consolidada dos casos de teste automatizados e funcionais que validam o **Sorriso do Cerrado**, englobando os **novos cenários integrados do Marketplace (Better Auth + Fastify + Docker Compose)** e a **suíte contínua de testes unitários e E2E**.

---

## 1. Novos Casos de Teste Integrados — Better Auth, RBAC e Banners (Python + Docker)

### CT-V2-01 — Fluxo Completo de Autenticação e Sessão (`e2e_flow_test.py`)
* **Objetivo:** Validar o ciclo completo de conta com **Better Auth** em ambiente containerizado.
* **Cenários Validados:**
    1. Cadastro e login por e-mail/senha com emissão de cookie de sessão (`POST /api/auth/sign-in/email`).
    2. Atualização de dados cadastrais e tentativa de alteração para e-mail já existente (garantindo que a conta não seja alterada nem exponha a existência do e-mail).
    3. Atualização para e-mail único via `/api/auth/change-email` e confirmação via `/api/auth/get-session`.
    4. Alteração de senha com `revokeOtherSessions: true` (`/api/auth/change-password`), logout (`/api/auth/sign-out`) e novo login com a nova senha.

### CT-V2-02 — Favoritos, Vendas e Bloqueio por Papel (`e2e_flow_test.py`)
* **Objetivo:** Validar rotas protegidas da API Fastify 5 com cookie de sessão Better Auth.
* **Cenários Validados:**
    1. Adição de produto aos favoritos (`POST /favoritos` → HTTP `201`).
    2. Registro de venda autenticada (`POST /vendas` → HTTP `201`).
    3. Tentativa de cliente comum deletar um produto (`DELETE /produtos/:id` → HTTP `403 Forbidden`).
    4. Login como administrador para desativação/limpeza da conta de teste (`DELETE /usuarios/:id` → HTTP `200`).

### CT-V2-03 — Criação de Banners via URL Externa e Upload Multipart (`banner_creation_test.py`)
* **Objetivo:** Garantir que administradores consigam criar banners tanto por URL externa quanto via upload de imagem PNG (`multipart/form-data`), validando a publicação na listagem `GET /banners`.
* **Cenários Validados:**
    1. Login administrativo via Better Auth.
    2. Criação de banner com URL externa (`POST /banners` → HTTP `201`) e confirmação na listagem.
    3. Upload de imagem PNG em `POST /upload`, criação do banner associado e limpeza dos artefatos ao final.

### CT-V2-04 — Checkout Pix, Subcontas, Saques e Webhooks AbacatePay (Homologação `abc_dev_`)
* **Objetivo:** Validar a geração de cobrança Pix com *split*, consulta periódica de status, idempotência de webhook (`eventos_abacatepay`) e regra de valor mínimo de saque (`R$ 3,50`).
* **Verificações:**
    * Rejeição de saque inferior a `R$ 3,50` (HTTP `400`).
    * Rejeição de saque maior que o saldo disponível (HTTP `400`).
    * Validação de `X-Webhook-Secret` e assinatura **HMAC-SHA256** em `/webhooks/abacatepay`.

---

## 2. Casos de Teste Unitários Contínuos (Jest)

| ID | Título | Regra Validada | Status |
| :---: | :--- | :--- | :---: |
| **CT001** | Validação de Estrutura de E-mail | Rejeição de e-mails sem `@` ou domínio inválido (`validarEmail.test.js`). | Aprovado |
| **CT002** | Validação de Preço Positivo | Aceitar apenas preços estritamente maiores que zero. | Aprovado |
| **CT003** | Adição de Produto Novo ao Carrinho | Inserção de item inexistente com quantidade inicial `1` (`carrinho.test.js`). | Aprovado |
| **CT004** | Incremento de Quantidade no Carrinho | Incremento da quantidade sem duplicar linha do produto. | Aprovado |
| **CT005** | Verificação de Privilégios Administrativos | Distinção entre contas administrativas e clientes comuns (`login.test.js`). | Aprovado |

---

## 3. Casos de Teste End-to-End no Navegador (Cypress)

| ID | Título | Arquivo | Status |
| :---: | :--- | :--- | :---: |
| **CT009** | Persistência de Favoritos após Novo Login | `favoritos-copy-1.cy.js` | Aprovado |
| **CT010** | Consistência no Cálculo e Soma do Carrinho | `carrinho.cy.js` | Aprovado |
| **CT011** | Navegação até o Catálogo e Detalhes via Navbar | `detalhesProduto.cy.js` | Aprovado |
| **CT012** | Fluxo Completo do Carrinho via Interface | `carrinho.cy.js` | Aprovado |
