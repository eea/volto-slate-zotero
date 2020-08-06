import React from 'react';

import { ZoteroElement } from './render';
import ZoteroButton from './ZoteroButton';
import { withZotero } from './extensions';

export default (config) => {
  const { settings } = config;
  const { slate } = settings;

  slate.buttons.zotero = (props) => <ZoteroButton {...props} />;
  slate.elements.zotero = ZoteroElement;

  slate.extensions = [...(slate.extensions || []), withZotero];
  slate.toolbarButtons = [...(slate.toolbarButtons || []), 'zotero'];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    'zotero',
  ];

  slate.nodeTypesToHighlight.push('zotero');

  settings.footnotes = [...(settings.footnotes || []), 'zotero'];
  return config;
};
