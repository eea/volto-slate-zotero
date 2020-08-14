import React from 'react';
import InlineForm from 'volto-slate/futurevolto/InlineForm';
import { ZoteroSchema } from './schema';
import { Icon as VoltoIcon } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import { ReactEditor } from 'slate-react';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import { useSlate } from 'slate-react';
import { isEqual } from 'lodash';

import {
  unwrapZotero,
  insertZotero,
  isActiveZotero,
  getActiveZotero,
} from './utils';
import { EDITOR } from './constants';
import { useDispatch } from 'react-redux';

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
    <InlineForm
      schema={ZoteroSchema}
      title={ZoteroSchema.title}
      icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
      onChangeField={(id, value) => {
        setFormData({
          ...formData,
          [id]: value,
        });
      }}
      formData={formData}
      headerActions={
        <>
          <button
            onClick={() => {
              saveDataToEditor(formData);
              dispatch({ type: EDITOR, show: false });
              ReactEditor.focus(editor);
            }}
          >
            <VoltoIcon size="24px" name={checkSVG} />
          </button>
          <button
            onClick={() => {
              dispatch({ type: EDITOR, show: false });
              setFormData({});
              ReactEditor.focus(editor);
            }}
          >
            <VoltoIcon size="24px" name={clearSVG} />
          </button>
        </>
      }
    />
  );
};
