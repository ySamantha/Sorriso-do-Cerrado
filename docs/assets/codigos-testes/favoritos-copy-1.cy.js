describe('CT - Favoritos persistem após login/logout', () => {

  const baseUrl = 'http://localhost:5173'

  it('deve favoritar produto e manter após re-login', () => {

    cy.visit(`${baseUrl}/login`)

    cy.get('input[type="email"]').type('cliente@email.com')
    cy.get('input[type="password"]').type('123456')
    cy.contains('Entrar').click()

    cy.wait(500)

    cy.visit(`${baseUrl}/produtos`)

    cy.get('h3').should('exist')

    cy.get('button[title="Adicionar aos favoritos"]')
      .should('be.visible')
      .first()
      .click({ force: true })

    cy.get('a[href="/favoritos"]').click()

    cy.url().should('include', '/favoritos')

    cy.contains('Meus Favoritos').should('exist')

    cy.contains('Configurações ▼').click()

    cy.contains('Sair').click()

    cy.visit(`${baseUrl}/login`)

    cy.get('input[type="email"]').type('cliente@email.com')
    cy.get('input[type="password"]').type('123456')
    cy.contains('Entrar').click()

    cy.wait(500)

    cy.get('a[href="/favoritos"]').click()

    cy.contains('Meus Favoritos').should('exist')

  })

})