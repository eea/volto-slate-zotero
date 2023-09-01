import {
  EDITOR,
  OPENAIRE_ITEMS_PUB,
  OPENAIRE_ITEMS_RSD,
  ZOTERO_COLLECTIONS,
  ZOTERO_ITEMS,
  ZOTERO_ITEM_CITATION,
  ZOTERO_ITEM_SAVED,
  ZOTERO_SEARCH_ITEMS,
  ZOTERO_SETTINGS,
  ZOTERO_SUB_COLLECTIONS,
} from '../constants';

const initialState = {};
const zoteroSettings = {
  api: null,
  get: {
    loading: false,
    loaded: false,
    error: null,
  },
};
const zoteroItemCitation = {
  api: null,
  get: {
    loading: false,
    loaded: false,
    error: null,
  },
};
const zoteroItemSaved = {
  api: null,
  get: {
    loading: false,
    loaded: false,
    error: null,
  },
};
const zoteroCollections = {
  api: null,
  totalResults: null,
  get: {
    loading: false,
    loaded: false,
    error: null,
  },
};
const zoteroItems = {
  api: null,
  totalResults: null,
  get: {
    loading: false,
    loaded: false,
    error: null,
  },
};
const zoteroSearchItems = {
  api: null,
  totalResults: null,
  get: {
    loading: false,
    loaded: false,
    error: null,
  },
};
const openaireItems = {
  api: null,
  totalResults: null,
  get: {
    loading: false,
    loaded: false,
    error: null,
  },
};

function getRequestKey(actionType) {
  return actionType.split('_')[0].toLowerCase();
}

export function zotero_editor(state = initialState, action = {}) {
  switch (action.type) {
    case EDITOR:
      return {
        ...state,
        show: action.show,
      };
    default:
      return state;
  }
}

export function zotero_item_citation(state = zoteroItemCitation, action = {}) {
  switch (action.type) {
    case `${ZOTERO_ITEM_CITATION}_PENDING`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${ZOTERO_ITEM_CITATION}_SUCCESS`:
      return {
        ...state,
        api: { ...action.result },
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${ZOTERO_ITEM_CITATION}_FAIL`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export function zotero_settings(state = zoteroSettings, action = {}) {
  switch (action.type) {
    case `${ZOTERO_SETTINGS}_PENDING`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${ZOTERO_SETTINGS}_SUCCESS`:
      return {
        ...state,
        api: { ...action.result },
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${ZOTERO_SETTINGS}_FAIL`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export function zotero_item_saved(state = zoteroItemSaved, action = {}) {
  switch (action.type) {
    case `${ZOTERO_ITEM_SAVED}_PENDING`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${ZOTERO_ITEM_SAVED}_SUCCESS`:
      return {
        ...state,
        api: { ...action.result },
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${ZOTERO_ITEM_SAVED}_FAIL`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.result,
        },
      };
    default:
      return state;
  }
}

export function zotero_collections(state = zoteroCollections, action = {}) {
  switch (action.type) {
    case `${ZOTERO_COLLECTIONS}_PENDING`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${ZOTERO_COLLECTIONS}_SUCCESS`:
      return {
        ...state,
        api: { ...action.result },
        totalResults: action.result.totalResults,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${ZOTERO_COLLECTIONS}_FAIL`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export function zotero_sub_collections(state = zoteroCollections, action = {}) {
  switch (action.type) {
    case `${ZOTERO_SUB_COLLECTIONS}_PENDING`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${ZOTERO_SUB_COLLECTIONS}_SUCCESS`:
      return {
        ...state,
        api: { ...action.result },
        totalResults: action.result.totalResults,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${ZOTERO_SUB_COLLECTIONS}_FAIL`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export function zotero_items(state = zoteroItems, action = {}) {
  switch (action.type) {
    case `${ZOTERO_ITEMS}_PENDING`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${ZOTERO_ITEMS}_SUCCESS`:
      return {
        ...state,
        api: { ...action.result },
        totalResults: action.result.totalResults,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${ZOTERO_ITEMS}_FAIL`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export function zotero_search_items(state = zoteroSearchItems, action = {}) {
  switch (action.type) {
    case `${ZOTERO_SEARCH_ITEMS}_PENDING`:
      return {
        ...state,
        api: null,
        totalResults: null,
        get: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${ZOTERO_SEARCH_ITEMS}_SUCCESS`:
      return {
        ...state,
        api: { ...action.result.results },
        totalResults: action.result.totalResults,
        get: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${ZOTERO_SEARCH_ITEMS}_FAIL`:
      return {
        ...state,
        api: null,
        totalResults: null,
        get: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export function openaire_items_pub(state = openaireItems, action = {}) {
  switch (action.type) {
    case `${OPENAIRE_ITEMS_PUB}_PENDING`:
      return {
        ...state,
        api: null,
        totalResults: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${OPENAIRE_ITEMS_PUB}_SUCCESS`:
      const api = action.result.reduce((accumulator, currentValue) => {
        const x = currentValue.response?.results?.result || [];
        return [...accumulator, ...x];
      }, []);
      const totalResults = action.result.reduce((accumulator, currentValue) => {
        const x = parseInt(currentValue.response?.header?.total?.$) || 0;
        return accumulator + x;
      }, 0);
      return {
        ...state,
        api,
        totalResults,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${OPENAIRE_ITEMS_PUB}_FAIL`:
      return {
        ...state,
        api: null,
        totalResults: null,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export function openaire_items_rsd(state = openaireItems, action = {}) {
  switch (action.type) {
    case `${OPENAIRE_ITEMS_RSD}_PENDING`:
      return {
        ...state,
        api: null,
        totalResults: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${OPENAIRE_ITEMS_RSD}_SUCCESS`:
      const api = action.result.reduce((accumulator, currentValue) => {
        const x = currentValue.response?.results?.result || [];
        return [...accumulator, ...x];
      }, []);
      const totalResults = action.result.reduce((accumulator, currentValue) => {
        const x = parseInt(currentValue.response?.header?.total?.$) || 0;
        return accumulator + x;
      }, 0);
      return {
        ...state,
        api,
        totalResults,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${OPENAIRE_ITEMS_RSD}_FAIL`:
      return {
        ...state,
        api: null,
        totalResults: null,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
