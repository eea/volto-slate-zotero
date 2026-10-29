import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  buildSlateBlock,
  buildZoteroNode,
  setZoteroBlocks,
  visitPageView,
} from '../support/zotero';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('deduplicates repeated Zotero citations across references', () => {
    setZoteroBlocks({
      blocks: {
        title: {
          '@type': 'title',
        },
        slate: buildSlateBlock({
          before: 'Luck is ',
          node: buildZoteroNode({
            uid: 'uid1',
            zoteroId: 'INFEDJ40',
            footnote: 'Luck is failure',
            text: 'failure',
          }),
          after: ' that failed.',
        }),
        slate2: buildSlateBlock({
          before: 'Repeating ',
          node: buildZoteroNode({
            uid: 'uid2',
            zoteroId: 'INFEDJ40',
            footnote: 'Luck is failure',
            text: 'failure',
          }),
          after: ' proves the point.',
        }),
        footnotes: {
          '@type': 'slateFootnotes',
          title: 'Footnotes',
          global: true,
        },
      },
    });

    visitPageView();

    cy.get('span.citation-item')
      .should('have.length', 2)
      .each(($item) => {
        cy.wrap($item).should('have.attr', 'data-footnote-indice', '[1]');
      });
    cy.get('.footnotes-listing-block ol').children().should('have.length', 1);
    cy.get('.footnotes-listing-block ol')
      .children()
      .first()
      .find('sup')
      .should('have.length', 2);
    cy.get('.footnotes-listing-block ol').children().first().contains('a');
    cy.get('.footnotes-listing-block ol').children().first().contains('b');
  });
});
