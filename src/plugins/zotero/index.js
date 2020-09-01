// TODO! important! Read https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/

import codeSVG from '@plone/volto/icons/code.svg';
import React from 'react';
import { FOOTNOTE } from 'volto-slate/constants';
import FootnotesBlockEdit from './blocks/Footnote/FootnotesBlockEdit';
import FootnotesBlockView from './blocks/Footnote/FootnotesBlockView';
import { ZOTERO } from './constants';
import { withZotero } from './extensions';
import { zotero_editor } from './reducers';
import { ZoteroElement } from './render';
import ZoteroButton from './ZoteroButton';
import ZoteroContextButton from './ZoteroContextButton';
import ZoteroSidebarEditor from './ZoteroSidebarEditor';

export default (config) => {
  const { settings } = config;
  const { slate } = settings;

  config.addonReducers = {
    ...config.addonReducers,
    zotero_editor,
  };

  config.blocks.blocksConfig.slateFootnotes = {
    id: 'slateFootnotes',
    title: 'Slate Footnotes',
    icon: codeSVG,
    group: 'text',
    view: FootnotesBlockView,
    edit: FootnotesBlockEdit,
    restricted: false,
    mostUsed: true,
    blockHasOwnFocusManagement: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  config.settings.footnotes = [...(config.settings.footnotes || []), FOOTNOTE];

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
