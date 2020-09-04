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
  Tab
} from 'semantic-ui-react';
import openairePNG from './images/openaire.png';
import zoteroSVG from './images/zotero.svg';

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

const makeList = (props, resultsType, handleClick, activeIndex) => (
  <ul>
    {!props.loading ? (
      props[resultsType].length > 0 ? (
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
                    {item.data.title.slice(0, 50)}
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
                      Author: {item.data.creators[0]?.firstName}{' '}
                      {item.data.creators[0]?.lastName}{' '}
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
        <li>No results...</li>
      )
    ) : null}
  </ul>
);

let openAireFilterList = ['publications'];

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
  pushItem,
) => [
  {
    menuItem: (
      <Menu.Item key="all-tab">
        All<Label>{props.allSearchResults.length}</Label>
      </Menu.Item>
    ),
    render: () => (
      <Tab.Pane>
        {makeList(
          props,
          'allSearchResults',
          handleAllIndexClick,
          listAllIndex,
          pushItem,
        )}
      </Tab.Pane>
    ),
  },
  {
    menuItem: (
      <Menu.Item key="zotero-tab">
        Zotero<Label>{props.zoteroSearchResults.length}</Label>
      </Menu.Item>
    ),
    render: () => (
      <Tab.Pane>
        {makeList(
          props,
          'zoteroSearchResults',
          handleZoteroIndexClick,
          listZoteroIndex,
          pushItem,
        )}
      </Tab.Pane>
    ),
  },
  {
    menuItem: (
      <Menu.Item key="openaire-tab">
        OpenAire<Label>{props.openAireSearchResults.length}</Label>
      </Menu.Item>
    ),
    render: () => (
      <Tab.Pane>
        <Button.Group basic size="small">
          <Button
            primary
            active={openAireFilterList.indexOf('publications') > -1}
            onClick={(ev) => {
              ev.preventDefault();
              makeOpenAireFilterList('publications');
              props.openAireCallback(openAireFilterList);
            }}
          >
            Publications
          </Button>
          <Button
            primary
            active={openAireFilterList.indexOf('rsd') > -1}
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
          pushItem,
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

  const handleAllIndexClick = (index) => {
    const newIndex = listAllIndex === index ? -1 : index;
    setAllListIndex(newIndex);
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
    props.pushCollection(selectedCollection);
  };

  const pushItem = (selectedItem) => {
    setHideCollection(true);
    props.pushItem(selectedItem);
  };

  const handleInput = (ev) => {
    ev.preventDefault();
    props.onChangeSearchTerm(searchTerm);
  };

  const onChange = (ev) => {
    ev.preventDefault();
    setSearchTerm(ev.target.value);
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

  const itemsList = () => (
    <ul>
      {!props.loading ? (
        props.items.length > 0 ? (
          props.items.map((item, index) => (
            <li key={`item-${index}`}>
              <button
                className="list-button-md"
                onClick={(ev) => {
                  ev.preventDefault();
                  handleItemIndexClick(index);
                }}
              >
                {item.citationTitle}
              </button>

              {listItemIndex === index ? (
                <Card fluid>
                  <Card.Content>
                    <Card.Description>
                      {item.data.title.slice(0, 50)}
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
                        {item.data.itemType} . {item.data.date}{' '}
                      </span>
                    </Card.Meta>
                    <Card.Meta>
                      <span>
                        Author: {item.data.creators[0]?.firstName}{' '}
                        {item.data.creators[0]?.lastName}{' '}
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
          <li>No results...</li>
        )
      ) : null}
    </ul>
  );

  const searchResultsList = () => (
    <Tab
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
            <Button onClick={onClick} primary={!!props.showResults}>
              Show Library
            </Button>
            <Input
              fluid
              action={{
                icon: 'search',
                onClick: handleInput,
              }}
              placeholder="Search..."
              onChange={onChange}
            />
            {/* <Input fluid icon="search" placeholder="Search. ff.." /> */}

            <div className="vertical divider" />
          </header>

          <div className="pastanaga-menu-list">
            {props.loading ? (
              loaderComp
            ) : (
              <>{props.showResults ? searchResultsList() : collectionsList()}</>
            )}
          </div>
        </div>

        <div className={'items pastanaga-menu'}>
          <header className="header pulled">
            <button onClick={pull}>
              <Icon name={backSVG} size="30px" />
            </button>
            <div className="vertical divider" />
            <h2>{props.collections[props.selectedCollection]?.data?.name}</h2>
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
