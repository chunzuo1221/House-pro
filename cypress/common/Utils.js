export const openApp = () => {
  // Cypress picks the baseUrl from the environment variable. In this case, check the package.json for the CYPRESS_baseUrl property passed to the run command
  cy.visit(Cypress.env('baseUrl'));
}

export const searchForAddress = (address) => {
  cy.get('#map').click()
    .type(address);
  cy.wait(200);
  cy.get('.pac-item').click();
  cy.get('#map').type('{downarrow}{enter}')
  cy.get('button[type="submit"][data-initial-text="Search"]').click();
}
