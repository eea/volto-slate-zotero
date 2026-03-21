const API_PATH = Cypress.env('API_PATH') || 'http://localhost:8080/Plone';
const AUTH = {
  user: 'admin',
  pass: 'admin',
};

const TOP_COLLECTION_BUTTONS_SELECTOR =
  '#zotero-comp .collections.pastanaga-menu .pastanaga-menu-list ul > li button.list-button-md';
const LIBRARY_ITEM_BUTTONS_SELECTOR =
  '#zotero-comp .items.pastanaga-menu .pastanaga-menu-list ul > li button.list-button-md';
const LIBRARY_PREVIEW_BUTTONS_SELECTOR =
  '#zotero-comp .items.pastanaga-menu .ui.fluid.card .content .description button';
const OPENAIRE_RESULT_BUTTONS_SELECTOR =
  '#zotero-comp .collections.pastanaga-menu .ui.tab.active button.list-button-md';
const OPENAIRE_PREVIEW_BUTTONS_SELECTOR =
  '#zotero-comp .collections.pastanaga-menu .ui.tab.active .ui.fluid.card .content .description button';

export const buildZoteroNode = ({
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

export const buildSlateBlock = ({ before = '', node = null, after = '' }) => ({
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

export const setZoteroBlocks = ({ blocks }) =>
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

export const visitPageView = () => {
  cy.visit('/cypress/my-page');
  cy.waitForResourceToLoad('my-page');
};

export const visitPageEdit = () => {
  cy.navigate('/cypress/my-page/edit');
  cy.get('.block.title h1').should('exist');
};

export const openZoteroSidebarForSelection = (anchor, focus = anchor) => {
  const citationButtonSelector =
    '.slate-inline-toolbar .button-wrapper a[title="Citation"]';

  cy.get('.slate-editor.selected [contenteditable=true]').should(
    'contain.text',
    anchor,
  );
  cy.setSlateSelection(anchor, focus);
  cy.get('body').then(($body) => {
    if ($body.find(citationButtonSelector).length > 0) {
      return;
    }

    cy.get('.slate-editor.selected [contenteditable=true]').click({
      force: true,
    });
    cy.setSlateSelection(anchor, focus, undefined, 2000);
  });
  cy.clickSlateButton('Citation');
  cy.openSlateContextSidebar({
    sidebarSelector: '#zotero-comp',
  });
  cy.get('#zotero-comp .collections.pastanaga-menu', {
    timeout: 10000,
  }).should('be.visible');
  cy.get(TOP_COLLECTION_BUTTONS_SELECTOR, {
    timeout: 10000,
  }).should('have.length.at.least', 1);
};

export const saveZoteroSidebar = () => {
  cy.saveSidebarPopup('#zotero-comp');
};

export const cancelZoteroSidebar = () => {
  cy.cancelSidebarPopup('#zotero-comp');
};

export const openTopCollection = (index = 0) => {
  cy.get(TOP_COLLECTION_BUTTONS_SELECTOR, {
    timeout: 10000,
  })
    .eq(index)
    .should('be.visible')
    .click();
};

export const openLibraryItem = (index = 0) => {
  cy.get(LIBRARY_ITEM_BUTTONS_SELECTOR, {
    timeout: 10000,
  })
    .eq(index)
    .should('be.visible')
    .click();
};

export const openLibraryItemByText = (text) => {
  cy.contains(LIBRARY_ITEM_BUTTONS_SELECTOR, text, {
    timeout: 10000,
  })
    .should('be.visible')
    .click();
};

export const previewActiveLibraryItem = () => {
  cy.get(LIBRARY_PREVIEW_BUTTONS_SELECTOR, {
    timeout: 10000,
  })
    .first()
    .should('be.visible')
    .click();
};

export const waitForSidebarCitationCount = (count) => {
  cy.get('#blockform-fieldset-default .button-wrapper .item', {
    timeout: 10000,
  }).should('have.length', count);
  cy.get('#zotero-comp .form > .header.pulled .ui.loader').should('not.exist');
};

export const searchZoteroLibrary = (term) => {
  cy.get('#zotero-comp .collections.pastanaga-menu input', {
    timeout: 10000,
  })
    .should('be.visible')
    .clear()
    .type(term);
  cy.get(
    '#zotero-comp .collections.pastanaga-menu header .ui.fluid.action.icon.input button',
  )
    .should('be.visible')
    .click();
};

export const openOpenAireTab = () => {
  cy.contains('#zotero-comp .menu .item', 'OpenAire', {
    timeout: 10000,
  })
    .should('be.visible')
    .click()
    .should('have.class', 'active');
};

export const openOpenAireResult = (index = 0) => {
  cy.get(OPENAIRE_RESULT_BUTTONS_SELECTOR, {
    timeout: 10000,
  })
    .eq(index)
    .should('be.visible')
    .click();
};

export const previewActiveOpenAireResult = () => {
  cy.get(OPENAIRE_PREVIEW_BUTTONS_SELECTOR, {
    timeout: 10000,
  })
    .first()
    .should('be.visible')
    .click();
};
