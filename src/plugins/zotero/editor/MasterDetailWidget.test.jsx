import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MasterDetailWidget from './MasterDetailWidget';
import '@testing-library/jest-dom/extend-expect';

describe('MasterDetailWidget', () => {
  let props;

  beforeEach(() => {
    props = {
      loading: false,
      collections: [{ data: { name: 'Collection 1' } }],
      items: [
        { citationTitle: 'Item 1', data: {}, meta: { numCollections: 1 } },
      ],
      zoteroSearchItemsTotalResultsNumber: 10,
      openAireTotalResultsNumber: 5,
      allSearchResults: [],
      zoteroSearchResults: [],
      openAireSearchResults: [],
      showCollections: jest.fn(),
      pull: jest.fn(),
      pushCollection: jest.fn(),
      pushSearchItem: jest.fn(),
      pushItem: jest.fn(),
      onChangeSearchTerm: jest.fn(),
      setActiveTabIndex: jest.fn(),
      openAireCallback: jest.fn(),
      showSearchResults: false,
    };
  });

  it('should render without crashing', () => {
    render(<MasterDetailWidget {...props} />);
    expect(screen.getByText('Show Library')).toBeInTheDocument();
  });

  it('should not crashl showCollections when "Show Library" button is clicked', () => {
    render(<MasterDetailWidget {...props} />);
    fireEvent.click(screen.getByText('Show Library'));
    expect(props.showCollections).toHaveBeenCalled();
  });

  it('should not crash when "Back to library" button is clicked', () => {
    render(<MasterDetailWidget {...props} />);
    fireEvent.click(screen.getByText('Back to library'));
  });

  it('should not crash when a collection is clicked', () => {
    render(<MasterDetailWidget {...props} />);
    fireEvent.click(screen.getByText('Collection 1'));
  });

  it('should hide collections when showSearchResults is true', () => {
    const { queryByText } = render(
      <MasterDetailWidget {...props} showSearchResults={true} />,
    );
    expect(queryByText('Collection 1')).not.toBeInTheDocument();
  });

  it('should hide collections when loading is true', () => {
    const { queryByText } = render(
      <MasterDetailWidget {...props} loading={true} />,
    );
    expect(queryByText('Collection 1')).not.toBeInTheDocument();
  });

  it('should handle click events in All search results tab', () => {
    const { container } = render(
      <MasterDetailWidget
        {...props}
        allSearchResults={[
          {
            label: 'publications',
            icon: 'file',
            citationTitle: 'Citation Title 1',
            data: {
              itemType: 'Exemple Type',
              date: '2021-01-01',
            },
          },
          {
            label: 'publications',
            icon: undefined,
          },
          {
            label: undefined,
            icon: undefined,
          },
        ]}
        openAireSearchResults={[
          {
            label: 'publications',
            icon: 'file',
            citationTitle: 'Citation Title 1',
            data: {
              itemType: 'Exemple Type',
              date: '2021-01-01',
            },
          },
          {
            label: 'publications',
            icon: undefined,
          },
          {
            label: undefined,
            icon: undefined,
          },
        ]}
        showSearchResults={true}
      />,
    );
    fireEvent.click(screen.getByText('Citation Title 1'));
    fireEvent.click(screen.getByText('preview'));

    const openAireTab = screen.getByText('OpenAire');
    fireEvent.click(openAireTab);
    fireEvent.click(screen.getByText('Publications'));
    fireEvent.click(screen.getByText('Research Data'));
    fireEvent.click(container.querySelector('.list-button-md'));
  });

  it('should handle click events in Zotero search results tab', () => {
    const { container } = render(
      <MasterDetailWidget
        {...props}
        allSearchResults={[
          {
            label: 'publications',
            icon: 'file',
            citationTitle: 'Citation Title 1',
            data: {
              itemType: 'Exemple Type',
              date: '2021-01-01',
            },
          },
          {
            label: 'publications',
            icon: undefined,
          },
          {
            label: undefined,
            icon: undefined,
          },
        ]}
        zoteroSearchResults={[
          {
            label: 'publications',
            icon: 'file',
            citationTitle: 'Citation Title 1',
            data: {
              itemType: 'Exemple Type',
              date: '2021-01-01',
            },
          },
          {
            label: 'publications',
            icon: undefined,
          },
          {
            label: undefined,
            icon: undefined,
          },
        ]}
        showSearchResults={true}
      />,
    );
    fireEvent.click(screen.getByText('Citation Title 1'));
    fireEvent.click(screen.getByText('preview'));
    const zoteroTab = screen.getByText('Zotero');
    fireEvent.click(zoteroTab);
    fireEvent.click(container.querySelector('.list-button-md'));
    fireEvent.click(screen.getByText('Item 1'));
  });

  it('should update OpenAire filter list when OpenAire filter button is clicked', () => {
    render(
      <MasterDetailWidget
        {...props}
        allSearchResults={[
          {
            label: 'publications',
            icon: 'file',
            citationTitle: 'Citation Title 1',
            data: {
              itemType: 'Exemple Type',
              date: '2021-01-01',
            },
          },
          {
            label: 'publications',
            icon: undefined,
          },
          {
            label: undefined,
            icon: undefined,
          },
        ]}
        showSearchResults={true}
      />,
    );

    // Find the OpenAire "Publications" button and click it
    const openAireTab = screen.getByText('OpenAire');
    fireEvent.click(openAireTab);
    fireEvent.click(screen.getByText('Publications'));
    const publicationsButton = screen.getByText('Publications');
    fireEvent.click(publicationsButton);

    // Click the button again to remove 'publications' from the list
    fireEvent.click(publicationsButton);
  });

  it('should handle click and change events in the component', () => {
    const { container } = render(
      <MasterDetailWidget
        {...props}
        allSearchResults={[
          {
            label: 'publications',
            icon: 'file',
            citationTitle: 'Citation Title 1',
            data: {
              itemType: 'Exemple Type',
              date: '2021-01-01',
            },
          },
          {
            label: 'publications',
            icon: undefined,
          },
          {
            label: undefined,
            icon: undefined,
          },
        ]}
        zoteroSearchResults={[
          {
            label: 'publications',
            icon: 'file',
            citationTitle: 'Citation Title 1',
            data: {
              itemType: 'Exemple Type',
              date: '2021-01-01',
            },
          },
          {
            label: 'publications',
            icon: undefined,
          },
          {
            label: undefined,
            icon: undefined,
          },
        ]}
        showSearchResults={true}
        // items={[
        //   {
        //     citationTitle: 'Item 1',
        //     data: {
        //       creators: [
        //         {
        //           firstName: 'First Name 1',
        //           lastName: 'Last Name 1',
        //         },
        //       ],
        //     },
        //     meta: { numCollections: undefined },
        //   },
        // ]}
      />,
    );
    fireEvent.click(screen.getByText('Citation Title 1'));
    fireEvent.click(screen.getByText('preview'));
    const zoteroTab = screen.getByText('Zotero');
    fireEvent.click(zoteroTab);
    fireEvent.click(container.querySelector('.list-button-md'));
    fireEvent.click(screen.getByText('Item 1'));

    fireEvent.click(
      container.querySelector('.ui.card .content .description button.twitter'),
    );

    fireEvent.click(
      container.querySelector(
        '.pusher-puller .header.pulled .action.input button',
      ),
    );
    fireEvent.change(
      container.querySelector('.pusher-puller .header.pulled input'),
      {
        target: { value: 'test' },
      },
    );
    fireEvent.click(
      container.querySelector('.items.pastanaga-menu .header.pulled button'),
    );
    fireEvent.keyPress(
      container.querySelector('.pusher-puller .header.pulled input'),
      {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        charCode: 27,
      },
    );
    fireEvent.click(
      container.querySelector('.items.pastanaga-menu .header.pulled button'),
    );
    fireEvent.keyPress(
      container.querySelector('.pusher-puller .header.pulled input'),
      { key: 'Enter', code: 'Enter', charCode: 13 },
    );
  });

  it('should render no author name when there are no creators', () => {
    const { container } = render(
      <MasterDetailWidget
        {...props}
        showSearchResults={true}
        items={[
          {
            citationTitle: 'Item 1',
            data: {
              creators: [],
            },
            meta: { numCollections: undefined },
          },
        ]}
      />,
    );

    const zoteroTab = screen.getByText('Zotero');
    fireEvent.click(zoteroTab);
    fireEvent.click(container.querySelector('.list-button-md'));
    expect(screen.getByText('Author:')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Item 1'));
  });

  it('handles render creator name when creators only have name property', () => {
    const { container } = render(
      <MasterDetailWidget
        {...props}
        showSearchResults={true}
        items={[
          {
            citationTitle: 'Item 1',
            data: {
              creators: [
                {
                  name: 'Creator 1',
                },
              ],
            },
            meta: { numCollections: undefined },
          },
        ]}
      />,
    );

    const zoteroTab = screen.getByText('Zotero');
    fireEvent.click(zoteroTab);
    fireEvent.click(container.querySelector('.list-button-md'));
    expect(screen.getByText('Author: Creator 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Item 1'));
  });

  it('handles render creator name when creators have firstName and lastName properties', () => {
    const { container } = render(
      <MasterDetailWidget
        {...props}
        showSearchResults={true}
        items={[
          {
            citationTitle: 'Item 1',
            data: {
              creators: [
                {
                  firstName: 'First Name 1',
                  lastName: 'Last Name 1',
                },
              ],
            },
            meta: { numCollections: undefined },
          },
        ]}
      />,
    );

    const zoteroTab = screen.getByText('Zotero');
    fireEvent.click(zoteroTab);
    fireEvent.click(container.querySelector('.list-button-md'));
    expect(
      screen.getByText('Author: First Name 1 Last Name 1'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Item 1'));
  });

  it('should render no author name when the creator property does not exist', () => {
    const { container } = render(
      <MasterDetailWidget
        {...props}
        showSearchResults={true}
        items={[
          {
            citationTitle: 'Item 1',
            data: {
              creators: undefined,
            },
            meta: { numCollections: undefined },
          },
        ]}
      />,
    );

    const zoteroTab = screen.getByText('Zotero');
    fireEvent.click(zoteroTab);
    fireEvent.click(container.querySelector('.list-button-md'));
    expect(screen.getByText('Author:')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Item 1'));
  });

  it('should render a placeholder string when there are no items', () => {
    render(
      <MasterDetailWidget {...props} showSearchResults={true} items={[]} />,
    );

    expect(
      screen.getAllByText('No results, try one of the following:'),
    ).not.toBeNull();
  });
});
