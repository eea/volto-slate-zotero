// TODO! important! Read https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/

import React from 'react';

import { ZoteroElement } from './render';
import ZoteroButton from './ZoteroButton';
import ZoteroContextButton from './ZoteroContextButton';
import { withZotero } from './extensions';
import { ZOTERO } from './constants';
import { zotero_editor } from './reducers';
import ZoteroSidebarEditor from './ZoteroSidebarEditor';

export default (config) => {
  const { settings } = config;
  const { slate } = settings;

  config.addonReducers = {
    ...config.addonReducers,
    zotero_editor,
  };

  slate.buttons.zotero = (props) => (
    <ZoteroButton {...props} title="Insert citation" />
  );
  slate.elements.zotero = ZoteroElement;

  slate.extensions = [...(slate.extensions || []), withZotero];
  slate.toolbarButtons = [...(slate.toolbarButtons || []), 'zotero'];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    'zotero',
  ];

  slate.contextToolbarButtons.push(ZoteroContextButton);
  slate.persistentHelpers.push(ZoteroSidebarEditor);

  slate.nodeTypesToHighlight.push(ZOTERO);

  settings.footnotes = [...(settings.footnotes || []), ZOTERO];
  return config;
};
