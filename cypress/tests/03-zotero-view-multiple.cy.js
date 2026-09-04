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

  it('renders multiple citations from one Zotero element', () => {
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
            extra: [
              {
                uid: 'uid2',
                zoteroId: 'QHCG97BD',
                footnote: 'Yet another citation',
              },
            ],
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
      .should('have.attr', 'data-footnote-indice', '[1][2]');
    cy.get('.footnotes-listing-block ol').children().should('have.length', 2);
    cy.contains('Luck is failure');
    cy.contains('Yet another citation');
  });
});
