import { vi } from 'vitest';
import {
  getZoteroSettings,
  fetchZoteroCollections,
  fetchZoteroItems,
  fetchOpenairePubSearchItems,
  fetchOpenaireRsdSearchItems,
} from './actions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ZOTERO_SETTINGS } from '@eeacms/volto-slate-zotero/plugins/zotero/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

global.fetch = vi.fn();

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('Zotero and Openaire actions', () => {
  afterEach(() => {
    vi.clearAllMocks();
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
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
      headers: {
        get: vi.fn().mockReturnValue(0),
      },
    });

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
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
      headers: {
        get: vi.fn().mockReturnValue(0),
      },
    });

    const store = mockStore({});
    await store.dispatch(fetchZoteroItems('url', {}));
    expect(store.getActions()).toContainEqual({ type: 'ZOTERO_ITEMS_PENDING' });
    expect(store.getActions()).toContainEqual({
      type: 'ZOTERO_ITEMS_SUCCESS',
      result: { results: {}, totalResults: 0 },
    });
  });

  it('fetchOpenairePubSearchItems dispatches pending and success for valid JSON responses', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('{"response":{"numFound":"1"}}'),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('{"response":{"numFound":"2"}}'),
      });

    const store = mockStore({});
    await store.dispatch(
      fetchOpenairePubSearchItems([
        'https://api.openaire.eu/search/publications/?author=test',
        'https://api.openaire.eu/search/publications/?title=test',
      ]),
    );
    await flushPromises();

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'OPENAIRE_ITEMS_PUB_PENDING',
      result: undefined,
    });
    expect(actions[1].type).toBe('OPENAIRE_ITEMS_PUB_SUCCESS');
    expect(actions[1].result).toHaveLength(2);
    expect(actions[1].result[0]).toEqual({ response: { numFound: '1' } });
    expect(actions[1].result[1]).toEqual({ response: { numFound: '2' } });
  });

  it('fetchOpenaireRsdSearchItems repairs malformed JSON payloads and dispatches success', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(
          '{"response":{"results":[{"$" : 0022324234 ,"title":"Item"}]}}',
        ),
    });

    const store = mockStore({});
    await store.dispatch(
      fetchOpenaireRsdSearchItems([
        'https://api.openaire.eu/search/datasets/?author=forest',
      ]),
    );
    await flushPromises();

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'OPENAIRE_ITEMS_RSD_PENDING',
      result: undefined,
    });
    expect(actions[1].type).toBe('OPENAIRE_ITEMS_RSD_SUCCESS');
    expect(actions[1].result).toHaveLength(1);
    expect(actions[1].result[0].response.results[0].$).toBe('0022324234');
  });

  it('fetchOpenaireRsdSearchItems dispatches fail when request errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    });

    const store = mockStore({});
    await store.dispatch(
      fetchOpenaireRsdSearchItems([
        'https://api.openaire.eu/search/datasets/?author=forest',
      ]),
    );
    await flushPromises();

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'OPENAIRE_ITEMS_RSD_PENDING',
      result: undefined,
    });
    expect(actions[1].type).toBe('OPENAIRE_ITEMS_RSD_FAIL');
    expect(String(actions[1].result)).toContain('Bad Request');
  });
});
