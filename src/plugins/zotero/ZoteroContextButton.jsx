import React from 'react';
import editingSVG from '@plone/volto/icons/editing.svg';
import { useIntl, defineMessages } from 'react-intl';
import { isActiveZotero, unwrapZotero } from './utils';
import clearSVG from '@plone/volto/icons/delete.svg';
import { ToolbarButton } from 'volto-slate/editor/ui';
import { EDITOR } from './constants';
import { useDispatch, useSelector } from 'react-redux';

const messages = defineMessages({
  edit: {
    id: 'Edit citation',
    defaultMessage: 'Edit citation',
  },
  delete: {
    id: 'Delete citation',
    defaultMessage: 'Delete citation',
  },
});

export default (editor) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const showEditor = useSelector((state) => state['zotero_editor']?.show);

  return isActiveZotero(editor) ? (
    <React.Fragment key="zotero">
      <ToolbarButton
        icon={editingSVG}
        active={showEditor}
        aria-label={intl.formatMessage(messages.edit)}
        onMouseDown={() => {
          dispatch({ type: EDITOR, show: true });
        }}
      />
      <ToolbarButton
        icon={clearSVG}
        aria-label={intl.formatMessage(messages.delete)}
        alt={intl.formatMessage(messages.delete)}
        onMouseDown={() => {
          unwrapZotero(editor);
        }}
      />
    </React.Fragment>
  ) : (
    ''
  );
};
