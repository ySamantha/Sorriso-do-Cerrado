# Casos de Teste Detalhados

Relação completa dos casos de teste elaborados e executados pela equipe de engenharia para validação do sistema Sorriso do Cerrado.

---

## 1. Casos de Teste Unitários (Jest)

### CT001 — Validação de Estrutura de E-mail
* **Objetivo:** Verificar se a função utilitária `validarEmail` rejeita e-mails mal formatados e aceita e-mails válidos.
* **Entrada:** `teste@email.com` (válido), `emailinvalido` (inválido), `teste@` (inválido).
* **Resultado Esperado:** Retornar `true` para e-mails regulares e `false` para ausência de `@` ou domínio incompleto.
* **Status:** Aprovado.

### CT002 — Validação de Preço Positivo no Produto
* **Objetivo:** Garantir que o sistema não permita o cadastro de produtos com valor zero ou negativo.
* **Entrada:** Preço `45.00` (válido), `0.00` (inválido), `-10.00` (inválido).
* **Resultado Esperado:** Aceitar apenas valores numéricos maiores que zero.
* **Status:** Aprovado.

### CT003 — Adição de Produto Novo ao Carrinho
* **Objetivo:** Validar a função de inclusão de item inexistente na lista de itens do carrinho.
* **Entrada:** Carrinho vazio `[]`, produto com ID `1`.
* **Resultado Esperado:** O carrinho deve conter 1 item com quantidade inicial igual a 1.
* **Status:** Aprovado.

### CT004 — Incremento de Quantidade de Produto Existente no Carrinho
* **Objetivo:** Validar que ao adicionar um produto já presente no carrinho, sua quantidade seja incrementada sem duplicar a linha.
* **Entrada:** Carrinho com produto ID `1` (quantidade 1), adicionando novamente o produto ID `1`.
* **Resultado Esperado:** O carrinho mantém 1 linha com quantidade atualizada para 2.
* **Status:** Aprovado.

### CT005 — Identificação de Administrador via Token JWT
* **Objetivo:** Validar a função auxiliar `isAdmin` que decodifica o payload do token JWT para confirmar privilégios.
* **Entrada:** Token assinado com `{ id: 1, isAdmin: true }` e token com `{ id: 2, isAdmin: false }`.
* **Resultado Esperado:** Retornar `true` para a administradora e `false` para clientes comuns.
* **Status:** Aprovado.

---

## 2. Casos de Teste de API (Postman)

### CT006 — Autenticação e Autorização em Rotas Protegidas
* **Objetivo:** Validar controle de acesso baseado em papéis nas rotas administrativas da API REST.
* **Cenários Testados:**
    1. Login como cliente comum (retorno 200 + token).
    2. Requisição `POST /banners` com token de cliente (retorno esperado: `403 Forbidden`).
    3. Login como administrador (retorno 200 + token admin).
    4. Requisição `POST /banners` com token de admin (retorno esperado: `201 Created`).
* **Status:** Aprovado.

### CT007 — Atualização de Dados com Validação de Unicidade
* **Objetivo:** Testar alteração de e-mail impedindo a apropriação de um e-mail já pertencente a outro usuário.
* **Entrada:** Tentativa de alterar e-mail para um endereço já registrado na base.
* **Resultado Esperado:** Resposta HTTP 400 ou 409 com mensagem informando duplicidade.
* **Status:** Aprovado.

### CT008 — Consulta a Produto Inexistente por ID
* **Objetivo:** Verificar resposta padronizada ao requisitar um ID inexistente na rota `GET /produtos/:id`.
* **Entrada:** `GET /produtos/999999`.
* **Resultado Esperado:** Resposta HTTP `404 Not Found` com mensagem amigável em JSON.
* **Status:** Aprovado.

---

## 3. Casos de Teste End-to-End (Cypress)

### CT009 — Persistência de Favoritos após Novo Login
* **Objetivo:** Garantir que itens adicionados aos favoritos por um cliente permaneçam disponíveis após logout e novo login.
* **Arquivo:** `favoritos-copy-1.cy.js`.
* **Status:** Aprovado.

### CT010 — Consistência no Cálculo e Soma do Carrinho
* **Objetivo:** Verificar em tela se a soma dinâmica dos preços de múltiplos produtos totaliza exatamente o valor correto (ex.: R$ 500,00).
* **Arquivo:** `carrinho.cy.js`.
* **Status:** Aprovado.

### CT011 — Navegação até a Página de Produtos via Navbar
* **Objetivo:** Clicar no link de produtos do cabeçalho e verificar se o catálogo carrega corretamente com a grade de cards.
* **Arquivo:** `detalhesProduto.cy.js`.
* **Status:** Aprovado.

### CT012 — Fluxo Completo do Carrinho via Interface
* **Objetivo:** Adicionar peça da vitrine ao carrinho, abrir a gaveta de compras, alterar a quantidade e verificar os totais.
* **Arquivo:** `carrinho.cy.js`.
* **Status:** Aprovado.
