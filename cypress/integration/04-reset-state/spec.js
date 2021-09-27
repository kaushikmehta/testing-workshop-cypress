/// <reference types="cypress" />
/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = (text) => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

describe('reset data using XHR call', () => {
  beforeEach(() => {
    // application should be running at port 3000
    // and the "localhost:3000" is set as "baseUrl" in "cypress.json"
    // call /reset endpoint with POST method and object {todos: []}
    cy.request('POST', '/reset', {
      todos: []
    })
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('reset data using cy.writeFile', () => {
  beforeEach(() => {
    // TODO write file "todomvc/data.json" with stringified todos object
    // file path is relative to the project's root folder
    // where cypress.json is located
    const noTodos = {
      todos: []
    }
    const stringifiedTodos = JSON.stringify(noTodos, null, 2)
    cy.writeFile('todomvc/data.json', stringifiedTodos, 'utf8')
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('reset data using a task', () => {
  beforeEach(() => {
    // call a task to reset data
    cy.task('resetData')
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('li.todo').should('have.length', 2)
  })
})

describe('set initial data', () => {
  it('sets data to complex object right away', () => {
    // call task and pass an object with todos
    cy.task('resetData', {
      todos: [
        {
          id: 'some-unique-id',
          title: 'Adding Todo with Task',
          completed: true
        }
      ]
    })

    cy.visit('/')
    // check what is rendered
    cy.get('li.todo').should('have.length', 1)
  })

  it('sets data using fixture', () => {
    // load todos from "cypress/fixtures/two-items.json"
    cy.fixture('two-items').then((todos) => {
      cy.task('resetData', { todos })
    })
    // and then call the task to set todos
    cy.visit('/')
    // check what is rendered
    cy.get('li.todo').should('have.length', 2)
  })
})
