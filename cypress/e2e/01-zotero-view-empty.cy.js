import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  buildSlateBlock,
  setZoteroBlocks,
  visitPageView,
} from '../support/zotero';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('does not render a citation when no Zotero entry is saved', () => {
    setZoteroBlocks({
      blocks: {
        title: {
          '@type': 'title',
        },
        slate: buildSlateBlock({
          before: 'Luck is failure that failed.',
        }),
      },
    });

    visitPageView();

    cy.contains('My Page');
    cy.get('span.citation-item').should('not.exist');
    cy.contains('Footnotes').should('not.exist');
  });
});
