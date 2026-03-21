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

const visitPageEdit = () => {
  cy.navigate('/cypress/my-page/edit');
  cy.get('.block.title h1').should('exist');
};

const openZoteroSidebarForSelection = (anchor, focus = anchor) => {
  cy.setSlateSelection(anchor, focus);
  cy.clickSlateButton('Citation');
  cy.openSlateContextSidebar({
    sidebarSelector: '#zotero-comp',
  });
  cy.get('#zotero-comp .collections.pastanaga-menu', {
    timeout: 10000,
  }).should('exist');
};

const saveZoteroSidebar = () => {
  cy.saveSidebarPopup('#zotero-comp');
};

const cancelZoteroSidebar = () => {
  cy.cancelSidebarPopup('#zotero-comp');
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

    visitPageEdit();
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
    cy.get('.footnotes-listing-block ol').children().first().contains('a');
    cy.get('.footnotes-listing-block ol').children().first().contains('b');
  });

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
    cy.get('#zotero-comp .pastanaga-menu-list ul>li button', {
      timeout: 10000,
    })
      .first()
      .click();

    cy.wait('@itemsResp');
    cy.get('#zotero-comp .items.pastanaga-menu .pastanaga-menu-list ul li')
      .first()
      .click();
    cy.get('#zotero-comp .ui.fluid.card .content .description button')
      .first()
      .click();
    cy.wait('@item1Resp');

    cy.get('#zotero-comp .items.pastanaga-menu .pastanaga-menu-list ul li')
      .eq(1)
      .click();
    cy.get('#zotero-comp .ui.fluid.card .content .description button')
      .first()
      .click();
    cy.wait('@item2Resp');

    saveZoteroSidebar();

    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .first()
      .should('have.attr', 'data-footnote-indice', '[1][2]');

    openZoteroSidebarForSelection('failed');
    cy.get('#zotero-comp .pastanaga-menu-list ul>li button', {
      timeout: 10000,
    })
      .first()
      .click();

    cy.wait('@itemsResp');
    cy.get('#zotero-comp .items.pastanaga-menu .pastanaga-menu-list ul li')
      .first()
      .click();
    cy.get('#zotero-comp .ui.fluid.card .content .description button')
      .first()
      .click();
    cy.wait('@item1Resp');

    saveZoteroSidebar();

    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .eq(1)
      .should('have.attr', 'data-footnote-indice', '[1]');
  });

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
    cy.get('#zotero-comp .pastanaga-menu-list ul>li button', {
      timeout: 10000,
    })
      .eq(2)
      .click();

    cy.wait('@subCollections');
    cy.wait('@items3');
    cy.get(
      '#zotero-comp .items.pastanaga-menu .pastanaga-menu-list ul>li button',
      { timeout: 10000 },
    )
      .first()
      .click();

    cy.wait('@items2');
    cy.get('#zotero-comp .items.pastanaga-menu .pastanaga-menu-list ul li')
      .first()
      .click();
    cy.get('#zotero-comp .ui.fluid.card .content .description button')
      .first()
      .click();
    cy.wait('@item3Resp');

    saveZoteroSidebar();

    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('have.attr', 'data-footnote-indice', '[1]');
  });

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
    cy.get('#zotero-comp .collections.pastanaga-menu input')
      .clear()
      .type('forest');
    cy.get(
      '#zotero-comp .collections.pastanaga-menu header .ui.fluid.action.icon.input button',
    ).click();

    cy.wait('@zoteroSearchResp');
    cy.wait('@openaireSearchResultsPubAuthor');
    cy.wait('@openaireSearchResultsPubTitle');
    cy.wait('@openaireSearchResultsRsdAuthor');
    cy.wait('@openaireSearchResultsRsdTitle');

    cy.contains('#zotero-comp .menu .item', 'OpenAire').click();
    cy.get(
      '#zotero-comp .collections.pastanaga-menu .ui.tab.active button.list-button-md',
      {
        timeout: 10000,
      },
    )
      .should('have.length.at.least', 1)
      .first()
      .click();
    cy.get(
      '#zotero-comp .collections.pastanaga-menu .ui.tab.active .ui.fluid.card .content .description button',
      {
        timeout: 10000,
      },
    )
      .first()
      .click();

    saveZoteroSidebar();

    cy.wait('@saveItemResponse');
    cy.wait('@item4Resp');
    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('have.attr', 'data-footnote-indice', '[1]');
  });
});
