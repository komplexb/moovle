describe('Happy Path', () => {
  it('Loads app', () => {
    cy.visit('/')
    cy.contains('.slogan', 'search the marvel universe')
  })

  it('I feel lucky', () => {
    cy.visit('/')
    cy.get('.feel-lucky-list__button')
      .first()
      .click()
      .get('.search-list li')
      .first()
      .click()
      .get('header > h1')
  })

  it('Find (?name=thor)', () => {
    cy.visit('/')
    cy.get('.search-box')
      .type('thor', { delay: 1000 })
      .type('{enter}')
      .get('.search-list li a')
      .should('have.length', 1)
  })

  it('Filter (?nameStartsWith=thor)', () => {
    cy.visit('/')
    cy.get('.search-box')
      .type('thor', { delay: 1000 })
      .get('.search-list li a')
      .its('length')
      .should('be.gt', 1)
  })

  it('Character Page - Has Comic Cards', () => {
    cy.visit('/')
    cy.get('.search-box')
      .type('thor', { delay: 1000 })
      .type('{enter}')
      .get('.search-list li')
      .first()
      .click()
      .get('.page-character-id')
      .find('.comics li')
      .wait(1000)
      .should('have.length', 6)
  })

  it.skip('Character Page - Background Styled', () => {
    cy.visit('/character/1009664')
    cy.get('.pg-character').should('have.attr', 'data-cy-bg-styled', 'true')
  })
})
