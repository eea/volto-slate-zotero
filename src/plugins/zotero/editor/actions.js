/* eslint no-console: ["error", { allow: ["error"] }] */
import { toast } from 'react-toastify';
import { ZOTERO_SETTINGS } from '../constants';

export function getZoteroSettings() {
  return {
    type: ZOTERO_SETTINGS,
    request: {
      op: 'get',
      path: `/@zotero`,
    },
  };
}

const testForErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const handleErrors = (response, component) => {
  console.error(
    'handleErrors',
    response.statusText || response.message,
    component,
  );
  toast.error(
    `Sorry an error has occurred. We have been notified and are looking into it. Please come back later and if the issue persists please contact the site administrator.`,
  );
  return response;
};

const handleSilentErrors = (response, component) => {
  if (Object.keys(response.failed).length > 0) {
    console.error('handleSilentErrors', response.failed[0].message);

    throw Error(response.failed[0].message);
  }
  return response;
};

// ZOTERO
export function fetchZoteroCollections(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroCollectionsPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
      .then((response) => testForErrors(response))
      .then((response) => {
        const totalResults = parseInt(
          response.headers.get('Total-Results'),
          10,
        );
        return new Promise((resolve, reject) => {
          response
            .json()
            .then((results) => resolve({ results, totalResults }))
            .catch((error) => reject(error));
        });
      })
      .then((data) => {
        return dispatch(setZoteroCollectionsSuccess(data));
      })
      .catch((error) => {
        handleErrors(error, 'Zotero Collections');
        dispatch(setZoteroCollectionsFail(error));
      });
  };
}
export function fetchZoteroSubCollections(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroSubCollectionsPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
      .then((response) => testForErrors(response))
      .then((response) => {
        const totalResults = parseInt(
          response.headers.get('Total-Results'),
          10,
        );
        return new Promise((resolve, reject) => {
          response
            .json()
            .then((results) => resolve({ results, totalResults }))
            .catch((error) => reject(error));
        });
      })
      .then((data) => {
        return dispatch(setZoteroSubCollectionsSuccess(data));
      })
      .catch((error) => {
        handleErrors(error, 'Zotero SubCollections');
        dispatch(setZoteroSubCollectionsFail(error));
      });
  };
}

export function fetchZoteroItems(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroItemsPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
      .then((response) => testForErrors(response))
      .then((response) => {
        const totalResults = parseInt(
          response.headers.get('Total-Results'),
          10,
        );
        return new Promise((resolve, reject) => {
          response
            .json()
            .then((results) => resolve({ results, totalResults }))
            .catch((error) => reject(error));
        });
      })
      .then((data) => dispatch(setZoteroItemsSuccess(data)))
      .catch((error) => {
        handleErrors(error, 'Zotero Items');
        dispatch(setZoteroItemsFail(error));
      });
  };
}

export function fetchZoteroSearchItems(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroSearchItemsPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
      .then((response) => testForErrors(response))
      .then((response) => {
        const totalResults = parseInt(
          response.headers.get('Total-Results'),
          10,
        );
        return new Promise((resolve, reject) => {
          response
            .json()
            .then((results) => resolve({ results, totalResults }))
            .catch((error) => reject(error));
        });
      })
      .then((result) => {
        dispatch(setZoteroSearchItemsSuccess(result));
      })
      .catch((error) => {
        handleErrors(error, 'Zotero Search Items');
        dispatch(setZoteroSearchItemsFail(error));
      });
  };
}

export function fetchOpenairePubSearchItems(openairePubUrlBase) {
  return (dispatch) => {
    dispatch(setOpenairePubSearchItemsPending());
    return fetch(openairePubUrlBase, {
      method: 'GET',
    })
      .then((response) => testForErrors(response))
      .then((response) => {
        return response.text();
      })
      .then((responseText) => {
        // Sometimes the result contains zero starting numbers like $: 0022324234
        // which make the JSON.parse give errors
        // if the response is parseable we will do the usual process
        // if not, we will replace the $ property to try and stringify the number
        try {
          const text = JSON.parse(responseText);
          dispatch(setOpenairePubSearchItemsSuccess(text));
        } catch (error) {
          // apparently regex will not direclty identify "$" so we replace the value
          const search = '$';
          const replaceWith = '__id_z';
          const chunkZ = responseText.replaceAll(search, replaceWith);

          const fixCode = /"__id_z" : (0[0-9]+) /g;
          const resultText = chunkZ.replaceAll(fixCode, (match, code) => {
            return '"__id_z": "' + code + '"';
          });
          // change it back to "$" to not modify the existing code and formatting
          const search1 = '__id_z';
          const replaceWith1 = '$';
          const resultParsed = JSON.parse(
            resultText.replaceAll(search1, replaceWith1),
          );
          dispatch(setOpenairePubSearchItemsSuccess(resultParsed));
        }
      })
      .catch((error) => {
        handleErrors(error, 'Openaire Publications Search Items');
        dispatch(setOpenairePubSearchItemsFail(error));
      });
  };
}
export function fetchOpenaireRsdSearchItems(openaireRsdUrlBase) {
  return (dispatch) => {
    dispatch(setOpenaireRsdSearchItemsPending());
    return fetch(openaireRsdUrlBase, {
      method: 'GET',
    })
      .then((response) => testForErrors(response))
      .then((response) => response.json())
      .then((resultRsd) => {
        dispatch(setOpenaireRsdSearchItemsSuccess(resultRsd));
      })
      .catch((error) => {
        handleErrors(error, 'Openaire Rsd Search Items');
        dispatch(setOpenaireRsdSearchItemsFail(error));
      });
  };
}
export function fetchZoteroItemCitation(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroItemCitationPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
      .then((response) => testForErrors(response))
      .then((response) => response.text())
      .then((result) => {
        dispatch(setZoteroItemCitationSuccess({ result }));
      })
      .catch((error) => {
        handleErrors(error, 'Zotero Item Citation');
        dispatch(setZoteroItemCitationFail(error));
      });
  };
}

