import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  cancelZoteroSidebar,
  openZoteroSidebarForSelection,
  saveZoteroSidebar,
  visitPageEdit,
} from '../support/zotero';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('removes an empty citation when the Zotero sidebar is saved or canceled', () => {
    visitPageEdit();

    cy.getSlateEditorAndType('Luck is failure that failed.');

    openZoteroSidebarForSelection('Luck', 'failure');
    saveZoteroSidebar();

    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('not.exist');

    openZoteroSidebarForSelection('Luck', 'failure');
    cancelZoteroSidebar();

    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('not.exist');
  });
});
