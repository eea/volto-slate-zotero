import { Icon as VoltoIcon } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';
import {
  fetchOpenairePubSearchItems,
  fetchOpenaireRsdSearchItems,
  fetchZoteroCollections,
  fetchZoteroItemCitation,
  fetchZoteroItems,
  fetchZoteroSearchItems,
  fetchZoteroSubCollections,
  getZoteroSettings,
  saveItemToZotero
} from './actions';
import InlineForm from './InlineForm';
import MasterDetailWidget from './MasterDetailWidget';
import {
  findDOI,
  formatCitation,
  formatOpenAire,
  makeOpenAireUrlObj
} from './utils';

const ZoteroDataWrapper = (props) => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [footnote, setFootnoteRef] = useState(props.formData?.footnote);
  const [footnoteTitle, setfootnoteTitle] = useState(
    props.formData?.footnoteTitle,
  );
  const [itemIdRef, setItemIdRef] = useState(props.formData?.zoteroId);
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
  const [topCollectionFlag, setTopCollectionFlag] = useState(false);
  const [searchTerm, setSearchTerm] = useState(null);
  const [newFormData, setNewFormData] = useState({});
  const [formData, setFormData] = useState({});
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
  const zotero_item_saved = useSelector(
    (state) => state?.zotero_item_saved,
  );
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

    setLoading(true);
    setTopCollectionFlag(true);
    dispatch(fetchZoteroCollections(finalUrl, headers));
  };

  const fetchItems = (collectionId, offset = 0) => {
    const finalUrl = `${zoteroCollectionsUrl}${collectionId}/items/?start=${offset}&limit=10&sort=title`;

    setLoading(true);
    dispatch(fetchZoteroItems(finalUrl, headers));
  };

  const fetchSubCollections = (collectionId, offset = 0) => {
    const finalUrl = `${zoteroCollectionsUrl}${collectionId}/collections/?start=${offset}&limit=10&sort=title`;

    setLoading(true);
    dispatch(fetchZoteroSubCollections(finalUrl, headers));
  };

  const fetchZoteroSearch = (term, offset = 0) => {
    const finalUrl = `${zoteroSearchUrl}${term}&limit=10&start=${offset}&sort=title`;

    setLoading(true);
    setShowSearchResults(true);
    setZoteroSearchItemsOffset(offset);
    dispatch(fetchZoteroSearchItems(finalUrl, headers));
  };

  const fetchAireSearch = (term = searchTerm) => {
    setLoading(true);
    setShowSearchResults(true);

    const filters = ['publications', 'rsd'];
    const resultUrl = makeOpenAireUrlObj(filters);
    const searchForDoi = findDOI(term);

    if (searchForDoi.length > 0) {
      searchForDoi.forEach((doi) => {
        setHasMultipleDOIs(true);
        const finalUrl = `${resultUrl[0]}/?doi=${doi}&format=json`;
        const finalUrl1 = `${resultUrl[1]}/?doi=${doi}&format=json`;
        dispatch(fetchOpenairePubSearchItems(finalUrl));
        dispatch(fetchOpenaireRsdSearchItems(finalUrl1));
      });
    } else {
      const finalUrl = `${resultUrl[0]}/?title=${term}&format=json&size=20&page=${openAirePage}`;
      const finalUrl1 = `${resultUrl[1]}/?title=${term}&format=json&size=20&page=${openAirePage}`;
      dispatch(fetchOpenairePubSearchItems(finalUrl));
      dispatch(fetchOpenaireRsdSearchItems(finalUrl1));
    }
  };

  const fetchItemCitation = (zoteroId) => {
    const finalUrl = `${zoteroBaseUrl}/items/${zoteroId}?format=bib&style=${zotero_settings?.style}`;

    dispatch(fetchZoteroItemCitation(finalUrl, headers));
  };

  const handleSaveItemToZotero = (itemToSave) => {
    const finalUrl = `${zoteroBaseUrl}/items/`;
    const body = JSON.stringify([itemToSave.data]);

    setLoading(true);
    dispatch(saveItemToZotero(finalUrl, headers, body));
  };

  const handleLoadMore = () => {
    // load search rezults
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

  const pushItem = (selectedItem) => {
    fetchItemCitation(selectedItem.key);
    setSelectedItem(selectedItem);
    setfootnoteTitle(formatCitation(selectedItem));
    setItemIdRef(selectedItem.key);
  };

  const pushSearchItem = (selectedItem) => {
    setSelectedItem(selectedItem);
    setfootnoteTitle(formatCitation(selectedItem));

    if (!selectedItem.isOpenAire) {
      fetchItemCitation(selectedItem.key);
      setItemIdRef(selectedItem.key);
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
  }, []); // to be used only once at mount

  useEffect(() => {
    if (zotero_settings) {
      fetchCollections();
    }
  }, [zotero_settings]);

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
    }
  }, [zotero_collections]);

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
    }
  }, [zotero_sub_collections]);

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
    }
  }, [zotero_items]);

  useEffect(() => {
    if (zotero_item_citation) {
      setFootnoteRef(zotero_item_citation.result);
      setLoading(false);

      if (selectedItem && selectedItem.isOpenAire) {
        const formData = {
          ...props.formData,
          ...{
            footnote: zotero_item_citation.result,
            zoteroId: itemIdRef,
            footnoteTitle,
          },
        };
        props.submitHandler(formData);
      }
    }
  }, [zotero_item_citation]);

  useEffect(() => {
    if (zotero_item_saved.api) {
      const itemId = zotero_item_saved.api.success[0];
      toast.success('Successfully added to Zotero Library');

      setLoading(false);
      setItemIdRef(itemId);
      fetchItemCitation(itemId);
    }
    if (zotero_item_saved?.zotero?.error) {
      setLoading(false);
    }
  }, [zotero_item_saved]);

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
    }
  }, [zotero_search_items]);

  useEffect(() => {
    if (openaire_items_pub.api) {
      const formattedResults = openaire_items_pub.api.map((item) =>
        formatOpenAire(item, 'publications', zotero_settings.default),
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
    }
  }, [openaire_items_pub]);

  useEffect(() => {
    if (openaire_items_rsd.api) {
      const formattedResults = openaire_items_rsd.api.map((item) =>
        formatOpenAire(item, 'rsd', zotero_settings.default),
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
    }
  }, [openaire_items_rsd]);

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
                  handleSaveItemToZotero(selectedItem);
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
      {showSearchResults ? (
        allSearchResults.length < openAireTotalResultsNumber ? (
          <Button primary onClick={handleLoadMore}>
            Load more
          </Button>
        ) : null
      ) : topCollectionFlag ? (
        zoteroCollectionsTotalResultsNumber > collections.length ? (
          <Button primary onClick={handleLoadMore}>
            Load more
          </Button>
        ) : null
      ) : zoteroCollectionsTotalResultsNumber + zoteroItemsTotalResultsNumber >
        composedItems.length ? (
        <Button primary onClick={handleLoadMore}>
          Load more
        </Button>
      ) : null}
    </div>
  );
};

export default ZoteroDataWrapper;
