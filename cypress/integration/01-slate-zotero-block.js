import { slateBeforeEach, slateAfterEach } from '../support';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Saving Zotero without selecting citation removes citation element', () => {
    // Enter text in slate field
    cy.getSlateEditorAndType('Luck is failure that failed.');

    // Zotero element select
    cy.setSlateSelection('Luck', 'failure');
    cy.clickSlateButton('Citation');

    // Zotero as slate element
    cy.get('.slate-editor.selected [contenteditable=true]').find(
      'span[id^="cite_ref"]',
    );

    // Save Zotero without citation
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(500)
      .click();

    // element is not slate Zotero
    cy.get('.slate-editor.selected [contenteditable=true]').not(
      'span[id^="cite_ref"]',
    );

    // Zotero element select
    cy.setSlateSelection('Luck', 'failure');
    cy.clickSlateButton('Citation');

    // Zotero as slate element
    cy.get('.slate-editor.selected [contenteditable=true]').find(
      'span[id^="cite_ref"]',
    );

    // Exit Zotero without citation
    cy.get(
      '.sidebar-container #zotero-comp .form .header button:nth-of-type(2)',
    )
      .wait(500)
      .click();

    // element is not slate Zotero
    cy.get('.slate-editor.selected [contenteditable=true]').not(
      'span[id^="cite_ref"]',
    );
  });

  it('Add Zotero citations', () => {
    // intercept the two items in the first collection
    cy.fixture('../fixtures/items.json').then((itemsResp) => {
      const { body, statusCode, headers } = itemsResp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/collections/24C33/items/?start=0&limit=10&sort=title',
        { body, statusCode, headers },
      ).as('itemsResp');
    });

    // intercept xml citation response for first item (citation)
    cy.fixture('../fixtures/item1.json').then((item1Resp) => {
      const { body, statusCode, headers } = item1Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/INFEDJ40?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item1Resp');
    });

    // intercept xml citation response for second item (citation)
    cy.fixture('../fixtures/item2.json').then((item2Resp) => {
      const { body, statusCode, headers } = item2Resp;

      cy.intercept(
        'GET',
        'https://api.zotero.org/users/6732/items/QHCG97BD?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
        { body, statusCode, headers },
      ).as('item2Resp');
    });

    // Complete chained commands
    cy.getSlateEditorAndType('Luck is failure that failed.');

    // Zotero
    cy.setSlateSelection('Luck', 'failure');
    cy.clickSlateButton('Citation');

    // select first Zotero collection
    cy.get('.pastanaga-menu-list ul>li button').first().click().wait(500);

    // select first item from the Zotero collection
    cy.get('.items.pastanaga-menu .pastanaga-menu-list ul li')
      .wait(500)
      .first()
      .click();

    // click preview button to get the citation
    cy.get('.ui.fluid.card .content .description button')
      .first()
      .click()
      .wait(500);

    // select second item from the Zotero collection
    cy.get('.items.pastanaga-menu .pastanaga-menu-list ul li')
      .wait(500)
      .first()
      .next()
      .click();

    // click preview button to get the citation
    cy.get('.ui.fluid.card .content .description button').first().click();

    // save Zotero citation
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(1500)
      .click();

    // element is Zotero element and multiple citations works
    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .should('have.attr', 'data-footnote-indice', '[1][2]');

    // add new Footnotes block
    cy.getSlateEditorAndType('{enter}');
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Text').click();
    cy.get('.content.active.text .button.slateFootnotes')
      .contains('Footnotes')
      .click();

    // Footnotes block contains one reference
    cy.get('.footnotes-listing-block ol').children().should('have.length', 2);

    // Zotero reference is cited multiple times
    cy.get('.content-area .slate-editor [contenteditable=true]')
      .first()
      .focus()
      .setSlateSelection('failed');
    cy.clickSlateButton('Citation');

    // select first Zotero collection
    cy.get('.pastanaga-menu-list ul>li button').wait(1000).first().click();

    // select first item from the Zotero collection
    cy.get('.items.pastanaga-menu .pastanaga-menu-list ul li')
      .wait(500)
      .first()
      .click();

    // click preview button to get the citation
    cy.get('.ui.fluid.card .content .description button').first().click();

    // save Zotero citation
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(1500)
      .click();

    // element is Zotero element and multiple citations works
    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .eq(1)
      .should('have.attr', 'data-footnote-indice', '[1]');

    // In Footnotes block first reference has "a,b" to link to citing elements
    cy.get('.footnotes-listing-block ol')
      .children()
      .first()
      .find('sup')
      .contains('a');
    cy.get('.footnotes-listing-block ol')
      .children()
      .first()
      .find('sup')
      .eq(1)
      .contains('b');

    // Delete citation from multiple set
    cy.get('.slate-editor.selected [contenteditable=true]')
      .find('span[id^="cite_ref"]')
      .first()
      .click();
    cy.get('.slate-inline-toolbar.slate-toolbar')
      .find('a[title^="Edit citation"]')
      .click();

    cy.get(
      '#blockform-fieldset-default .slate-toolbar .ui.fluid.card .content .description .list .item',
    )
      .first()
      .find('a')
      .click();

    // save Zotero citation
    cy.get('.sidebar-container #zotero-comp .form .header button:first-of-type')
      .wait(1500)
      .click();

    // Footnotes block contains one reference
    cy.get('.footnotes-listing-block ol').children().should('have.length', 2);

    // In Footnotes block first reference has "a,b" to link to citing elements
    cy.get('.footnotes-listing-block ol')
      .click()
      .children()
      .first()
      .find('sup')
      .should('have.length', 1)
      .contains('↵');

    // Configure block
    cy.get('[id=sidebar-properties] [name=title]').click().type('Footnotes');
    cy.get('[id=sidebar-properties] label[for=field-global]').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.get('span.citation-item').first().contains('Luck is failure');
    cy.contains('Luck is failure that failed.');
  });
});
