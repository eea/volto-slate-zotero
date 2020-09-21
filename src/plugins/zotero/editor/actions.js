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
