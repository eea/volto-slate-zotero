/**
 * A small wrapper around ZoteroEditor. Its purpose it to allow for clearer
 * code, otherwise it would mix too many hooks and it's not possible to render
 * a variable number of hooks in a component
 */
import React from 'react';
import SidebarPopup from 'volto-slate/futurevolto/SidebarPopup';
import { useSelector, useDispatch } from 'react-redux';
import ZoteroEditor from './ZoteroEditor';
import { getActiveZotero } from './utils';
import { useSlate } from 'slate-react';
import { EDITOR } from './constants';

const ZoteroSidebarEditor = (props) => {
  const showEditor = useSelector((state) => state['zotero_editor']?.show);
  const editor = useSlate();
  const dispatch = useDispatch();

  const active = getActiveZotero(editor);

  React.useEffect(() => {
    if (!active) dispatch({ type: EDITOR, show: false });
  }, [active, dispatch]);

  return showEditor && active ? (
    <SidebarPopup open={true}>
      <ZoteroEditor />
    </SidebarPopup>
  ) : (
    ''
  );
};

export default ZoteroSidebarEditor;
