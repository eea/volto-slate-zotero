import { makeInlineElementPlugin } from 'volto-slate/components/ElementEditor';
import { ZoteroEditorSchema } from './schema';
import { withZotero } from './extensions';
import { ZOTERO } from '../constants';
import { ZoteroElement } from './render';
import { defineMessages } from 'react-intl'; // , defineMessages
import tagSVG from '@plone/volto/icons/blog-entry.svg';
import { zotero_editor, zotero_settings } from './reducers';
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
  };

  const opts = {
    pluginId: ZOTERO,
    pluginEditor: ZoteroEditor,
    elementType: ZOTERO,
    element: ZoteroElement,
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

  slate.toolbarButtons = [...(slate.toolbarButtons || []), 'footnote'];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    'footnote',
  ];

  // const PersistentHelper = (props) => <SidebarEditor {...props} {...opts} />;

  // slate.persistentHelpers.push(PersistentHelper);

  return config;
}