export function saveItemToZotero(zoteroUrlBase, headers, body) {
  return (dispatch) => {
    dispatch(saveItemToZoteroPending());
    return fetch(zoteroUrlBase, {
      method: 'POST',
      headers,
      body,
    })
      .then((response) => testForErrors(response))
      .then((response) => response.json())
      .then((result) => {
        handleSilentErrors(result, 'Save Item to Zotero');
        dispatch(saveItemToZoteroSuccess(result));
      })
      .catch((error) => {
        handleErrors(error, 'Save Item to Zotero');
        dispatch(saveItemToZoteroFail(error));
      });
  };
}

// COLLECTIONS
function setZoteroCollectionsPending(data) {
  return {
    type: 'ZOTERO_COLLECTIONS_PENDING',
    result: data,
  };
}
function setZoteroCollectionsSuccess(data) {
  return {
    type: 'ZOTERO_COLLECTIONS_SUCCESS',
    result: data,
  };
}
function setZoteroCollectionsFail(data) {
  return {
    type: 'ZOTERO_COLLECTIONS_FAIL',
    result: data,
  };
}

function setZoteroSubCollectionsPending(data) {
  return {
    type: 'ZOTERO_SUB_COLLECTIONS_PENDING',
    result: data,
  };
}
function setZoteroSubCollectionsSuccess(data) {
  return {
    type: 'ZOTERO_SUB_COLLECTIONS_SUCCESS',
    result: data,
  };
}
function setZoteroSubCollectionsFail(data) {
  return {
    type: 'ZOTERO_SUB_COLLECTIONS_FAIL',
    result: data,
  };
}

// ITEMS
function saveItemToZoteroPending(data) {
  return {
    type: 'ZOTERO_ITEM_SAVED_PENDING',
    result: data,
  };
}

function saveItemToZoteroSuccess(data) {
  return {
    type: 'ZOTERO_ITEM_SAVED_SUCCESS',
    result: data,
  };
}

function saveItemToZoteroFail(data) {
  return {
    type: 'ZOTERO_ITEM_SAVED_FAIL',
    result: data,
  };
}

function setZoteroItemCitationPending(data) {
  return {
    type: 'ZOTERO_ITEM_CITATION_PENDING',
    result: data,
  };
}
function setZoteroItemCitationSuccess(data) {
  return {
    type: 'ZOTERO_ITEM_CITATION_SUCCESS',
    result: data,
  };
}
function setZoteroItemCitationFail(data) {
  return {
    type: 'ZOTERO_ITEM_CITATION_FAIL',
    result: data,
  };
}

function setZoteroItemsPending(data) {
  return {
    type: 'ZOTERO_ITEMS_PENDING',
    result: data,
  };
}

function setZoteroItemsSuccess(data) {
  return {
    type: 'ZOTERO_ITEMS_SUCCESS',
    result: data,
  };
}

function setZoteroItemsFail(data) {
  return {
    type: 'ZOTERO_ITEMS_FAIL',
    result: data,
  };
}
// ZOTERO_SEARCH
function setZoteroSearchItemsPending(data) {
  return {
    type: 'ZOTERO_SEARCH_ITEMS_PENDING',
    result: data,
  };
}

function setZoteroSearchItemsSuccess(results, totalResults) {
  return {
    type: 'ZOTERO_SEARCH_ITEMS_SUCCESS',
    result: { results, totalResults },
  };
}

function setZoteroSearchItemsFail(data) {
  return {
    type: 'ZOTERO_SEARCH_ITEMS_FAIL',
    result: data,
  };
}
// OPENAIRE_SEARCH
function setOpenairePubSearchItemsPending(data) {
  return {
    type: 'OPENAIRE_ITEMS_PUB_PENDING',
    result: data,
  };
}

function setOpenairePubSearchItemsSuccess(data) {
  return {
    type: 'OPENAIRE_ITEMS_PUB_SUCCESS',
    result: data,
  };
}

function setOpenairePubSearchItemsFail(data) {
  return {
    type: 'OPENAIRE_ITEMS_PUB_FAIL',
    result: data,
  };
}

function setOpenaireRsdSearchItemsPending(data) {
  return {
    type: 'OPENAIRE_ITEMS_RSD_PENDING',
    result: data,
  };
}

function setOpenaireRsdSearchItemsSuccess(data) {
  return {
    type: 'OPENAIRE_ITEMS_RSD_SUCCESS',
    result: data,
  };
}

function setOpenaireRsdSearchItemsFail(data) {
  return {
    type: 'OPENAIRE_ITEMS_RSD_FAIL',
    result: data,
  };
}
