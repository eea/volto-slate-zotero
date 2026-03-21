import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  openLibraryItem,
  openTopCollection,
  openZoteroSidebarForSelection,
  previewActiveLibraryItem,
  saveZoteroSidebar,
  visitPageEdit,
} from '../support/zotero';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('adds a citation from a Zotero subcollection', () => {
    cy.fixture('zotero-subCollections.json').then((subCollections) => {
      const { body, statusCode, headers } = subCollections;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/collections/TFU5D/collections/?start=0&limit=10&sort=title',
        { body, statusCode, headers },
      ).as('subCollections');
    });

    cy.fixture('zotero-items3.json').then((items3) => {
      const { body, statusCode, headers } = items3;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/collections/TFU5D/items/?start=0&limit=10&sort=title',
        { body, statusCode, headers },
      ).as('items3');
    });

    cy.fixture('zotero-items2.json').then((items2) => {
      const { body, statusCode, headers } = items2;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/collections/JGTEPMWE/items/?start=0&limit=10&sort=title',
        { body, statusCode, headers },
      ).as('items2');
    });

    cy.fixture('zotero-item3.json').then((item3Resp) => {
      const { body, statusCode, headers } = item3Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/STUJEJKU?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item3Resp');
    });

    visitPageEdit();

    cy.getSlateEditorAndType('Luck is failure that failed.');

    openZoteroSidebarForSelection('Luck', 'failure');
    openTopCollection(2);

    cy.wait('@subCollections');
    cy.wait('@items3');
    openLibraryItem(0);

    cy.wait('@items2');
    openLibraryItem(0);
    previewActiveLibraryItem();
    cy.wait('@item3Resp');

    saveZoteroSidebar();

    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('have.attr', 'data-footnote-indice', '[1]');
  });
});
