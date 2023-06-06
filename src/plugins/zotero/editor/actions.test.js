import {
  getZoteroSettings,
  fetchZoteroCollections,
  fetchZoteroItems,
} from './actions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ZOTERO_SETTINGS } from '../constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    headers: {
      get: jest.fn().mockReturnValue(0),
    },
  }),
);

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('Zotero and Openaire actions', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it('getZoteroSettings returns correct action', () => {
    const expectedAction = {
      type: ZOTERO_SETTINGS,
      request: {
        op: 'get',
        path: `/@zotero`,
      },
    };
    expect(getZoteroSettings()).toEqual(expectedAction);
  });

  it('fetchZoteroCollections dispatches correct actions on success', async () => {
    const store = mockStore({});
    await store.dispatch(fetchZoteroCollections('url', {}));
    expect(store.getActions()).toContainEqual({
      type: 'ZOTERO_COLLECTIONS_PENDING',
    });
    expect(store.getActions()).toContainEqual({
      type: 'ZOTERO_COLLECTIONS_SUCCESS',
      result: { results: {}, totalResults: 0 },
    });
  });

  it('fetchZoteroItems dispatches correct actions on success', async () => {
    const store = mockStore({});
    await store.dispatch(fetchZoteroItems('url', {}));
    expect(store.getActions()).toContainEqual({ type: 'ZOTERO_ITEMS_PENDING' });
    expect(store.getActions()).toContainEqual({
      type: 'ZOTERO_ITEMS_SUCCESS',
      result: { results: {}, totalResults: 0 },
    });
  });
});
