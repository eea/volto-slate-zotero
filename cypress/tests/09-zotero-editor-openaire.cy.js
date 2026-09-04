import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  openOpenAireResult,
  openOpenAireTab,
  openZoteroSidebarForSelection,
  previewActiveOpenAireResult,
  saveZoteroSidebar,
  searchZoteroLibrary,
  visitPageEdit,
  waitForSidebarCitationCount,
} from '../support/zotero';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('searches OpenAire results and adds a citation', () => {
    cy.fixture('zotero-subCollections.json').then((subCollections) => {
      const { body, statusCode, headers } = subCollections;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items?q=forest&limit=10&start=0&sort=title',
        { body, statusCode, headers },
      ).as('zoteroSearchResp');
    });

    cy.fixture('zotero-openaireSearchResultsPub.json').then(
      (openaireSearchResultsPub) => {
        const { body, statusCode, headers } = openaireSearchResultsPub;

        cy.intercept(
          'GET',
          'https://api.openaire.eu/search/publications/?author=forest&format=json&size=20&page=1',
          { body, statusCode, headers },
        ).as('openaireSearchResultsPubAuthor');

        cy.intercept(
          'GET',
          'https://api.openaire.eu/search/publications/?title=forest&format=json&size=20&page=1',
          { body, statusCode, headers },
        ).as('openaireSearchResultsPubTitle');
      },
    );

    cy.fixture('zotero-openaireSearchResultsRSD.json').then(
      (openaireSearchResultsRSD) => {
        const { body, statusCode, headers } = openaireSearchResultsRSD;

        cy.intercept(
          'GET',
          'https://api.openaire.eu/search/datasets/?author=forest&format=json&size=20&page=1',
          { body, statusCode, headers },
        ).as('openaireSearchResultsRsdAuthor');

        cy.intercept(
          'GET',
          'https://api.openaire.eu/search/datasets/?title=forest&format=json&size=20&page=1',
          { body, statusCode, headers },
        ).as('openaireSearchResultsRsdTitle');
      },
    );

    cy.fixture('zotero-saveItemResponse.json').then((saveItemResponse) => {
      const { body, statusCode, headers } = saveItemResponse;

      cy.intercept('POST', 'https://api.zotero.org/users/6732/items/', {
        body,
        statusCode,
        headers,
      }).as('saveItemResponse');
    });

    cy.fixture('zotero-item4.json').then((item4Resp) => {
      const { body, statusCode, headers } = item4Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/H8TWWRZC?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item4Resp');
    });

    visitPageEdit();

    cy.getSlateEditorAndType('Luck is failure that failed.');

    openZoteroSidebarForSelection('Luck', 'failure');
    searchZoteroLibrary('forest');

    cy.wait('@zoteroSearchResp');
    cy.wait('@openaireSearchResultsPubAuthor');
    cy.wait('@openaireSearchResultsPubTitle');
    cy.wait('@openaireSearchResultsRsdAuthor');
    cy.wait('@openaireSearchResultsRsdTitle');

    openOpenAireTab();
    openOpenAireResult();
    previewActiveOpenAireResult();

    cy.wait('@saveItemResponse');
    cy.wait('@item4Resp');
    waitForSidebarCitationCount(1);

    saveZoteroSidebar();

    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('have.attr', 'data-footnote-indice', '[1]');
  });
});
