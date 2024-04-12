import { isEqual } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactEditor } from 'slate-react';
import { setPluginOptions } from '@plone/volto-slate/actions';
import { ZoteroEditorSchema } from './schema';
import ZoteroDataWrapper from './ZoteroDataWrapper';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState({});
  const {
    editor,
    getActiveElement,
    isActiveElement,
    pluginId,
    insertElement,
    unwrapElement,
  } = props;
  const active = getActiveElement(editor);
  const [zoteroNode] = active;
  const isZotero = isActiveElement(editor);
  const pid = `${editor.uid}-${pluginId}`;

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
    [editor], // eslint-disable-line
  );

  const checkForCancel = () => {
    if (!zoteroNode.data.footnote) {
      unwrapElement(editor);
    }
  };

  return (
    <ZoteroDataWrapper
      title={ZoteroEditorSchema.title}
      schema={ZoteroEditorSchema}
      formData={formData}
      submitHandler={(newFormData) => {
        saveDataToEditor(newFormData);
        dispatch(setPluginOptions(pid, { show_sidebar_editor: false }));

        ReactEditor.focus(editor);
      }}
      clearHandler={() => {
        setFormData({});
        checkForCancel();
        dispatch(setPluginOptions(pid, { show_sidebar_editor: false }));

        ReactEditor.focus(editor);
      }}
    ></ZoteroDataWrapper>
  );
};
