import { Icon as VoltoIcon } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { getZoteroSettings } from './actions';
// import InlineForm from 'volto-slate/futurevolto/InlineForm';
import InlineForm from './InlineForm';
import MasterDetailWidget from './MasterDetailWidget';

const openAireUrlBase = `http://api.openaire.eu/search`;

const makeOpenAireUrlObj = (filterList) => {
  const openAireUrl = {
    publications: `${openAireUrlBase}/publications`,
    rsd: `${openAireUrlBase}/datasets`,
  };

  return filterList.reduce((accumulator, currentValue) => {
    return [...accumulator, openAireUrl[currentValue]];
  }, []);
};

const allRequests = {};
const cacheAllRequests = (url, items) => {
  allRequests[url] = items;
};

const formatOpenAire = (item, label) => {
  const entry = item.metadata['oaf:entity']['oaf:result'];
  const result = { data: {}, icon: 'openaire', label, isOpenAire: true };

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
            firstName: creator['@name'] || creator.$,
            lastName: creator['@surname'],
          };
        })
      : entry.creator
      ? [
          {
            creatorType: 'author',
            firstName: entry.creator['@name'] || entry.creator.$,
            lastName: entry.creator['@surname'],
          },
        ]
      : [],
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [allSearchResults, setAllSearchResults] = useState([]);
  const [zoteroSearchResults, setZoteroSearchResults] = useState([]);
  const [openAireSearchResults, setOpenAireSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(null);
  const [newFormData, setNewFormData] = useState({});
  const [formData, setFormData] = useState({});
  const zotero_settings = useSelector((state) => state?.zotero_settings?.api);
  const dispatch = useDispatch();

  const headers = {
    Authorization: 'Bearer ' + zotero_settings?.password,
    'Content-Type': 'application/json',
  };

  const zoteroBaseUrl = zotero_settings?.server;
  const url = `${zoteroBaseUrl}/collections/`;
  const urlSearch = `${zoteroBaseUrl}/items?q=`;

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
          // console.log('@@@@ error', error);
          setLoading(false);
        });
    }
  };

  const allSearchPromises = [];

  const fetchSearch = (term, offset = 0) => {
    const finalUrl = `${urlSearch}${term}&start=${offset}`;

    setSearchTerm(term);

    return new Promise((resolve, reject) => {
      if (allRequests[finalUrl]) {
        setShowResults(true);
        setZoteroSearchResults(allRequests[finalUrl]);
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
              offset > 0 ? [...zoteroSearchResults, ...results] : results;

            setLoading(false);
            allSearchPromises.push(resolve(finalResult));
          })
          .catch((error) => {
            setLoading(false);
            reject();
          });
      }
    });
  };

  const fetchAireSearch = (searchUrl, label, offset = 0) => {
    setLoading(true);
    setShowResults(true);

    return new Promise((resolve, reject) => {
      fetch(searchUrl, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((response) => {
          setLoading(false);
          const results = response.response.results
            ? response.response.results.result
            : [];
          const formattedResults = results.map((item) =>
            formatOpenAire(item, label),
          );
          const finalResult =
            offset > 0
              ? [...openAireSearchResults, ...formattedResults]
              : formattedResults;

          allSearchPromises.push(resolve(finalResult));
        })
        .catch((error) => {
          setLoading(false);
          reject();
        });
    });
  };

  const fetchItem = (zoteroId) => {
    const testUrl = `${zoteroBaseUrl}/items/${zoteroId}?format=bib&style=${zotero_settings?.style}`;
    return new Promise((resolve, reject) => {
      if (allRequests[testUrl]) {
        setFootnoteRef(allRequests[testUrl]);
        resolve();
      } else {
        setLoading(true);

        fetch(testUrl, {
          method: 'GET',
          headers,
        })
          .then((response) => response.text())
          .then((results) => {
            setFootnoteRef(results);
            cacheAllRequests(testUrl, results);
            setLoading(false);
            resolve(results);
          })
          .catch((error) => {
            setLoading(false);
            reject();
          });
      }
    });
  };

  const saveItemToZotero = (itemToSave) => {
    const testUrl = `${zoteroBaseUrl}/items/`;

    setLoading(true);

    return new Promise((resolve, reject) => {
      fetch(testUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify([itemToSave.data]), // body data type must match "Content-Type" header
      })
        .then((response) => response.json())
        .then((results) => {
          const itemId = results.success[0];

          resolve(itemId);
        })
        .catch((error) => {
          setLoading(false);
          reject();
        });
    });
  };

  const handleLoadMore = (ev) => {
    if (showResults) {
      fetchSearch(searchTerm, zoteroSearchResults.length);
    } else if (selectedCollection === null) {
      fetchCollections(null, collections.length);
    } else {
      fetchCollections(collections[selectedCollection].key, items.length);
    }
  };

  const onChangeSearchTerm = (value) => {
    const openairePublicationTitleUrl = `${openAireUrlBase}/publications/?title=${value}&format=json&size=20`;

    Promise.all([
      fetchSearch(value),
      fetchAireSearch(openairePublicationTitleUrl, 'publications'),
    ]).then((values) => {
      const zoteroResults = values[0];
      const aireResults = values[1];

      const uniqueAireResults = aireResults.filter(
        (result) =>
          !zoteroResults.find(
            (zoteroResult) => zoteroResult.data.DOI === result.data.DOI,
          ),
      );
      setOpenAireSearchResults(uniqueAireResults);
      setZoteroSearchResults(zoteroResults);

      setAllSearchResults([...zoteroResults, ...uniqueAireResults]);
    });
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

  const formatCitation = (selectedItem) => {
    const { data } = selectedItem;

    const name = data.creators[0]
      ? data.creators[0]?.lastName && data.creators[0]?.firstName
        ? `${data.creators[0]?.lastName}, ${data.creators[0]?.firstName}`
        : data.creators[0]?.lastName
        ? `${data.creators[0]?.lastName}`
        : `${data.creators[0]?.firstName}`
      : '';
    const date = name
      ? data.date
        ? `, ${data.date}`
        : ''
      : data.date
      ? ` ${data.date}`
      : '';
    const title =
      date || name
        ? data.title
          ? `, ${data.title}`
          : ''
        : data.title
        ? ` ${data.title}`
        : '';
    const publisher =
      title || date || name
        ? data.publisher
          ? `, ${data.publisher}`
          : ''
        : data.publisher
        ? ` ${data.publisher}`
        : '';
    const place =
      publisher || title || date || name
        ? data.place
          ? `, ${data.place || ''}`
          : ''
        : data.place
        ? ` ${data.place}`
        : '';

    return `${name}${date}${title}${publisher}${place}.`;
  };

  const pushItem = (selectedItem) => {
    fetchItem(selectedItem.key);
    setSelectedItem(selectedItem);
    setfootnoteTitle(formatCitation(selectedItem));
    setItemIdRef(selectedItem.key);
  };

  const pushSearchItem = (selectedItem) => {
    setSelectedItem(selectedItem);
    setfootnoteTitle(formatCitation(selectedItem));

    if (!selectedItem.isOpenAire) {
      fetchItem(selectedItem.key);
      setItemIdRef(selectedItem.key);
    }
  };

  /**
   * Will search for openAire based on received filters
   * @param {string[]} item
   */
  const openAireCallback = (filterList, searchForDoi) => {
    const resultUrl = makeOpenAireUrlObj(filterList);
    const promises = resultUrl.map((url, index) => {
      const finalUrl = searchForDoi
        ? `${url}/?doi=${searchTerm}&format=json&size=20`
        : `${url}/?title=${searchTerm}&format=json&size=20`;
      return fetchAireSearch(finalUrl, filterList[index]);
    });

    Promise.all(promises).then((promiseResults) => {
      const aireResults = promiseResults.reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue];
      }, []);

      const uniqueAireResults = aireResults.filter(
        (result) =>
          !zoteroSearchResults.find(
            (zoteroResult) => zoteroResult.data.DOI === result.data.DOI,
          ),
      );
      setOpenAireSearchResults(uniqueAireResults);
    });
  };

  // Similar to componentDidMount and componentDidUpdate:
  // used only once at mount
  useEffect(() => {
    dispatch(getZoteroSettings());
  }, []); // to be used only once at mount

  useEffect(() => {
    setfootnoteTitle(props.formData?.footnoteTitle);
  }, [props.formData?.footnoteTitle]); // to be used only once at mount

  useEffect(() => {
    fetchCollections();
  }, [zotero_settings]); // to be used only once at mount

  useEffect(() => {
    setfootnoteTitle(props.formData?.footnoteTitle);
    setFootnoteRef(props.formData?.footnote);
    setItemIdRef(props.formData?.zoteroId);

    setNewFormData({
      ...props.formData,
      ...{ footnoteTitle },
    });
    setFormData({
      ...props.formData,
      ...{ footnote, zoteroId: itemIdRef, footnoteTitle },
    });
  }, [
    props.formData,
    props.formData?.footnote,
    props.formData?.footnoteTitle,
    props.formData?.zoteroId,
  ]);

  const newFormData1 = {
    ...props.formData,
    ...{ footnoteTitle },
  };
  const formData1 = {
    ...props.formData,
    ...{ footnote, zoteroId: itemIdRef, footnoteTitle },
  };

  return (
    <div id="zotero-comp">
      <InlineForm
        schema={props.schema}
        title={props.title}
        icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
        formData={newFormData1}
        headerActions={
          <>
            <button
              onClick={(id, value) => {
                if (selectedItem && selectedItem.isOpenAire) {
                  saveItemToZotero(selectedItem).then((itemId) => {
                    setItemIdRef(itemId);
                    fetchItem(itemId)
                      .then((results) => {
                        const formData = {
                          ...props.formData,
                          ...{
                            footnote: results,
                            zoteroId: itemId,
                            footnoteTitle,
                          },
                        };
                        props.submitHandler(formData);
                      })
                      .catch((error) => {});
                  });
                } else {
                  props.submitHandler(formData1);
                }
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
        allSearchResults={allSearchResults}
        zoteroSearchResults={zoteroSearchResults}
        openAireSearchResults={openAireSearchResults}
        pushSearchItem={pushSearchItem}
        showCollections={showCollections}
        handleLoadMore={handleLoadMore}
        openAireCallback={openAireCallback}
      ></MasterDetailWidget>
      {collections.length === 15 ||
      items.length === 15 ||
      (showResults && allSearchResults.length === 15) ? (
        <Button primary onClick={handleLoadMore}>
          Load more
        </Button>
      ) : null}
    </div>
  );
};

export default ZoteroDataWrapper;
