import tagSVG from '@plone/volto/icons/blog-entry.svg';
import { defineMessages } from 'react-intl'; // , defineMessages
import { makeInlineElementPlugin } from 'volto-slate/components/ElementEditor';
import { FootnoteElement } from '../../../../../volto-slate-footnote/src/editor/render';
import { ZOTERO } from '../constants';
import { withZotero } from './extensions';
import {
  openaire_items_pub,
  openaire_items_rsd,
  zotero_collections,
  zotero_editor,
  zotero_items,
  zotero_search_items,
  zotero_settings
} from './reducers';
import { ZoteroEditorSchema } from './schema';
import ZoteroEditor from './ZoteroEditor';

const messages = defineMessages({
  edit: {
    id: 'Edit citation',
    defaultMessage: 'Edit citation',
  },
  delete: {
    id: 'Remove citation',
    defaultMessage: 'Remove citation',
  },
});

export default function install(config) {
  config.addonReducers = {
    ...config.addonReducers,
    zotero_editor,
    zotero_settings,
    zotero_collections,
    zotero_items,
    openaire_items_pub,
    openaire_items_rsd,
    zotero_search_items,
  };

  const opts = {
    pluginId: ZOTERO,
    pluginEditor: ZoteroEditor,
    elementType: ZOTERO,
    element: FootnoteElement,
    isInlineElement: true,
    editSchema: ZoteroEditorSchema,
    extensions: [withZotero],
    hasValue: (formData) => !!formData.footnote,
    toolbarButtonIcon: tagSVG,
    messages,
  };
  const [installZoteroFootnoteEditor] = makeInlineElementPlugin(opts);
  config = installZoteroFootnoteEditor(config);

  const { slate } = config.settings;

  slate.toolbarButtons = [...(slate.toolbarButtons || []), 'zotero'];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    'zotero',
  ];

  return config;
}
