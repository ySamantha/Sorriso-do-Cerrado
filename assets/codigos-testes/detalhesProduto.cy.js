describe('CT - Navegação até Produtos', () => {

  it('deve acessar a página de produtos via navbar', () => {

    // abre o site
    cy.visit('http://localhost:5173');

    // clica no link "Produtos" da navbar
    cy.contains('Produtos').click();

    // valida que mudou a URL
    cy.url().should('include', '/produtos');

    // valida que os cards aparecem
    cy.get('h2').should('contain.text', 'Nosso Catálogo');

    // valida se existe pelo menos 1 produto na tela
    cy.get('body').should('contain.text', 'R$');

  });

});