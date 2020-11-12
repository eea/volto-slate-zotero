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

const handleErrors = (response, component) => {
  if (!response.ok) {
    console.error('handleErrors', response.statusText); // add the url
    // toast.error(`Error ${component}: ${response.statusText}`);
    toast.error(
      `Sorry an error has occurred. We have been notified and are looking into it. Please come back later and if the issue persists please contact the site administrator.`,
    );
    throw Error(response.statusText);
  }
  return response;
};

const handleSilentErrors = (response, component) => {
  if (Object.keys(response.failed).length > 0) {
    console.error('handleSilentErrors', response.failed[0].message);
    toast.error(
      `Sorry an error has occurred. We have been notified and are looking into it. Please come back later and if the issue persists please contact the site administrator.`,
    );
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
      .then((response) => handleErrors(response, 'Zotero Collections'))
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
      .then((response) => handleErrors(response, 'Zotero SubCollections'))
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
      .catch((error) => dispatch(setZoteroSubCollectionsFail(error)));
  };
}

export function fetchZoteroItems(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroItemsPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
      .then((response) => handleErrors(response, 'Zotero Items'))
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
      .catch((error) => dispatch(setZoteroItemsFail(error)));
  };
}

export function fetchZoteroSearchItems(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroSearchItemsPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
      .then((response) => handleErrors(response, 'Zotero Search Items'))
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
      .catch((error) => dispatch(setZoteroSearchItemsFail(error)));
  };
}

export function fetchOpenairePubSearchItems(openairePubUrlBase) {
  return (dispatch) => {
    dispatch(setOpenairePubSearchItemsPending());
    return fetch(openairePubUrlBase, {
      method: 'GET',
    })
      .then((response) =>
        handleErrors(response, 'Openaire Publications Search Items'),
      )
      .then((response) => response.json())
      .then((result) => {
        dispatch(setOpenairePubSearchItemsSuccess(result));
      })
      .catch((error) => dispatch(setOpenairePubSearchItemsFail(error)));
  };
}
export function fetchOpenaireRsdSearchItems(openaireRsdUrlBase) {
  return (dispatch) => {
    dispatch(setOpenaireRsdSearchItemsPending());
    return fetch(openaireRsdUrlBase, {
      method: 'GET',
    })
      .then((response) => handleErrors(response, 'Openaire Rsd Search Items'))
      .then((response) => response.json())
      .then((result) => {
        dispatch(setOpenaireRsdSearchItemsSuccess(result));
      })
      .catch((error) => dispatch(setOpenaireRsdSearchItemsFail(error)));
  };
}
export function fetchZoteroItemCitation(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroItemCitationPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
      .then((response) => handleErrors(response, 'Zotero Item Citation'))
      .then((response) => response.text())
      .then((result) => {
        dispatch(setZoteroItemCitationSuccess({ result }));
      })
      .catch((error) => dispatch(setZoteroItemCitationFail(error)));
  };
}

export function saveItemToZotero(zoteroUrlBase, headers, body) {
  console.error('saveItemToZotero', body);
  return (dispatch) => {
    dispatch(saveItemToZoteroPending());
    return fetch(zoteroUrlBase, {
      method: 'POST',
      headers,
      body,
    })
      .then((response) => handleErrors(response, 'Save Item to Zotero'))
      .then((response) => response.json())
      .then((result) => {
        handleSilentErrors(result, 'Save Item to Zotero');
        dispatch(saveItemToZoteroSuccess(result));
      })
      .catch((error) => dispatch(saveItemToZoteroFail(error)));
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
