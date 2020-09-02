import React from 'react';
import { useSlate } from 'slate-react';

import tagSVG from '@plone/volto/icons/blog-entry.svg';
import { ToolbarButton } from 'volto-slate/editor/ui';
import { isActiveZotero, insertZotero } from './utils';
import { hasRangeSelection } from 'volto-slate/utils';
import { EDITOR } from './constants';

import { useDispatch } from 'react-redux';

import './less/editor.less';

const ZoteroButton = ({ ...props }) => {
  const editor = useSlate();
  const isZotero = isActiveZotero(editor);
  const dispatch = useDispatch();

  return (
    <>
      {hasRangeSelection(editor) && (
        <ToolbarButton
          {...props}
          active={isZotero}
          onMouseDown={() => {
            dispatch({ type: EDITOR, show: true });
            if (!isZotero) insertZotero(editor, {});
          }}
          icon={tagSVG}
        />
      )}
    </>
  );
};

export default ZoteroButton;
