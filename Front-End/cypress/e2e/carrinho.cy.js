describe('CT-002 - Consistência no cálculo e soma do carrinho de compras', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173'); 
    cy.wait(2000);
  });

  it('Deve adicionar produtos clicando múltiplas vezes e calcular o total correto', () => {
    
    //VASO DE BARRO
    cy.contains(/Vaso de Barro/i)
      .closest('a') 
      .contains(/Adicionar/i)
      .click(); 
      
    cy.wait(500);

    cy.contains(/Vaso de Barro/i)
      .closest('a')
      .contains(/Adicionar/i)
      .click(); 

    cy.wait(1000);

    //BOLSA
    cy.contains(/Bolsa/i)
      .closest('a')
      .contains(/Adicionar/i)
      .click(); 

    cy.wait(1000);

    cy.visit('http://localhost:5173/carrinho');
    cy.wait(2000);

    cy.contains('Total: R$ 500.00').should('be.visible');  });
});