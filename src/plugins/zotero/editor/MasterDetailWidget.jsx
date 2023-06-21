import { Icon } from '@plone/volto/components';
import backSVG from '@plone/volto/icons/back.svg';
import rightArrowSVG from '@plone/volto/icons/right-key.svg';
import React, { useState } from 'react';
import {
  Button,
  Card,
  Image,
  Input,
  Label,
  Loader,
  Menu,
  Tab,
} from 'semantic-ui-react';
import openairePNG from '../images/openaire.png';
import zoteroSVG from '../images/zotero.svg';

const iconsObj = {
  zotero: zoteroSVG,
  openaire: openairePNG,
};
const labelObj = {
  publications: {
    name: 'Pub',
    color: 'teal',
  },
  rsd: {
    name: 'Data',
    color: 'pink',
  },
};

const makeList = (props, resultsType, handleClick, activeIndex) => {
  if (props.loading) return null;

  return (
    <ul>
      {!props.loading &&
        (props[resultsType].length > 0 ? (
          props[resultsType].map((item, index) => (
            <li key={`result-${item.label}-${index}`}>
              <div className="li-item">
                <Image
                  avatar
                  src={item.icon ? iconsObj[item.icon] : iconsObj.zotero}
                />
                {item.label ? (
                  <Label color={labelObj[item.label].color} horizontal>
                    {labelObj[item.label].name}
                  </Label>
                ) : null}

                <button
                  className="list-button-md"
                  onClick={(ev) => {
                    handleClick(index);
                    ev.preventDefault();
                  }}
                >
                  {item.citationTitle}
                </button>
              </div>
              {activeIndex === index ? (
                <Card fluid>
                  <Card.Content>
                    <Card.Description>
                      {item?.data?.title?.slice(0, 50) || ''}
                      <Button
                        circular
                        color="twitter"
                        size="mini"
                        floated="right"
                        onClick={(ev) => props.pushSearchItem(item)}
                      >
                        preview
                      </Button>
                    </Card.Description>
                    <Card.Meta>
                      <span className="result-type-orange">publication</span>
                      <span className="result-type"> . </span>
                      <span className="result-type">
                        {' '}
                        {item.data.itemType} . {item.data.date}{' '}
                      </span>
                    </Card.Meta>
                    <Card.Meta>
                      <span>
                        Author: {item?.data?.creators?.[0]?.firstName}{' '}
                        {item?.data?.creators?.[0]?.lastName}{' '}
                      </span>
                    </Card.Meta>
                    <Card.Description>
                      <a
                        href={`https://dx.doi.org/${item.data.DOI}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        DOI: {item.data.DOI}
                      </a>
                    </Card.Description>
                    <Card.Description>ISBN: {item.data.ISBN}</Card.Description>
                    <Card.Description>
                      Publisher: {item.data.publicationTitle}
                    </Card.Description>
                  </Card.Content>
                </Card>
              ) : null}
            </li>
          ))
        ) : (
          <li>
            <p>No results, try one of the following:</p>
            <p> * Reduce the number of words in the search</p>
            <p>
              {' '}
              * Use the DOI if you know it (you may find the DOI via a Google
              search)
            </p>
            <p> * Make sure there is no misspelling</p>
            <p>
              {' '}
              * Browse the Zotero library manually If none of the above works,
              then you have to add a new record in the Zotero library and after
              that come back here to search again.
            </p>
          </li>
        ))}
    </ul>
  );
};

let openAireFilterList = ['publications', 'rsd'];

const makeOpenAireFilterList = (item) => {
  const itemIndex = openAireFilterList.indexOf(item);
  const itemFound = itemIndex > -1;

  if (!itemFound) {
    openAireFilterList.push(item);
  } else {
    openAireFilterList.splice(itemIndex, 1);
  }
};

const panes = (
  props,
  handleAllIndexClick,
  handleZoteroIndexClick,
  handleOpenAireIndexClick,
  listAllIndex,
  listZoteroIndex,
  listOpenAireIndex,
) => [
  {
    menuItem: (
      <Menu.Item key="all-tab">
        All
        <Label>
          {props.zoteroSearchItemsTotalResultsNumber +
            props.openAireTotalResultsNumber}
        </Label>
      </Menu.Item>
    ),
    render: () => (
      <Tab.Pane>
        {makeList(props, 'allSearchResults', handleAllIndexClick, listAllIndex)}
      </Tab.Pane>
    ),
  },
  {
    menuItem: (
      <Menu.Item key="zotero-tab">
        Zotero
        <Label>
          {props.zoteroSearchLoading ? (
            <Loader active inline size="mini" />
          ) : (
            <>{props.zoteroSearchItemsTotalResultsNumber}</>
          )}
        </Label>
      </Menu.Item>
    ),
    render: () => (
      <Tab.Pane>
        {makeList(
          props,
          'zoteroSearchResults',
          handleZoteroIndexClick,
          listZoteroIndex,
        )}
      </Tab.Pane>
    ),
  },
  {
    menuItem: (
      <Menu.Item key="openaire-tab">
        OpenAire<Label>{props.openAireTotalResultsNumber}</Label>
      </Menu.Item>
    ),
    render: () => (
      <Tab.Pane>
        <Button.Group size="small">
          <Button
            primary={openAireFilterList.indexOf('publications') > -1}
            secondary={openAireFilterList.indexOf('publications') < 0}
            onClick={(ev) => {
              ev.preventDefault();
              makeOpenAireFilterList('publications');
              props.openAireCallback(openAireFilterList);
            }}
          >
            Publications
          </Button>
          <Button
            primary={openAireFilterList.indexOf('rsd') > -1}
            secondary={openAireFilterList.indexOf('rsd') < 0}
            onClick={(ev) => {
              ev.preventDefault();
              makeOpenAireFilterList('rsd');
              props.openAireCallback(openAireFilterList);
            }}
          >
            Research Data
          </Button>
        </Button.Group>
        {makeList(
          props,
          'openAireSearchResults',
          handleOpenAireIndexClick,
          listOpenAireIndex,
        )}
      </Tab.Pane>
    ),
  },
];

const MasterDetailWidget = (props) => {
  const [hideCollection, setHideCollection] = useState(false);
  const [moveMenu, setMoveMenu] = useState(0);
  const [searchTerm, setSearchTerm] = useState(null);
  const [listItemIndex, setListItemIndex] = useState(-1);
  const [listAllIndex, setAllListIndex] = useState(-1);
  const [listZoteroIndex, setZoteroListIndex] = useState(-1);
  const [listOpenAireIndex, setListOpenAireIndex] = useState(-1);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAllIndexClick = (index) => {
    const newIndex = listAllIndex === index ? -1 : index;
    setAllListIndex(newIndex);
  };
  const handleTabChange = (e, { activeIndex }) => {
    props.setActiveTabIndex(activeIndex);
    setActiveIndex(activeIndex);
  };

  const handleZoteroIndexClick = (index) => {
    const newIndex = listZoteroIndex === index ? -1 : index;
    setZoteroListIndex(newIndex);
  };

  const handleOpenAireIndexClick = (index) => {
    const newIndex = listOpenAireIndex === index ? -1 : index;
    setListOpenAireIndex(newIndex);
  };

  const handleItemIndexClick = (index) => {
    const newIndex = listItemIndex === index ? -1 : index;
    setListItemIndex(newIndex);
  };

  const pull = () => {
    setMoveMenu(0);
    setHideCollection(false);
    props.pull();
  };

  const onClick = () => {
    props.showCollections();
  };

  const pushCollection = (selectedCollection) => {
    setMoveMenu(-1);
    setHideCollection(true);
    setListItemIndex(-1);
    props.pushCollection(selectedCollection);
  };

  const handleInput = (ev) => {
    ev.preventDefault();
    props.onChangeSearchTerm(searchTerm);
  };

  const onChange = (ev) => {
    setSearchTerm(ev.target.value);
  };

  const onKeyPress = (ev, data) => {
    if (ev.key === 'Enter') handleInput(ev);
  };

  const collectionsList = () => (
    <ul>
      {!props.loading
        ? props.collections.map((collection, index) => (
            <li key={`collection-${index}`}>
              <button
                className="list-button-md"
                onClick={(ev) => {
                  ev.preventDefault();
                  return pushCollection(index);
                }}
              >
                {collection.data.name}
                <Icon name={rightArrowSVG} size="24px" />
              </button>
            </li>
          ))
        : null}
    </ul>
  );

  const itemsList = () => {
    if (props.loading) return null;

    return (
      <ul>
        {!props.loading &&
          (props.items.length > 0 ? (
            props.items.map((item, index) => (
              <li key={`item-${index}`}>
                <button
                  className="list-button-md"
                  onClick={(ev) => {
                    ev.preventDefault();
                    const callbackAction = isNaN(item.meta.numCollections)
                      ? handleItemIndexClick
                      : pushCollection;
                    callbackAction(index);
                  }}
                >
                  {item.citationTitle}
                  {isNaN(item.meta.numCollections) ? null : (
                    <Icon name={rightArrowSVG} size="24px" />
                  )}
                </button>

                {listItemIndex === index ? (
                  <Card fluid>
                    <Card.Content>
                      <Card.Description>
                        {item.data.title?.slice(0, 50) || ''}
                        <Button
                          circular
                          color="twitter"
                          size="mini"
                          floated="right"
                          onClick={(ev) => props.pushItem(item)}
                        >
                          preview
                        </Button>
                      </Card.Description>
                      <Card.Meta>
                        <span className="result-type-orange">publication</span>
                        <span className="result-type"> . </span>
                        <span className="result-type">
                          {' '}
                          {item.data?.itemType} . {item.data?.date}{' '}
                        </span>
                      </Card.Meta>
                      <Card.Meta>
                        <span>
                          Author:{' '}
                          {item.data.creators
                            ? item.data.creators[0]
                              ? item.data.creators[0].name
                                ? item.data.creators[0].name
                                : `${item.data.creators[0].firstName} ${item.data.creators[0]?.lastName}`
                              : null
                            : null}{' '}
                        </span>
                      </Card.Meta>
                      <Card.Description>
                        <a
                          href={`https://dx.doi.org/${item.data?.DOI}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          DOI: {item.data?.DOI}
                        </a>
                      </Card.Description>
                      <Card.Description>
                        ISBN: {item.data?.ISBN}
                      </Card.Description>
                      <Card.Description>
                        Publisher: {item.data?.publicationTitle}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                ) : null}
              </li>
            ))
          ) : (
            <li>
              <p>No results, try one of the following:</p>
              <p> * Reduce the number of words in the search</p>
              <p>
                {' '}
                * Use the DOI if you know it (you may find the DOI via a Google
                search)
              </p>
              <p> * Make sure there is no misspelling</p>
              <p>
                {' '}
                * Browse the Zotero library manually If none of the above works,
                then you have to add a new record in the Zotero library and
                after that come back here to search again.
              </p>
            </li>
          ))}
      </ul>
    );
  };

  const searchResultsList = () => (
    <Tab
      activeIndex={activeIndex}
      onTabChange={handleTabChange}
      panes={panes(
        props,
        handleAllIndexClick,
        handleZoteroIndexClick,
        handleOpenAireIndexClick,
        listAllIndex,
        listZoteroIndex,
        listOpenAireIndex,
      )}
    />
  );

  const collectionsClass = hideCollection
    ? 'collections pastanaga-menu transition-hide'
    : 'collections pastanaga-menu transition-show';

  const loaderComp = (
    <div className="loader-relative">
      <Loader active size="small">
        Loading
      </Loader>
    </div>
  );

  return (
    <div id="master-detail">
      <div
        className="pusher-puller"
        style={{
          transform: `translateX(${moveMenu * 375}px)`,
        }}
      >
        <div className={collectionsClass}>
          <header className="header pulled">
            <Button onClick={onClick} primary={!!props.showSearchResults}>
              Show Library
            </Button>
            <Input
              fluid
              action={{ onClick: handleInput }}
              icon="search"
              placeholder="Search..."
              onKeyPress={onKeyPress}
              onChange={onChange}
            />
            <div className="vertical divider" />
          </header>

          <div className="pastanaga-menu-list">
            {props.loading ? (
              loaderComp
            ) : (
              <>
                {props.showSearchResults
                  ? searchResultsList()
                  : collectionsList()}
              </>
            )}
          </div>
        </div>

        <div className={'items pastanaga-menu'}>
          <header className="header pulled">
            <button onClick={pull}>
              <Icon name={backSVG} size="30px" />
            </button>
            <div className="vertical divider" />
            <h2>Back to library</h2>
          </header>
          <div className="pastanaga-menu-list">
            {props.loading ? loaderComp : itemsList()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterDetailWidget;
