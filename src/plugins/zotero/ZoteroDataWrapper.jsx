import { Icon as VoltoIcon } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import React, { useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import InlineForm from 'volto-slate/futurevolto/InlineForm';
import MasterDetailWidget from './MasterDetailWidget';

const zoteroEEAFormatFileUrl = process.env.RAZZLE_FILE_URL;
const bearer_token = process.env.RAZZLE_API;
const bearer = 'Bearer ' + bearer_token;
const headers = {
  Authorization: bearer,
  'Content-Type': 'application/json',
};
const zoteroBaseUrl = process.env.RAZZLE_URL;
const url = `${zoteroBaseUrl}/collections/`;
const urlSearch = `${zoteroBaseUrl}/items?q=`;

const openAireUrlPublication = `http://api.openaire.eu/search/publications`;

const allRequests = {};
const cacheAllRequests = (url, items) => {
  allRequests[url] = items;
};

const formatOpenAire = (item) => {
  const entry = item.metadata['oaf:entity']['oaf:result'];
  const result = { data: {}, icon: 'cloudSVG', isOpenAire: true };
  console.log('@@@@ entry', entry);
  const hasDoi = entry.pid
    ? Array.isArray(entry.pid)
      ? entry.pid.find((key) => key['@classid'] === 'doi')
      : entry.pid
      ? entry.pid['@classid'] === 'doi'
        ? entry.pid
        : null
      : null
    : null;

  result.data = {
    title: entry.title[0] ? entry.title[0]['$'] : entry.title['$'],
    itemType: 'journalArticle',
    DOI: hasDoi ? hasDoi['$'] : null,
    creators: Array.isArray(entry.creator)
      ? entry.creator.map((creator) => {
          return {
            creatorType: 'author',
            firstName: creator['@name'],
            lastName: creator['@surname'],
          };
        })
      : [
          {
            creatorType: 'author',
            firstName: entry.creator['@name'],
            lastName: entry.creator['@surname'],
          },
        ],
    url: entry.url,
    collections: [],
    relations: {},
  };
  return result;
};

const ZoteroDataWrapper = (props) => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [footnote, setFootnoteRef] = useState(props.formData?.footnote);
  const [footnoteTitle, setfootnoteTitle] = useState(
    props.formData?.footnoteTitle,
  );
  const [itemIdRef, setItemIdRef] = useState(props.formData?.zoteroId);
  const [showResults, setShowResults] = useState(false);
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchAireResults, setSearchAireResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState(zoteroEEAFormatFileUrl);
  const [searchTerm, setSearchTerm] = useState(null);

  const fetchCollections = (collectionId, offset = 0) => {
    const tempUrl = collectionId ? `${url}${collectionId}/items/` : `${url}`;
    const finalUrl = `${tempUrl}?v=3&start=${offset}`;

    if (allRequests[finalUrl]) {
      if (collectionId) {
        setItems(allRequests[finalUrl]);
      } else {
        setCollections(allRequests[finalUrl]);
      }
    } else {
      setLoading(true);

      fetch(finalUrl, {
        method: 'GET',
        headers,
      })
        .then((response) => response.json())
        .then((results) => {
          let finalResult = [];
          if (collectionId) {
            finalResult = offset > 0 ? [...items, ...results] : results;
            setItems(finalResult);
          } else {
            finalResult = offset > 0 ? [...collections, ...results] : results;
            setCollections(finalResult);
          }
          cacheAllRequests(finalUrl, finalResult);
          setLoading(false);
        })
        .catch((error) => {
          console.log('@@@@ error', error);
          setLoading(false);
        });
    }
  };

  const fetchSearch = (term, offset = 0) => {
    const finalUrl = `${urlSearch}${term}&start=${offset}`;
    setSearchTerm(term);
    if (allRequests[finalUrl]) {
      setShowResults(true);
      setSearchResults(allRequests[finalUrl]);
    } else {
      setLoading(true);
      setShowResults(true);

      fetch(finalUrl, {
        method: 'GET',
        headers,
      })
        .then((response) => response.json())
        .then((results) => {
          const finalResult =
            offset > 0 ? [...searchResults, ...results] : results;
          setSearchResults(finalResult);
          // cacheAllRequests(finalUrl, finalResult);
          setLoading(false);
        })
        .catch((error) => {
          console.log('@@@@ error', error);
          setLoading(false);
        });
    }
  };

  const fetchAireSearch = (term, offset = 0) => {
    const openaireTitleUrl = `${openAireUrlPublication}/?title=${term}&format=json&size=20`;
    const openaireDOIUrl = `${openAireUrlPublication}/?doi=${term}&format=json&size=20`;

    setLoading(true);
    setShowResults(true);

    fetch(openaireTitleUrl, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        const results = response.response.results.result;
        const formattedResults = results.map((item) => formatOpenAire(item));
        const finalResult =
          offset > 0
            ? [...searchAireResults, ...formattedResults]
            : formattedResults;
        console.log('formattedResults', formattedResults);
        console.log('finalResult', finalResult);
        setSearchAireResults(finalResult);
        // cacheAllRequests(openaireUrl, finalResult);
      })
      .catch((error) => {
        console.log('@@@@ error', error);
        setLoading(false);
      });

    fetch(openaireDOIUrl, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        const results = response.response.results.result;
        const formattedResults = results.map((item) => formatOpenAire(item));
        const finalResult =
          offset > 0
            ? [...searchAireResults, ...formattedResults]
            : formattedResults;
        console.log('formattedResults', formattedResults);
        console.log('finalResult', finalResult);
        setSearchAireResults(finalResult);
        // cacheAllRequests(openaireUrl, finalResult);
      })
      .catch((error) => {
        console.log('@@@@ error', error);
        setLoading(false);
      });
  };

  const fetchItem = (zoteroId) => {
    console.log('fetch item', zoteroId);
    const testUrl = `${zoteroBaseUrl}/items/${zoteroId}?format=bib&style=${style}`;
    if (allRequests[testUrl]) {
      setFootnoteRef(allRequests[testUrl]);
    } else {
      setLoading(true);

      fetch(testUrl, {
        method: 'GET',
        headers,
      })
        .then((response) => response.text())
        .then((results) => {
          // console.log('fetch results', results);
          setFootnoteRef(results);
          cacheAllRequests(testUrl, results);
          setLoading(false);
        })
        .catch((error) => {
          console.log('@@@@ error', error);
          setLoading(false);
        });
    }
  };

  const saveItemToZotero = (itemToSave) => {
    const testUrl = `${zoteroBaseUrl}/items/`;

    setLoading(true);

    fetch(testUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify([itemToSave.data]), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((results) => {
        // console.log('@@@@ results', results);
        const itemId = results.success[0];

        fetchItem(itemId);
        setItemIdRef(itemId);
      })
      .catch((error) => {
        console.log('@@@@ error', error);
        setLoading(false);
      });
  };

  const handleLoadMore = (ev) => {
    if (showResults) {
      fetchSearch(searchTerm, searchResults.length);
    } else if (selectedCollection === null) {
      fetchCollections(null, collections.length);
    } else {
      fetchCollections(collections[selectedCollection].key, items.length);
    }
  };

  const handleShowOpenAireResults = () => {
    console.log('searchAireResults', searchAireResults);
    const uniqueAireResults = searchAireResults.filter(
      (result) =>
        !searchResults.find(
          (zoteroResult) => zoteroResult.data.DOI === result.data.DOI,
        ),
    );
    console.log('uniqueAireResults', uniqueAireResults);
    setSearchResults([...searchResults, ...uniqueAireResults]);
    console.log('searchResults', searchResults);
  };

  const onChangeSearchTerm = (value) => {
    fetchSearch(value);
    fetchAireSearch(value);
  };

  const pull = () => {
    setSelectedCollection(null);
  };

  const pushCollection = (selectedCollection) => {
    fetchCollections(collections[selectedCollection].key);
    setSelectedCollection(selectedCollection);
  };

  const showCollections = () => {
    setShowResults(false);
  };

  const pushItem = (selectedItem) => {
    fetchItem(selectedItem.key);
    setfootnoteTitle(selectedItem.data.title);
    setItemIdRef(selectedItem.key);
  };

  const pushSearchItem = (selectedItem) => {
    console.log('pushed item', selectedItem);
    console.log('pushed selectedItem', selectedItem);
    if (selectedItem.isOpenAire) {
      saveItemToZotero(selectedItem);
    } else {
      fetchItem(selectedItem.key);
      setItemIdRef(selectedItem.key);
    }
    setfootnoteTitle(selectedItem.data.title);
  };

  // Similar to componentDidMount and componentDidUpdate:
  // used only once at mount
  useEffect(() => {
    setfootnoteTitle(props.formData?.footnoteTitle);
    fetchCollections();
  }, []); // to be used only once at mount

  useEffect(() => {
    setfootnoteTitle(props.formData?.footnoteTitle);
  }, [props]);

  const newFormData = {
    ...props.formData,
    ...{ footnoteTitle },
  };
  const formData = {
    ...props.formData,
    ...{ footnote, zoteroId: itemIdRef, footnoteTitle },
  };

  return (
    <div id="zotero-comp">
      <InlineForm
        schema={props.schema}
        title={props.title}
        icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
        formData={newFormData}
        headerActions={
          <>
            <button
              onClick={(id, value) => {
                props.submitHandler(formData);
              }}
            >
              <VoltoIcon size="24px" name={checkSVG} />
            </button>
            <button onClick={props.clearHandler}>
              <VoltoIcon size="24px" name={clearSVG} />
            </button>
          </>
        }
      />
      <MasterDetailWidget
        pull={pull}
        pushCollection={pushCollection}
        pushItem={pushItem}
        items={items}
        collections={collections}
        loading={loading}
        selectedCollection={selectedCollection}
        onChangeSearchTerm={onChangeSearchTerm}
        showResults={showResults}
        searchResults={searchResults}
        pushSearchItem={pushSearchItem}
        showCollections={showCollections}
        handleLoadMore={handleLoadMore}
      ></MasterDetailWidget>
      {showResults ? (
        <Button primary onClick={handleShowOpenAireResults}>
          Show OpenAire results
        </Button>
      ) : null}

      {collections.length === 15 ||
      items.length === 15 ||
      (showResults && searchResults.length === 15) ? (
        <Button primary onClick={handleLoadMore}>
          Load more
        </Button>
      ) : null}
    </div>
  );
};

export default ZoteroDataWrapper;
