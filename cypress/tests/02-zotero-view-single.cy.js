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

  it('renders a single Zotero citation and footnotes block', () => {
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
        footnotes: {
          '@type': 'slateFootnotes',
          title: 'Footnotes',
          global: true,
        },
      },
    });

    visitPageView();

    cy.get('span.citation-item')
      .should('have.length', 1)
      .first()
      .should('have.attr', 'data-footnote-indice', '[1]')
      .and('contain', 'failure');
    cy.get('.footnotes-listing-block ol').children().should('have.length', 1);
    cy.contains('Footnotes');
    cy.contains('Luck is failure');
  });
});
