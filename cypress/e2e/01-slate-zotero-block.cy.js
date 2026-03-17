import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const API_PATH = Cypress.env('API_PATH') || 'http://localhost:8080/Plone';
const AUTH = {
  user: 'admin',
  pass: 'admin',
};

const buildZoteroNode = ({
  uid,
  zoteroId,
  footnote,
  footnoteTitle = footnote,
  text,
  extra = [],
}) => ({
  type: 'zotero',
  data: {
    uid,
    zoteroId,
    footnote,
    footnoteTitle,
    ...(extra.length
      ? {
          extra: extra.map((citation) => ({
            uid: citation.uid,
            zoteroId: citation.zoteroId,
            footnote: citation.footnote,
            footnoteTitle: citation.footnoteTitle || citation.footnote,
          })),
        }
      : {}),
  },
  children: [{ text }],
});

const buildSlateBlock = ({ before = '', node = null, after = '' }) => ({
  '@type': 'slate',
  plaintext: `${before}${node?.children?.[0]?.text || ''}${after}`,
  value: [
    {
      type: 'p',
      children: node
        ? [{ text: before }, node, { text: after }]
        : [{ text: `${before}${after}` }],
    },
  ],
});

const setZoteroBlocks = ({ blocks }) =>
  cy
    .request({
      method: 'GET',
      url: `${API_PATH}/cypress/my-page/@lock`,
      headers: {
        Accept: 'application/json',
      },
      auth: AUTH,
    })
    .then(({ body: lock }) =>
      cy.request({
        method: 'PATCH',
        url: `${API_PATH}/cypress/my-page`,
        headers: {
          Accept: 'application/json',
          'Lock-Token': lock.token,
        },
        auth: AUTH,
        body: {
          blocks,
          blocks_layout: {
            items: Object.keys(blocks),
          },
        },
      }),
    );

const visitPageView = () => {
  cy.visit('/cypress/my-page');
  cy.waitForResourceToLoad('my-page');
};

const isHydrationError = (message) =>
  message.includes('Hydration failed') ||
  message.includes('There was an error while hydrating');

Cypress.on('uncaught:exception', (error) => {
  if (isHydrationError(error.message)) {
    return false;
  }

  return undefined;
});

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

    cy.navigate('/cypress/my-page/edit');
    cy.get('.block.title h1').should('exist');
    cy.get('.block.slate').should('exist');
    cy.get('#toolbar-save').click();
    cy.url().should('include', '/cypress/my-page');
  });

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
    cy.get('.footnotes-listing-block ol')
      .children()
      .first()
      .contains('a');
    cy.get('.footnotes-listing-block ol')
      .children()
      .first()
      .contains('b');
  });
});
