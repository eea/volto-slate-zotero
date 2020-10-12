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

// ZOTERO
export function fetchZoteroCollections(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroCollectionsPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
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
      .catch((error) => dispatch(setZoteroCollectionsFail(error)));
  };
}

export function fetchZoteroItems(zoteroUrlBase, headers) {
  return (dispatch) => {
    dispatch(setZoteroItemsPending());
    return fetch(zoteroUrlBase, {
      method: 'GET',
      headers,
    })
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
      .then((response) => response.json())
      .then((result) => {
        dispatch(setOpenaireRsdSearchItemsSuccess(result));
      })
      .catch((error) => dispatch(setOpenaireRsdSearchItemsFail(error)));
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
// ITEMS
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
