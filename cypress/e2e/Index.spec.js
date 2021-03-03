describe('Happy Path', () => {
  it('Loads app', () => {
    cy.visit('/')
    cy.contains('.slogan', 'search the marvel universe')
  })

  it('Find (?name=thor)', () => {
    cy.visit('/')
    cy.get('.search-box')
      .type('thor', { delay: 1000 })
      .type('{enter}')
      .get('.search-list li a')
      .should('have.length', 1)
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

  it('Filter (?nameStartsWith=thor)', () => {
    cy.visit('/')
    cy.get('.search-box')
      .type('thor', { delay: 1000 })
      .get('.search-list li a')
      .its('length')
      .should('be.gt', 1)
  })

  it.skip('Character Page - Has Comic Cards', () => {
    cy.visit('/')
    cy.get('.search-box')
      .type('thor', { delay: 1000 })
      .type('{enter}')
      .get('.search-list li')
      .first()
      .click()
      .get('.page-character-id')
      .find('.comics li')
      .wait(6000)
      .should('have.length', 6)
  })

  it('Character Page - Test Redirect', () => {
    cy.visit('/character/thor', {
      failOnStatusCode: false, // redirects are 301/302 we're ok with that here
    })
    cy.url().should('include', '1009664')
  })

  it('Paging', () => {
    cy.visit('/')
    cy.get('.search-box')
      .type('t', { delay: 1000 })
      .get('.search-list li a')
      .its('length')
      .should('be.eq', 20)
    cy.scrollTo('bottom')
      .wait(4000)
      .get('.search-list li a')
      .its('length')
      .should('be.gt', 20)
  })

  it('Character Page - Background Styled', () => {
    cy.visit('/character/1009664')
    cy.get('.pg-character').should('have.attr', 'data-cy-bg-styled', 'true')
  })
})
