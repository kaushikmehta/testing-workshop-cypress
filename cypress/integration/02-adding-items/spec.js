/// <reference types="cypress" />

const { forEachChild } = require('typescript')

it('loads', () => {
  // application should be running at port 3000
  cy.visit('localhost:3000')
  cy.contains('h1', 'todos')
})

// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// remember to manually delete all items before running the test
// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

const items = ['first', 'second']

it('adds two items', () => {
  var idx = 0
  while (idx < 2) {
    cy.get('.new-todo').type(items[idx]).type('{enter}')
    cy.get(':nth-child(' + (idx + 1) + ') > .view > label').contains(items[idx])
    ++idx
    continue
  }
  cy.get('.todo').should('have.length', 2)

  var index = 0
  while (index < 2) {
    console.log(index)
    cy.get(':nth-child(1) > .view > .destroy').click({
      force: true
    })
    ++index
    continue
  }
  // repeat twice
  //    get the input field
  //    type text and "enter"
  //    assert that the new Todo item
  //    has been added added to the list
  // cy.get(...).should('have.length', 2)
})

const new_items = ['1', '2', '3', '4']

it('can mark an item as completed', () => {
  var idx = 0
  while (idx < 4) {
    cy.get('.new-todo').type(new_items[idx]).type('{enter}')
    ++idx
    continue
  }

  cy.get(':nth-child(1) > .view > .toggle').click()
  var len = 4
  console.log(len)
  var idx_1 = 0
  while (idx_1 < len) {
    if (idx_1 == 0) {
      cy.get(':nth-child(' + (idx_1 + 1) + ') > .view > .toggle').should(
        'be.checked'
      )
    } else {
      cy.get(':nth-child(' + (idx_1 + 1) + ') > .view > .toggle').should(
        'not.be.checked'
      )
    }
    ++idx_1
    continue
  }

  idx_1 = 0
  while (idx_1 < len) {
    cy.get(':nth-child(1) > .view > .destroy').click({
      force: true
    })
    ++idx_1
    continue
  }
  // adds a few items
  // marks the first item as completed
  // confirms the first item has the expected completed class
  // confirms the other items are still incomplete
})

it('can delete an item', () => {
  var items = ['a', 'b', 'c', 'd']
  var idx = 0
  while (idx < items.length) {
    cy.get('.new-todo').type(items[idx]).type('{enter}')
    ++idx
    continue
  }
  // adds a few items
  var len = 4
  // var str = cy.get(':nth-child(' + (idx + 1) + ') > .view > label')
  cy.get(':nth-child(1) > .view > .destroy').click({ force: true })
  // deletes the first item
  // use force: true because we don't want to hover
  var len_1 = 3
  console.log(len)
  console.log(len_1)
  assert(len === len_1 + 1)
  idx = 0
  var len_item = items.length

  // confirm the deleted item is gone from the dom
  while (idx < len_item) {
    if (idx == 0) {
      cy.get('.todo').should('not.contain', items[idx])
    } else {
      cy.get('.todo').should('contain', items[idx])
    }
    ++idx
    continue
  }
  // confirm the other item still exists
  var idx_1 = 0
  while (idx_1 < len_1) {
    cy.get(':nth-child(1) > .view > .destroy').click({ force: true })
    ++idx_1
    continue
  }
})

it('can add many items', () => {
  function add_item(item) {
    cy.get('.new-todo').type(item).type('{enter}')
  }
  const i = 'hala'
  const N = 5
  for (let k = 0; k < N; k += 1) {
    add_item(i)
    // add an item
    // probably want to have a reusable function to add an item!
  }
  var idx = 0
  while (idx < N) {
    cy.get('.todo').should('contain', i)
    cy.get(':nth-child(1) > .view > .destroy').click({ force: true })
    //delete the item
    ++idx
    continue
  }
  cy.get('.todo').should('have.length', 0)
  // check number of items
})

it('adds item with random text', () => {
  function generate_str(len) {
    var idx = 0
    let retval = ''
    while (idx < len) {
      let ran = Math.floor(Math.random() * 94) + 32
      var char = String.fromCharCode(ran)
      retval = retval + char
      ++idx
      continue
    }
    return retval
  }
  let add = generate_str(5)
  cy.get('.new-todo').type(add).type('{enter}')
  cy.contains(add).should('be.visible')
  cy.contains(add).should('not.have.class', 'completed')
  cy.get(':nth-child(1) > .view > .destroy').click({ force: true })

  // use a helper function with Math.random()
  // or Cypress._.random() to generate unique text label
  // add such item
  // and make sure it is visible and does not have class "completed"
})

it('starts with zero items', () => {
  cy.get('.todo').should('have.length', 0)
  // check if the list is empty initially
  //   find the selector for the individual TODO items
  //   in the list
  //   use cy.get(...) and it should have length of 0
  //   https://on.cypress.io/get
})

it('does not allow adding blank todos', () => {
  // https://on.cypress.io/catalog-of-events#App-Events
  cy.on('uncaught:exception', (err) => {
    if (err.message.includes('Cannot add a blank todo')) {
      return false
    }
    // check e.message to match expected error text
    // return false if you want to ignore the error
  })
  cy.get('.new-todo').type(' ').type('{enter}')
  // try adding an item with just spaces
})

// what a challenge?
// test more UI at http://todomvc.com/examples/vue/
