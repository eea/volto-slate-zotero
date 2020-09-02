import { Icon } from '@plone/volto/components';
import backSVG from '@plone/volto/icons/back.svg';
import rightArrowSVG from '@plone/volto/icons/right-key.svg';
import React, { useState } from 'react';
import {
  Button,
  Image,
  Input,
  Label,
  Loader,
  Menu,
  Tab
} from 'semantic-ui-react';

const iconsObj = {
  zotero:
    'https://www.zotero.org/static/images/bs4theme/zotero-logo.1519312231.svg',
  openaire: 'https://guidelines.openaire.eu/en/latest/_images/openaire.png',
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

const makeList = (props, results) => (
  <ul>
    {!props.loading ? (
      props[results].length > 0 ? (
        props[results].map((item, index) => (
          <li>
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
              onClick={(ev) => {
                ev.preventDefault();
                return props.pushSearchItem(item);
              }}
            >
              {item.data.title ? `${item.data.title.slice(0, 65)}...` : ''}
            </button>
          </li>
        ))
      ) : (
        <li>No results...</li>
      )
    ) : null}
  </ul>
);

let openAireFilterList = ['publications'];
let searchForDoi = false;

const makeOpenAireFilterList = (item) => {
  // console.log('makeOpenAireFilterList item', item);
  const itemIndex = openAireFilterList.indexOf(item);
  const itemFound = itemIndex > -1;

  if (!itemFound) {
    openAireFilterList.push(item);
  } else {
    const len = openAireFilterList.length;
    openAireFilterList.splice(len - 1, 1);
    // console.log('makeOpenAireFilterList x', x);
  }

  // console.log('makeOpenAireFilterList itemIndex', itemIndex);
  // console.log('makeOpenAireFilterList', openAireFilterList);
};

const panes = (props) => [
  {
    menuItem: (
      <Menu.Item key="messages">
        All<Label>{props.allSearchResults.length}</Label>
      </Menu.Item>
    ),
    render: () => <Tab.Pane>{makeList(props, 'allSearchResults')}</Tab.Pane>,
  },
  {
    menuItem: (
      <Menu.Item key="messages">
        Zotero<Label>{props.zoteroSearchResults.length}</Label>
      </Menu.Item>
    ),
    render: () => <Tab.Pane>{makeList(props, 'zoteroSearchResults')}</Tab.Pane>,
  },
  {
    menuItem: (
      <Menu.Item key="messages">
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
              props.openAireCallback(openAireFilterList, searchForDoi);
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
              props.openAireCallback(openAireFilterList, searchForDoi);
            }}
          >
            Research Data
          </Button>
          <Button
            primary
            active={searchForDoi}
            onClick={(ev) => {
              ev.preventDefault();
              searchForDoi = !searchForDoi;
              props.openAireCallback(openAireFilterList, searchForDoi);
            }}
          >
            DOI
          </Button>
        </Button.Group>
        {makeList(props, 'openAireSearchResults')}
      </Tab.Pane>
    ),
  },
];

const MasterDetailWidget = (props) => {
  const [hideCollection, setHideCollection] = useState(false);
  const [moveMenu, setMoveMenu] = useState(0);
  const [searchTerm, setSearchTerm] = useState(null);
  // console.log(props);

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
            <li key={`li-${index}`}>
              <button
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
            <li>
              <button
                onClick={(ev) => {
                  ev.preventDefault();
                  return pushItem(item);
                }}
              >
                {item.data.title ? `${item.data.title.slice(0, 100)}...` : ''}
              </button>
            </li>
          ))
        ) : (
          <li>No results...</li>
        )
      ) : null}
    </ul>
  );

  const searchResultsList = () => <Tab panes={panes(props)} />;

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
              action={{
                icon: 'search',
                onClick: handleInput,
              }}
              placeholder="Search..."
              onChange={onChange}
            />

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
