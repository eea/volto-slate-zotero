import { Editor, Transforms } from 'slate'; // Range,
import { ZOTERO } from './constants';

export function insertZotero(editor, data) {
  if (editor.savedSelection) {
    const selection = editor.savedSelection;

    const selPathRef = Editor.pathRef(editor, selection.anchor.path);

    const res = Array.from(
      Editor.nodes(editor, {
        match: (n) => n.type === ZOTERO,
        mode: 'highest',
        at: selection,
      }),
    );

    if (res.length) {
      const [, path] = res[0];
      Transforms.setNodes(
        editor,
        { data },
        {
          at: path ? path : null,
          match: path ? (n) => n.type === ZOTERO : null,
        },
      );
      // Transforms.collapse(editor, { edge: 'end' });
    } else {
      Transforms.wrapNodes(
        editor,
        { type: ZOTERO, data },
        { split: true, at: selection },
      );
    }

    if (data) {
      // If there's data, the footnote has been edited, otherwise it's a new footnote and we want to edit it
      Transforms.select(editor, selPathRef.current);
      Transforms.collapse(editor); // TODO; collapse to original offset
    }
  }
}
export const unwrapZotero = (editor) => {
  const selection = editor.selection || editor.savedSelection;
  Transforms.select(editor, selection);
  Transforms.unwrapNodes(editor, {
    match: (n) => n.type === ZOTERO,
    at: selection,
  });
};

export const isActiveZotero = (editor) => {
  const selection = editor.selection || editor.savedSelection;
  const [note] = Editor.nodes(editor, {
    match: (n) => n.type === ZOTERO,
    at: selection,
  });

  return !!note;
};

export const getActiveZotero = (editor) => {
  const selection = editor.selection || editor.savedSelection;
  const [node] = Editor.nodes(editor, {
    match: (n) => n.type === ZOTERO,
    at: selection,
  });
  return node;
};
