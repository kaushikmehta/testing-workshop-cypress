/// <reference types="cypress" />
// @ts-check
it('loads', () => {
  // application should be running at port 3000
  cy.visit('localhost:3000')

  // passing assertions
  // https://on.cypress.io/get
  cy.get('.new-todo').get('footer')

  // this assertion fails on purpose
  // can you fix it?
  // https://on.cypress.io/get
  cy.get('h1').contains('Todos', { matchCase: false })

  // https://on.cypress.io/get
  // use ("selector", "text") arguments to "cy.contains"
  cy.contains('[data-cy=app-title]', 'todos')

  // or can use regular expression
  cy.contains('[data-cy=app-title]', /^todos$/)

  // also good practice is to use data attributes specifically for testing
  // see https://on.cypress.io/best-practices#Selecting-Elements
  // which play well with "Selector Playground" tool
  cy.contains('[data-cy=app-title]', 'todos')
})
