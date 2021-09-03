/// <reference types="cypress" />

const addItem = (text) => {
  cy.get('input.new-todo').type(`${text}{enter}`)
}

before(() => {
  cy.visit('localhost:3000')
  cy.contains('h1', 'todos')
})

// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// remember to manually delete all items before running the test
// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

it('adds two items', () => {
  // get the input field and type text and "enter"
  addItem('Item1')
  // assert that the new Todo item has been added added to the list
  cy.contains('li.todo', 'Item1')
  addItem('Item2')
  cy.contains('li.todo', 'Item2')
  // cy.get(...).should('have.length', 2)
  cy.get('ul.todo-list > li').should('have.length', 2)
})

it('can mark an item as completed', () => {
  // adds a few items
  addItem('Item3')
  addItem('Item4')
  // marks the first item as completed
  cy.get('ul.todo-list > li').first().find('input.toggle').check()

  // confirms the first item has the expected completed class
  // confirms the other items are still incomplete
  cy.get('ul.todo-list > li').then((listItems) => {
    for (let i = 0; i < listItems.length; i++) {
      if (i == 0) {
        cy.get(listItems[i]).should('have.class', 'completed')
      } else {
        cy.get(listItems[i]).should('not.have.class', 'completed')
      }
    }
  })
})

it('can delete an item', () => {
  // deletes the first item
  // use force: true because we don't want to hover
  cy.get('ul.todo-list > li').then((listItems) => {
    const itemsLength = listItems.length

    cy.get(listItems[0]).find('.destroy').click({ force: true })
    // confirm the deleted item is gone from the dom
    // and also confirm the other item still exists
    cy.get(listItems).should('have.length', itemsLength - 1)
  })
})

it('can add many items', () => {
  let listItems,
    itemsLength,
    N = null
  cy.get('ul.todo-list > li')
    .then((gotListItems) => {
      listItems = gotListItems
      itemsLength = listItems.length
      N = 5
      for (let k = 0; k < N; k += 1) {
        cy.get('input.new-todo').type(`Programmatic Item ${k + 1}{enter}`)
        // probably want to have a reusable function to add an item!
      }
    })
    .then(() => {
      // check number of items
      cy.get('ul.todo-list > li').should('have.length', N + itemsLength)
    })
})

it('adds item with random text', () => {
  // use a helper function with Math.random()
  const randomText = Math.random().toString().slice(2, 14)
  addItem(`Random Item ${randomText}`)
  // or Cypress._.random() to generate unique text label
  // add such item
  // and make sure it is visible and does not have class "completed"
  cy.contains(randomText)
    .should('be.visible')
    .and('not.have.class', 'completed')
})

it('starts with zero items', () => {
  // check if the list is empty initially
  //   find the selector for the individual TODO items
  //   in the list
  //   use cy.get(...) and it should have length of 0
  //   https://on.cypress.io/get
  cy.get('ul.todo-list > li').then((listItems) => {
    if (listItems.length > 0) {
      for (let i = 0; i < listItems.length; i++) {
        cy.get(listItems[i]).find('.destroy').click({ force: true })
      }
    }
  })
  cy.get('ul.todo-list > li').should('have.length', 0)
})

it('does not allow adding blank todos', () => {
  // https://on.cypress.io/catalog-of-events#App-Events
  cy.on('uncaught:exception', (e) => {
    // check e.message to match expected error text
    // return false if you want to ignore the error
    const isBlankTodo = e.message.includes('Cannot add a blank todo')
    console.log('isBlankTodo: ', isBlankTodo)

    if (isBlankTodo) {
      return false
    }
  })

  // try adding an item with just spaces
  addItem(' ')
})

// what a challenge?
// test more UI at http://todomvc.com/examples/vue/
