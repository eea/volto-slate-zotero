import { Icon as VoltoIcon } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Loader } from 'semantic-ui-react';
import {
  fetchOpenairePubSearchItems,
  fetchOpenaireRsdSearchItems,
  fetchZoteroCollections,
  fetchZoteroItemCitation,
  fetchZoteroItems,
  fetchZoteroSearchItems,
  fetchZoteroSubCollections,
  getZoteroSettings,
  saveItemToZotero,
} from './actions';
import InlineForm from './InlineForm';
import MasterDetailWidget from './MasterDetailWidget';
import {
  findDOI,
  formatCitation,
  formatOpenAire,
  makeOpenAireUrlObj,
} from './utils';

const ZoteroDataWrapper = (props) => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hasMultipleDOIs, setHasMultipleDOIs] = useState(false);
  const [collections, setCollections] = useState([]);
  const [topCollections, setTopCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [composedItems, setComposedItems] = useState([]);
  const [allSearchResults, setAllSearchResults] = useState([]);
  const [zoteroSearchResults, setZoteroSearchResults] = useState([]);
  const [openAireSearchResults, setOpenAireSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [citationLoading, setCitationLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [topCollectionFlag, setTopCollectionFlag] = useState(false);
  const [searchTerm, setSearchTerm] = useState(null);
  const [updatedFormData, setUpdatedFormData] = useState(props.formData); // eslint-disable-line
  const [
    zoteroSearchItemsTotalResultsNumber,
    setZoteroSearchItemsTotalResultsNumber,
  ] = useState(0);
  const [openAireTotalResultsNumber, setOpenAireTotalResultsNumber] = useState(
    0,
  );
  const [
    openAirePubTotalResultsNumber,
    setOpenAirePubTotalResultsNumber,
  ] = useState(0);
  const [
    openAireRsdTotalResultsNumber,
    setOpenAireRsdTotalResultsNumber,
  ] = useState(0);
  const [
    zoteroItemsTotalResultsNumber,
    setZoteroItemsTotalResultsNumber,
  ] = useState(0);
  const [
    zoteroCollectionsTotalResultsNumber,
    setZoteroCollectionsTotalResultsNumber,
  ] = useState(0);
  const [
    zoteroTopCollectionsTotalResultsNumber,
    setZoteroTopCollectionsTotalResultsNumber,
  ] = useState(0);
  const [zoteroItemsOffset, setZoteroItemsOffset] = useState(0);
  const [zoteroSearchItemsOffset, setZoteroSearchItemsOffset] = useState(0);
  const [zoteroCollectionsOffset, setZoteroCollectionsOffset] = useState(0);
  const [openAirePublicationResults, setOpenAirePublicationResults] = useState(
    [],
  );
  const [openAireDataResults, setOpenAireDataResults] = useState([]);
  const zotero_settings = useSelector((state) => state?.zotero_settings?.api);
  const zotero_search_items = useSelector(
    (state) => state?.zotero_search_items?.api,
  );
  const zotero_collections = useSelector(
    (state) => state?.zotero_collections?.api,
  );
  const zotero_sub_collections = useSelector(
    (state) => state?.zotero_sub_collections?.api,
  );
  const zotero_items = useSelector((state) => state?.zotero_items?.api);
  const zotero_item_citation = useSelector(
    (state) => state?.zotero_item_citation?.api,
  );
  const zotero_item_saved = useSelector((state) => state?.zotero_item_saved);
  const openaire_items_pub = useSelector((state) => state?.openaire_items_pub);
  const openaire_items_rsd = useSelector((state) => state?.openaire_items_rsd);
  const [activeTabIndexS, setActiveTabIndexS] = useState(0);
  const [openAirePage, setOpenAirePage] = useState(1);
  const dispatch = useDispatch();
  const setActiveTabIndex = (index) => {
    setActiveTabIndexS(index);
  };

  const headers = {
    Authorization: 'Bearer ' + zotero_settings?.password,
    'Content-Type': 'application/json',
  };
  const zoteroBaseUrl = zotero_settings?.server;
  const zoteroCollectionsTopUrl = `${zoteroBaseUrl}/collections/top/`;
  const zoteroCollectionsUrl = `${zoteroBaseUrl}/collections/`;
  const zoteroSearchUrl = `${zoteroBaseUrl}/items?q=`;

  const fetchCollections = (offset = 0) => {
    const finalUrl = `${zoteroCollectionsTopUrl}?start=${offset}&limit=10&sort=title`;

    setTopCollectionFlag(true);
    dispatch(fetchZoteroCollections(finalUrl, headers));
  };

  const fetchItems = (collectionId, offset = 0) => {
    const finalUrl = `${zoteroCollectionsUrl}${collectionId}/items/?start=${offset}&limit=10&sort=title`;

    dispatch(fetchZoteroItems(finalUrl, headers));
  };

  const fetchSubCollections = (collectionId, offset = 0) => {
    const finalUrl = `${zoteroCollectionsUrl}${collectionId}/collections/?start=${offset}&limit=10&sort=title`;

    dispatch(fetchZoteroSubCollections(finalUrl, headers));
  };

  const fetchZoteroSearch = (term, offset = 0) => {
    const finalUrl = `${zoteroSearchUrl}${term}&limit=10&start=${offset}&sort=title`;

    setShowSearchResults(true);
    setZoteroSearchItemsOffset(offset);
    dispatch(fetchZoteroSearchItems(finalUrl, headers));
  };

  const fetchAireSearch = (term = searchTerm) => {
    setShowSearchResults(true);

    const filters = ['publications', 'rsd'];
    const objectTypeUrl = makeOpenAireUrlObj(filters);
    const searchForDoi = findDOI(term);

    if (searchForDoi.length > 0) {
      searchForDoi.forEach((doi) => {
        setHasMultipleDOIs(true);
        const finalPubUrl = `${objectTypeUrl[0]}/?doi=${doi}&format=json`;
        const finalRsdUrl = `${objectTypeUrl[1]}/?doi=${doi}&format=json`;

        dispatch(fetchOpenairePubSearchItems([finalPubUrl]));
        dispatch(fetchOpenaireRsdSearchItems([finalRsdUrl]));
      });
    } else {
      const finalTitlePubUrl = `${objectTypeUrl[0]}/?title=${term}&format=json&size=20&page=${openAirePage}`;
      const finalAuthorPubUrl = `${objectTypeUrl[0]}/?author=${term}&format=json&size=20&page=${openAirePage}`;
      const finalTitleRsdUrl = `${objectTypeUrl[1]}/?title=${term}&format=json&size=20&page=${openAirePage}`;
      const finalAuthorRsdUrl = `${objectTypeUrl[1]}/?author=${term}&format=json&size=20&page=${openAirePage}`;

      dispatch(
        fetchOpenairePubSearchItems([finalTitlePubUrl, finalAuthorPubUrl]),
      );
      dispatch(
        fetchOpenaireRsdSearchItems([finalTitleRsdUrl, finalAuthorRsdUrl]),
      );
    }
  };

  const fetchItemCitation = (zoteroId) => {
    const finalUrl = `${zoteroBaseUrl}/items/${zoteroId}?format=bib&style=${zotero_settings?.style}`;

    dispatch(fetchZoteroItemCitation(finalUrl, headers));
  };

  const handleSaveItemToZotero = (itemToSave) => {
    const finalUrl = `${zoteroBaseUrl}/items/`;
    const body = JSON.stringify([itemToSave.data]);

    dispatch(saveItemToZotero(finalUrl, headers, body));
  };

  const handleLoadMore = () => {
    // load search rezults
    setLoadingMore(true);
    setHasMultipleDOIs(false);
    if (showSearchResults) {
      switch (activeTabIndexS) {
        case 0:
          setOpenAirePage(openAirePage + 1);
          fetchZoteroSearch(searchTerm, zoteroSearchResults.length);
          fetchAireSearch(searchTerm);
          break;
        case 1:
          fetchZoteroSearch(searchTerm, zoteroSearchResults.length);
          break;
        case 2:
          setOpenAirePage(openAirePage + 1);
          fetchAireSearch(searchTerm);
          break;
        default:
          break;
      }
    }
    // load more collections and items
    else {
      setZoteroCollectionsOffset(collections.length);
      setZoteroItemsOffset(items.length);

      if (topCollectionFlag) {
        // load more top collections
        fetchCollections(collections.length);
      } else {
        // load more sub-collections and items
        fetchSubCollections(selectedCollection, collections.length);
        fetchItems(selectedCollection, items.length);
      }
    }
  };

  const onChangeSearchTerm = (searchTerm) => {
    setLoading(true);
    setSearchTerm(searchTerm);
    setZoteroSearchItemsOffset(0);
    setOpenAirePage(1);
    setHasMultipleDOIs(false);

    fetchZoteroSearch(searchTerm);
    fetchAireSearch(searchTerm);
  };

  const pull = () => {
    setSelectedCollection(null);
    setTopCollectionFlag(true);
    setCollections(topCollections);
    setZoteroCollectionsTotalResultsNumber(
      zoteroTopCollectionsTotalResultsNumber,
    );
  };

  const pushCollection = (selectedCollectionIndex) => {
    const selectedCol = collections[selectedCollectionIndex];

    setLoading(true);
    setZoteroSearchItemsOffset(0);
    setZoteroItemsOffset(0);
    setCollections([]);
    setZoteroCollectionsTotalResultsNumber(0);
    setTopCollectionFlag(false);

    if (selectedCol.meta.numCollections > 0) {
      fetchSubCollections(selectedCol.key);
    }

    fetchItems(selectedCol.key);
    setSelectedCollection(selectedCol.key);
  };

  const showCollections = () => {
    setActiveTabIndexS(-1);
    setShowSearchResults(false);
    pull();
  };

  const pushItem = (receivedItem) => {
    setCitationLoading(true);
    fetchItemCitation(receivedItem.key);
    setSelectedItem(receivedItem);
  };

  const pushSearchItem = (receivedItem) => {
    setCitationLoading(true);
    setSelectedItem(receivedItem);
    if (!receivedItem.isOpenAire) {
      fetchItemCitation(receivedItem.key);
    } else {
      handleSaveItemToZotero(receivedItem);
    }
  };

  /**
   * Will search for openAire based on received filters
   * @param {string[]} item
   */
  const openAireCallback = (filterList) => {
    const aireLiteral = {
      publications: openAirePublicationResults,
      rsd: openAireDataResults,
    };
    const aireResults = filterList.reduce((accumulator, currentValue) => {
      return [...accumulator, ...aireLiteral[currentValue]];
    }, []);

    setAllSearchResults([...zoteroSearchResults, ...aireResults]);
    setOpenAireSearchResults(aireResults);
  };

  // Similar to componentDidMount and componentDidUpdate:
  // used only once at mount
  useEffect(() => {
    dispatch(getZoteroSettings());
    // to be used only once at mount
  }, []); // eslint-disable-line

  useEffect(() => {
    if (zotero_settings) {
      setLoading(true);
      fetchCollections();
    }
  }, [zotero_settings]); // eslint-disable-line

  useEffect(() => {
    if (zotero_collections) {
      let mergedResult =
        zoteroCollectionsOffset > 0
          ? [...collections, ...zotero_collections.results]
          : zotero_collections.results;

      setCollections(mergedResult);

      if (topCollectionFlag) setTopCollections(mergedResult);

      setZoteroCollectionsTotalResultsNumber(zotero_collections.totalResults);
      setZoteroTopCollectionsTotalResultsNumber(
        zotero_collections.totalResults,
      );
      setLoading(false);
      setLoadingMore(false);
    }
  }, [zotero_collections]); // eslint-disable-line

  useEffect(() => {
    if (zotero_sub_collections) {
      let mergedResult =
        zoteroCollectionsOffset > 0
          ? [...collections, ...zotero_sub_collections.results]
          : zotero_sub_collections.results;
      const formattedResults = mergedResult.map((item) => {
        const formattedItem = { ...item };
        formattedItem.citationTitle = formatCitation(item);

        return formattedItem;
      });

      setCollections(formattedResults);
      setZoteroCollectionsTotalResultsNumber(
        zotero_sub_collections.totalResults,
      );
      setComposedItems([...formattedResults, ...items]);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [zotero_sub_collections]); // eslint-disable-line

  useEffect(() => {
    if (zotero_items) {
      let mergedResult =
        zoteroItemsOffset > 0
          ? [...items, ...zotero_items.results]
          : zotero_items.results;
      const formattedResults = mergedResult.map((item) => {
        const formattedItem = { ...item };
        formattedItem.citationTitle = formatCitation(item);

        return formattedItem;
      });

      setItems(formattedResults);
      setZoteroItemsTotalResultsNumber(zotero_items.totalResults);
      setComposedItems([...collections, ...formattedResults]);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [zotero_items]); // eslint-disable-line

  useEffect(() => {
    if (zotero_item_citation && selectedItem) {
      setLoading(false);
      setLoadingMore(false);
      setCitationLoading(false);
      const footnote = zotero_item_citation.result;

      setUpdatedFormData(
        updatedFormData.footnote
          ? {
              ...updatedFormData,
              extra: [
                ...(updatedFormData.extra || []),
                {
                  footnote,
                  zoteroId: selectedItem.key,
                  footnoteTitle: formatCitation(selectedItem),
                },
              ],
            }
          : {
              ...updatedFormData,
              ...{
                footnote,
                zoteroId: selectedItem.key,
                footnoteTitle: formatCitation(selectedItem),
              },
            },
      );
    }
  }, [zotero_item_citation]); // eslint-disable-line

  useEffect(() => {
    if (zotero_item_saved.api) {
      const itemId = zotero_item_saved.api.success[0];
      toast.success('Successfully added to Zotero Library');

      setLoading(false);
      fetchItemCitation(itemId);
    }
    if (zotero_item_saved?.zotero?.error) {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [zotero_item_saved]); // eslint-disable-line

  useEffect(() => {
    if (zotero_search_items) {
      const finalResult =
        zoteroSearchItemsOffset > 0
          ? [...zoteroSearchResults, ...zotero_search_items.results]
          : zotero_search_items.results;

      const zoteroResults = finalResult.map((item) => {
        const formattedItem = { ...item };
        formattedItem.citationTitle = formatCitation(item);

        return formattedItem;
      });

      setZoteroSearchItemsTotalResultsNumber(zotero_search_items.totalResults);
      setZoteroSearchResults(zoteroResults);
      setAllSearchResults([
        ...zoteroResults,
        ...openAirePublicationResults,
        ...openAireDataResults,
      ]);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [zotero_search_items]); // eslint-disable-line

  useEffect(() => {
    if (openaire_items_pub.api) {
      const formattedResults = openaire_items_pub.api.map((item) =>
        formatOpenAire(item, 'publications', zotero_settings?.default),
      );
      const publicationRestuls =
        openAirePage > 1
          ? [...openAirePublicationResults, ...formattedResults]
          : hasMultipleDOIs
          ? [...openAirePublicationResults, ...formattedResults]
          : formattedResults;

      const uniquePublicationRestuls = publicationRestuls.filter((result) => {
        return !zoteroSearchResults.find(
          (zoteroResult) => zoteroResult.data.DOI === result.data.DOI,
        );
      });

      setOpenAirePubTotalResultsNumber(openaire_items_pub.totalResults);
      setOpenAireTotalResultsNumber(
        openaire_items_pub.totalResults + openAireRsdTotalResultsNumber,
      );
      setOpenAirePublicationResults(uniquePublicationRestuls);
      setOpenAireSearchResults([
        ...uniquePublicationRestuls,
        ...openAireDataResults,
      ]);
      setAllSearchResults([
        ...zoteroSearchResults,
        ...uniquePublicationRestuls,
        ...openAireDataResults,
      ]);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [openaire_items_pub]); // eslint-disable-line

  useEffect(() => {
    if (openaire_items_rsd.api) {
      const formattedResults = openaire_items_rsd.api.map((item) =>
        formatOpenAire(item, 'rsd', zotero_settings?.default),
      );
      const rsdRestuls =
        openAirePage > 1
          ? [...openAireDataResults, ...formattedResults]
          : hasMultipleDOIs
          ? [...openAireDataResults, ...formattedResults]
          : formattedResults;
      const uniqueRsdRestuls = rsdRestuls.filter((result) => {
        return !zoteroSearchResults.find(
          (zoteroResult) => zoteroResult.data.DOI === result.data.DOI,
        );
      });

      setOpenAireRsdTotalResultsNumber(openaire_items_rsd.totalResults);
      setOpenAireTotalResultsNumber(
        openaire_items_rsd.totalResults + openAirePubTotalResultsNumber,
      );
      setOpenAireDataResults(uniqueRsdRestuls);
      setOpenAireSearchResults([
        ...openAirePublicationResults,
        ...uniqueRsdRestuls,
      ]);
      setAllSearchResults([
        ...zoteroSearchResults,
        ...openAirePublicationResults,
        ...uniqueRsdRestuls,
      ]);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [openaire_items_rsd]); // eslint-disable-line

  useEffect(() => {
    setUpdatedFormData({
      ...props.formData,
    });
    /* eslint-disable */
  }, [
    props.formData,
    props.formData?.footnote,
    props.formData?.footnoteTitle,
    props.formData?.zoteroId,
  ]);

  const deleteItem = (index) => {
    let formDataAfterDelete = null;

    if (index > -1 && updatedFormData.extra) {
      formDataAfterDelete = {
        ...updatedFormData,
        extra: [
          ...updatedFormData.extra.slice(0, index),
          ...updatedFormData.extra.slice(index + 1),
        ],
      };
    } else if (
      index === -1 &&
      (!updatedFormData.extra || updatedFormData.extra.length === 0)
    ) {
      formDataAfterDelete = { uid: updatedFormData.uid };
    } else if (
      index === -1 &&
      updatedFormData.extra &&
      updatedFormData.extra.length > 0
    ) {
      const firstExtraCitation = updatedFormData.extra.slice(0, 1)[0];
      const { footnote, footnoteTitle, zoteroId } = firstExtraCitation;

      formDataAfterDelete = {
        ...updatedFormData,
        ...{ footnote, footnoteTitle, zoteroId },
        extra: [...updatedFormData.extra.slice(1)],
      };
    }
    setUpdatedFormData(formDataAfterDelete);
  };

  const loadMoreButton = (
    <Button primary loading={loadingMore} onClick={handleLoadMore}>
      Load more
    </Button>
  );

  return (
    <div id="zotero-comp">
      <InlineForm
        schema={props.schema}
        title={props.title}
        icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
        updatedFormData={updatedFormData}
        deleteItem={deleteItem}
        headerActions={
          <>
            <button
              onClick={(id, value) => {
                props.submitHandler(updatedFormData);
              }}
            >
              {!citationLoading ? (
                <VoltoIcon size="24px" name={checkSVG} />
              ) : (
                <Loader active inline size="small" />
              )}
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
        items={composedItems}
        collections={collections}
        loading={loading}
        selectedCollection={selectedCollection}
        onChangeSearchTerm={onChangeSearchTerm}
        showSearchResults={showSearchResults}
        allSearchResults={allSearchResults}
        zoteroSearchResults={zoteroSearchResults}
        openAireSearchResults={openAireSearchResults}
        pushSearchItem={pushSearchItem}
        showCollections={showCollections}
        setActiveTabIndex={setActiveTabIndex}
        openAireCallback={openAireCallback}
        zoteroSearchItemsTotalResultsNumber={
          zoteroSearchItemsTotalResultsNumber
        }
        openAireTotalResultsNumber={openAireTotalResultsNumber}
      ></MasterDetailWidget>
      {showSearchResults
        ? allSearchResults.length < openAireTotalResultsNumber
          ? loadMoreButton
          : null
        : topCollectionFlag
        ? zoteroCollectionsTotalResultsNumber > collections.length
          ? loadMoreButton
          : null
        : zoteroCollectionsTotalResultsNumber + zoteroItemsTotalResultsNumber >
          composedItems.length
        ? loadMoreButton
        : null}
    </div>
  );
};

export default ZoteroDataWrapper;
