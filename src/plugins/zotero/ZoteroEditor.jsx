import { isEqual } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactEditor, useSlate } from 'slate-react';
import { EDITOR } from './constants';
import { ZoteroSchema } from './schema';
import {
  getActiveZotero,
  insertZotero,
  isActiveZotero,
  unwrapZotero
} from './utils';
import ZoteroDataWrapper from './ZoteroDataWrapper';

export default (props) => {
  const dispatch = useDispatch();
  const editor = useSlate();
  const [formData, setFormData] = React.useState({});

  const active = getActiveZotero(editor);
  const [zoteroNode] = active;
  const isZotero = isActiveZotero(editor);

  // Update the form data based on the current zotero
  const zoteroRef = React.useRef(null);
  React.useEffect(() => {
    if (isZotero && !isEqual(zoteroNode, zoteroRef.current)) {
      zoteroRef.current = zoteroNode;
      setFormData(zoteroNode.data || {});
    } else if (!isZotero) {
      zoteroRef.current = null;
    }
  }, [zoteroNode, isZotero, dispatch]);

  const saveDataToEditor = React.useCallback(
    (formData) => {
      if (formData.footnote) {
        insertZotero(editor, formData);
      } else {
        unwrapZotero(editor);
      }
    },
    [editor],
  );

  return (
    <ZoteroDataWrapper
      title={ZoteroSchema.title}
      schema={ZoteroSchema}
      formData={formData}
      submitHandler={(newFormData) => {
        saveDataToEditor(newFormData);
        dispatch({ type: EDITOR, show: false });
        ReactEditor.focus(editor);
      }}
      clearHandler={() => {
        dispatch({ type: EDITOR, show: false });
        setFormData({});
        ReactEditor.focus(editor);
      }}
    ></ZoteroDataWrapper>
  );
};
