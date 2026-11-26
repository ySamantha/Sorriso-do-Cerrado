# Códigos-Fonte dos Testes Automatizados (v2.0)

Esta seção documenta os scripts automatizados do projeto, destacando os **novos testes de fluxo integrado em Python (Better Auth + Fastify + Docker Compose)** implementados na branch principal, além da suíte contínua em **Jest** e **Cypress**.

---

## 1. Testes Integrados v2.0 (Python + Docker Compose + Better Auth)

### 1.1 Fluxo Completo de Autenticação, Sessão, Favoritos, Vendas e RBAC (`testes/e2e_flow_test.py`)

O script sobe os contêineres via `docker compose up -d`, mantém os cookies de sessão com `http.cookiejar.CookieJar` e valida sequencialmente cadastro, login, alteração de e-mail (incluindo proteção contra enumeração de e-mails existentes), troca de senha com revogação de sessões, logout, re-login, favoritos, venda, bloqueio `403` de exclusão por cliente e limpeza administrativa:

```python
# Trecho ilustrativo de testes/e2e_flow_test.py
status, res = requisicao("/api/auth/change-password", method="POST", body={
    "currentPassword": senha_cliente,
    "newPassword": nova_senha_cliente,
    "revokeOtherSessions": True
})
assert status == 200, f"Erro ao alterar senha: {res}"

# Logout e novo login com a nova senha
status, res = requisicao("/api/auth/sign-out", method="POST")
assert status == 200
cookie_jar.clear()

status, res = requisicao("/api/auth/sign-in/email", method="POST", body={
    "email": email_cliente,
    "password": nova_senha_cliente
})
assert status == 200

# Rotas protegidas: Favoritos e Vendas
status, res = requisicao("/favoritos", method="POST", body={"id_produto": id_produto})
assert status == 201

# Controle de acesso: cliente não pode excluir produto (HTTP 403)
status, res = requisicao(f"/produtos/{id_produto}", method="DELETE")
assert status == 403
```

---

### 1.2 Criação de Banners por URL e Upload Multipart (`testes/banner_creation_test.py`)

Valida a autenticação administrativa via Better Auth e testa os dois modos de criação de banner na API Fastify (URL externa e upload binário PNG 1x1 via `multipart/form-data`), verificando o reflexo imediato em `GET /banners`:

```python
# Trecho ilustrativo de testes/banner_creation_test.py
status, result = request(
    "/api/auth/sign-in/email",
    method="POST",
    body={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
)
assert status == 200, f"Admin sign-in failed: {result}"

status, result = request(
    "/banners",
    method="POST",
    body={
        "titulo": f"URL banner test {unique_id}",
        "imagemURL": external_image_url,
        "link": "https://example.com/",
        "ordem": 901,
    },
)
assert status == 201
assert_banner_is_listed(result["id"], external_image_url)
```

---

## 2. Suíte Contínua de Testes Unitários (Jest) e E2E (Cypress)

### 2.1 Validação de E-mail (`validarEmail.test.js`)

```javascript
const validarEmail = require('./validarEmail');

test('deve validar um e-mail correto', () => {
    expect(validarEmail('teste@teste.com')).toBe(true);
});

test('deve invalidar um e-mail sem @', () => {
    expect(validarEmail('testeteste.com')).toBe(false);
});
```

### 2.2 Lógica do Carrinho (`carrinho.test.js`)

```javascript
function adicionarAoCarrinho(carrinho, produto) {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    return carrinho;
}
```

### 2.3 Fluxo E2E de Carrinho e Favoritos (`Cypress`)

```javascript
describe('Fluxo do Carrinho de Compras', () => {
  it('Adiciona produto ao carrinho e verifica total', () => {
    cy.visit('http://localhost:5173/catalogo');
    cy.get('[data-testid="btn-adicionar-carrinho"]').first().click();
    cy.get('[data-testid="icone-carrinho"]').click();
    cy.contains('Resumo do Pedido').should('be.visible');
    cy.get('[data-testid="total-carrinho"]').should('not.be.empty');
  });
});
```

*Os scripts originais completos em Jest e Cypress também podem ser consultados no [Acervo de Códigos de Teste (Semestre Anterior)](../semestre-anterior/testes/codigos-testes.md).*
