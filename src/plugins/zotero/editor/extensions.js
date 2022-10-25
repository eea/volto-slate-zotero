import { ZOTERO } from '../constants';
import { nanoid } from '@plone/volto-slate/utils';
import { Transforms } from 'slate';

export const withZotero = (editor) => {
  const { normalizeNode, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === ZOTERO ? true : isInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (node.type === ZOTERO && !node.data?.uid) {
      Transforms.setNodes(
        editor,
        {
          data: {
            uid: nanoid(5),
            footnote: node.data?.footnote,
          },
        },
        {
          at: path,
        },
      );
    }
    return normalizeNode(entry);
  };

  return editor;
};
