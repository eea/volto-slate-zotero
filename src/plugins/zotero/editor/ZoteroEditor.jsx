import { isEqual } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactEditor } from 'slate-react';
import { EDITOR } from '../constants';
import { ZoteroEditorSchema } from './schema';
import ZoteroDataWrapper from './ZoteroDataWrapper';

export default (props) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState({});
  const {
    editor,
    getActiveElement,
    isActiveElement,
    insertElement,
    unwrapElement,
  } = props;
  const active = getActiveElement(editor);
  const [zoteroNode] = active;
  const isZotero = isActiveElement(editor);

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
        insertElement(editor, formData);
      } else {
        unwrapElement(editor);
      }
    },
    [editor],
  );

  return (
    <ZoteroDataWrapper
      title={ZoteroEditorSchema.title}
      schema={ZoteroEditorSchema}
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
