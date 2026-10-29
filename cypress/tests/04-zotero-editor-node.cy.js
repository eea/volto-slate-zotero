import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  buildSlateBlock,
  buildZoteroNode,
  setZoteroBlocks,
  visitPageEdit,
} from '../support/zotero';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('renders zotero citation node in editor', () => {
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

    visitPageEdit();
    cy.get('.block.slate').should('exist');
    cy.get('#toolbar-save').click();
    cy.url().should('include', '/cypress/my-page');
  });
});
