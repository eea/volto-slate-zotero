import { EDITOR } from './constants';
import { ZOTERO_SETTINGS } from './constants';

const initialState = {};
const zoteroSettings = {
  api: null,
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
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${ZOTERO_SETTINGS}_FAIL`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
