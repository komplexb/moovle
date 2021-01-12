describe('Character Page', () => {
  it.only('Thor Background Styled', () => {
    cy.visit('/character/1009664')
    cy.get('.pg-character').should('have.attr', 'data-cy-bg-styled', 'true')
  })
})
