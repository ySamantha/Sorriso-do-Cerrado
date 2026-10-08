describe('Carrinho de compras', () => {
  it('deve adicionar produto ao carrinho com sucesso', () => {
    cy.visit('http://localhost:5173/produtos');

    // pega o primeiro produto da lista
    cy.get('button').contains('Adicionar ao Carrinho').first().click();

    // vai pro carrinho
    cy.visit('http://localhost:5173/carrinho');

    // valida se tem item no carrinho
    cy.get('body').should('contain', 'Quantidade');
  });
});