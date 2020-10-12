import { ZOTERO } from './constants';
import installZoteroFootnoteEditor from './editor';
import './less/editor.less';

/**
 * @summary Called from Volto to configure new or existing Volto block types.
 * @param {object} config The object received from Volto containing the
 * configuration for all the blocks.
 */
export default function install(config) {
  config.settings.footnotes = [...(config.settings.footnotes || []), ZOTERO];
  config = installZoteroFootnoteEditor(config);
  return config;
}
