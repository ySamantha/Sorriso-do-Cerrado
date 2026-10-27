# Códigos-Fonte dos Testes Automatizados

Esta seção documenta a implementação técnica real dos scripts de teste automatizado desenvolvidos pela equipe com os frameworks **Jest** (backend) e **Cypress** (frontend E2E).

---

## 1. Testes Unitários com Jest

### 1.1 Validação de E-mail (`validarEmail.js` e `validarEmail.test.js`)
Função pura responsável por validar a estrutura de e-mails recebidos durante o cadastro e atualização de perfis:

```javascript
// Back-End/validarEmail.js
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
module.exports = validarEmail;
```

```javascript
// Back-End/validarEmail.test.js
const validarEmail = require('./validarEmail');

test('deve validar um e-mail correto', () => {
    expect(validarEmail('teste@teste.com')).toBe(true);
});

test('deve invalidar um e-mail sem @', () => {
    expect(validarEmail('testeteste.com')).toBe(false);
});

test('deve invalidar um e-mail sem domínio', () => {
    expect(validarEmail('teste@')).toBe(false);
});
```

---

### 1.2 Lógica do Carrinho de Compras (`carrinho.test.js`)
Validação do comportamento de acúmulo de itens e incremento de quantidades:

```javascript
// carrinho.test.js
function adicionarAoCarrinho(carrinho, produto) {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    return carrinho;
}

test('adiciona produto novo ao carrinho', () => {
    const carrinho = [];
    const produto = { id: 1, nome: 'Vaso de Capim Dourado', preco: 50 };
    const resultado = adicionarAoCarrinho(carrinho, produto);

    expect(resultado.length).toBe(1);
    expect(resultado[0].quantidade).toBe(1);
});

test('incrementa quantidade de produto existente no carrinho', () => {
    const carrinho = [{ id: 1, nome: 'Vaso de Capim Dourado', preco: 50, quantidade: 1 }];
    const produto = { id: 1, nome: 'Vaso de Capim Dourado', preco: 50 };
    const resultado = adicionarAoCarrinho(carrinho, produto);

    expect(resultado.length).toBe(1);
    expect(resultado[0].quantidade).toBe(2);
});
```

---

### 1.3 Verificação de Administrador via Token (`login.test.js`)
Validação da lógica de extração do perfil administrativo:

```javascript
// login.test.js
function isAdmin(user) {
    return user && user.isAdmin === true;
}

test('identifica usuário administrador com sucesso', () => {
    const userAdmin = { id: 1, email: 'artesa@sorrisodocerrado.com.br', isAdmin: true };
    expect(isAdmin(userAdmin)).toBe(true);
});

test('identifica usuário cliente comum sem privilégios', () => {
    const userCliente = { id: 2, email: 'cliente@gmail.com', isAdmin: false };
    expect(isAdmin(userCliente)).toBe(false);
});

test('rejeita objetos vazios ou indefinidos', () => {
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
});
```

---

## 2. Testes End-to-End com Cypress

### 2.1 Fluxo do Carrinho de Compras (`carrinho.cy.js`)
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

### 2.2 Navegação e Detalhes do Produto (`detalhesProduto.cy.js`)
```javascript
describe('Navegação e Detalhes do Produto', () => {
  it('Navega da navbar para catálogo e abre detalhes', () => {
    cy.visit('http://localhost:5173/');
    cy.contains('Catálogo').click();
    cy.url().should('include', '/catalogo');
    cy.get('.product-card').first().click();
    cy.url().should('include', '/detalhes');
    cy.get('h1').should('be.visible');
  });
});
```

### 2.3 Persistência de Favoritos (`favoritos-copy-1.cy.js`)
```javascript
describe('Persistência de Favoritos', () => {
  it('Adiciona item aos favoritos e valida na página Meus Favoritos', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[type="email"]').type('cliente@teste.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.visit('http://localhost:5173/catalogo');
    cy.get('[data-testid="btn-favorito"]').first().click();
    cy.visit('http://localhost:5173/favoritos');
    cy.get('.favorito-item').should('have.length.at.least', 1);
  });
});
```
