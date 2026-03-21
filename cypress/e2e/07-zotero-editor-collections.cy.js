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

  it('adds Zotero citations from collections and reuses the same footnote index for duplicates', () => {
    cy.fixture('zotero-items.json').then((itemsResp) => {
      const { body, statusCode, headers } = itemsResp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/collections/24C33/items/?start=0&limit=10&sort=title',
        { body, statusCode, headers },
      ).as('itemsResp');
    });

    cy.fixture('zotero-item1.json').then((item1Resp) => {
      const { body, statusCode, headers } = item1Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/INFEDJ40?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item1Resp');
    });

    cy.fixture('zotero-item2.json').then((item2Resp) => {
      const { body, statusCode, headers } = item2Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/QHCG97BD?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item2Resp');
    });

    visitPageEdit();

    cy.getSlateEditorAndType('Luck is failure that failed.');

    openZoteroSidebarForSelection('Luck', 'failure');
    openTopCollection();

    cy.wait('@itemsResp');
    openLibraryItem(0);
    previewActiveLibraryItem();
    cy.wait('@item1Resp');

    openLibraryItem(1);
    previewActiveLibraryItem();
    cy.wait('@item2Resp');

    saveZoteroSidebar();

    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .first()
      .should('have.attr', 'data-footnote-indice', '[1][2]');

    openZoteroSidebarForSelection('failed');
    openTopCollection();

    cy.wait('@itemsResp');
    openLibraryItem(0);
    previewActiveLibraryItem();
    cy.wait('@item1Resp');

    saveZoteroSidebar();

    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .eq(1)
      .should('have.attr', 'data-footnote-indice', '[1]');
  });
});
