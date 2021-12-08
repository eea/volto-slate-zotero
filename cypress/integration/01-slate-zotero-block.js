import { slateBeforeEach, slateAfterEach } from '../support';

describe('Slate citations', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Saving Zotero without selecting citation removes citation element', () => {
    // intercept requests to simulate response and not use real credentials
    cy.intercept('GET', '**/@zotero', {
      statusCode: 200,
      body: {
        default: 'NH578GBA',
        password: 'test',
        server: 'https://api.zotero.org/users/6732',
        style: 'https://www.eea.europa.eu/zotero/eea.csl',
      },
    });

    cy.intercept(
      'GET',
      'https://api.zotero.org/users/6732/collections/top/?start=0&limit=10&sort=title',
      {
        statusCode: 200,
        headers: {
          'Total-Results': '14',
        },
        body: [
          {
            key: '24C33',
            version: 145,
            data: {
              key: '24C33',
              version: 145,
              name: '2009',
              parentCollection: false,
              relations: {},
            },
            library: {
              type: 'user',
              id: 6732,
              name: 'rexalexmede',
              links: {
                alternate: {
                  href: 'https://www.zotero.org/rexalexmede',
                  type: 'text/html',
                },
              },
              self: {
                href: 'https://api.zotero.org/users/6732/collections/24C33',
                type: 'application/json',
              },
            },
            meta: { numCollections: 0, numItems: 2 },
          },
          {
            key: 'DH68XG',
            version: 144,
            library: {
              type: 'user',
              id: 6732,
              name: 'rexalexmede',
              links: {
                alternate: {
                  href: 'https://www.zotero.org/rexalexmede',
                  type: 'text/html',
                },
              },
            },
            links: {
              self: {
                href: 'https://api.zotero.org/users/6732/collections/DH68XG',
                type: 'application/json',
              },
              alternate: {
                href: 'https://www.zotero.org/rexalexmede/collections/DH68XG',
                type: 'text/html',
              },
            },
            meta: {
              numCollections: 0,
              numItems: 1,
            },
            data: {
              key: 'DH68XG',
              version: 144,
              name: '2010',
              parentCollection: false,
              relations: {},
            },
          },
        ],
      },
    );

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
    // intercept requests to simulate response and not use real credentials
    cy.intercept('GET', '**/@zotero', {
      statusCode: 200,
      body: {
        default: 'NH578GBA',
        password: 'test',
        server: 'https://api.zotero.org/users/6732',
        style: 'https://www.eea.europa.eu/zotero/eea.csl',
      },
    });
    // the top two collections
    cy.intercept(
      'GET',
      'https://api.zotero.org/users/6732/collections/top/?start=0&limit=10&sort=title',
      {
        statusCode: 200,
        headers: {
          'Total-Results': '14',
        },
        body: [
          {
            key: '24C33',
            version: 145,
            data: {
              key: '24C33',
              version: 145,
              name: '2009',
              parentCollection: false,
              relations: {},
            },
            library: {
              type: 'user',
              id: 6732,
              name: 'rexalexmede',
              links: {
                alternate: {
                  href: 'https://www.zotero.org/rexalexmede',
                  type: 'text/html',
                },
              },
              self: {
                href: 'https://api.zotero.org/users/6732/collections/24C33',
                type: 'application/json',
              },
            },
            meta: { numCollections: 0, numItems: 2 },
          },
          {
            key: 'DH68XG',
            version: 144,
            library: {
              type: 'user',
              id: 6732,
              name: 'rexalexmede',
              links: {
                alternate: {
                  href: 'https://www.zotero.org/rexalexmede',
                  type: 'text/html',
                },
              },
            },
            links: {
              self: {
                href: 'https://api.zotero.org/users/6732/collections/DH68XG',
                type: 'application/json',
              },
              alternate: {
                href: 'https://www.zotero.org/rexalexmede/collections/DH68XG',
                type: 'text/html',
              },
            },
            meta: {
              numCollections: 0,
              numItems: 1,
            },
            data: {
              key: 'DH68XG',
              version: 144,
              name: '2010',
              parentCollection: false,
              relations: {},
            },
          },
        ],
      },
    );
    // the two items in the first collection
    cy.intercept(
      'GET',
      'https://api.zotero.org/users/6732/collections/24C33/items/?start=0&limit=10&sort=title',
      {
        statusCode: 200,
        headers: {
          'Total-Results': '14',
        },
        body: [
          {
            key: 'INFEDJ40',
            version: 184,
            library: {
              type: 'user',
              id: 6732,
              name: 'rexalexmede',
              links: {
                alternate: {
                  href: 'https://www.zotero.org/rexalexmede',
                  type: 'text/html',
                },
              },
            },
            links: {
              self: {
                href: 'https://api.zotero.org/users/6732/items/INFEDJ40',
                type: 'application/json',
              },
              alternate: {
                href: 'https://www.zotero.org/rexalexmede/items/INFEDJ40',
                type: 'text/html',
              },
            },
            meta: {
              creatorSummary: 'Alexandru',
              numChildren: 0,
            },
            data: {
              key: 'INFEDJ40',
              version: 184,
              itemType: 'journalArticle',
              title: 'Coffee rating',
              creators: [
                {
                  creatorType: 'author',
                  firstName: 'Medesan',
                  lastName: 'Alexandru',
                },
              ],
              abstractNote: '',
              publicationTitle: '',
              volume: '',
              issue: '',
              pages: '',
              date: '',
              series: '',
              seriesTitle: '',
              seriesText: '',
              journalAbbreviation: '',
              language: '',
              DOI: '',
              ISSN: '',
              shortTitle: '',
              url: 'www.inventedTitle.com',
              accessDate: '',
              archive: '',
              archiveLocation: '',
              libraryCatalog: '',
              callNumber: '',
              rights: '',
              extra: '',
              tags: [],
              collections: ['83VH3', 'BGJV5', '24C33'],
              relations: {},
              dateAdded: '2020-07-07T06:15:29Z',
              dateModified: '2020-07-07T06:17:27Z',
            },
          },
          {
            key: 'QHCG97BD',
            version: 185,
            library: {
              type: 'user',
              id: 6732,
              name: 'rexalexmede',
              links: {
                alternate: {
                  href: 'https://www.zotero.org/rexalexmede',
                  type: 'text/html',
                },
              },
            },
            links: {
              self: {
                href: 'https://api.zotero.org/users/6732/items/QHCG97BD',
                type: 'application/json',
              },
              alternate: {
                href: 'https://www.zotero.org/rexalexmede/items/QHCG97BD',
                type: 'text/html',
              },
            },
            meta: {
              numChildren: 0,
            },
            data: {
              key: 'QHCG97BD',
              version: 185,
              itemType: 'journalArticle',
              title: 'Tea Rating',
              creators: [],
              abstractNote: '',
              publicationTitle: 'Comcast',
              volume: '',
              issue: '',
              pages: '',
              date: '',
              series: '',
              seriesTitle: '',
              seriesText: '',
              journalAbbreviation: '',
              language: '',
              DOI: '',
              ISSN: '',
              shortTitle: '',
              url: '',
              accessDate: '',
              archive: '',
              archiveLocation: '',
              libraryCatalog: '',
              callNumber: '',
              rights: '',
              extra: '',
              tags: [],
              collections: ['83VH3S', '24C33'],
              relations: {},
              dateAdded: '2020-10-12T11:40:56Z',
              dateModified: '2020-10-12T11:41:09Z',
            },
          },
        ],
      },
    );

    // xml citation response
    cy.intercept(
      'GET',
      'https://api.zotero.org/users/6732/items/INFEDJ40?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
      {
        statusCode: 200,
        body: `<?xml version="1.0"?>
          <div class="csl-bib-body" style="line-height: 1.35; ">
            <div class="csl-entry">Alexandru, M., 'Coffee rating', (www.inventedTitle.com).</div>
          </div>
        `,
      },
    );

    // xml citation response
    cy.intercept(
      'GET',
      'https://api.zotero.org/users/6732/items/QHCG97BD?format=bib&style=https://www.eea.europa.eu/zotero/eea.csl',
      {
        statusCode: 200,
        body: `<?xml version="1.0"?>
          <div class="csl-bib-body" style="line-height: 1.35; ">
            <div class="csl-entry">Tea Rating,</div>
          </div>
        `,
      },
    );

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
