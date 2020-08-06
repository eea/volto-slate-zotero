import { nanoid } from 'volto-slate/utils';
import { Transforms } from 'slate';

export const withZotero = (editor) => {
  const { isInline, normalizeNode } = editor;

  editor.isInline = (element) => {
    return element.type === 'zotero' ? true : isInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (node.type === 'zotero' && !node.data?.uid) {
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
