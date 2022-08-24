// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
// Alternatively you can use CommonJS syntax:
// require('./commands')

/* coverage-start
//Generate code-coverage
import '@cypress/code-coverage/support';
coverage-end */

export const slateBeforeEach = (contentType = 'Document') => {
  cy.autologin();
  cy.createContent({
    contentType: 'Document',
    contentId: 'cypress',
    contentTitle: 'Cypress',
  });
  cy.createContent({
    contentType: contentType,
    contentId: 'my-page',
    contentTitle: 'My Page',
    path: 'cypress',
  });
  cy.visit('/cypress/my-page');
  cy.waitForResourceToLoad('@navigation');
  cy.waitForResourceToLoad('@breadcrumbs');
  cy.waitForResourceToLoad('@actions');
  cy.waitForResourceToLoad('@types');
  cy.waitForResourceToLoad('my-page');
  cy.navigate('/cypress/my-page/edit');
  cy.get(`.block.title h1`);

  // intercept requests to simulate response and not use real credentials
  cy.fixture('zotero-credentials.json').then((credentialsResp) => {
    const { body, statusCode, headers } = credentialsResp;

    cy.intercept('GET', '**/@zotero', { body, statusCode, headers }).as(
      'credentialsResp',
    );
  });

  // intercept the top two collections
  cy.fixture('zotero-collections.json').then((collectionsResp) => {
    const { body, statusCode, headers } = collectionsResp;

    cy.intercept(
      'GET',
      'https://api.zotero.org/users/6732/collections/top/?start=0&limit=10&sort=title',
      { body, statusCode, headers },
    ).as('collectionsResp');
  });
};

export const slateAfterEach = () => {
  cy.autologin();
  cy.removeContent('cypress');
};
