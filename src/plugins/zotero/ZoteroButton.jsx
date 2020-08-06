import { Button } from 'semantic-ui-react';
import React from 'react';
import { useSlate } from 'slate-react';
import { Editor, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import SidebarPopup from 'volto-slate/futurevolto/SidebarPopup';

import { Icon as VoltoIcon } from '@plone/volto/components';
import tagSVG from '@plone/volto/icons/blog-entry.svg';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import { Icon } from '@plone/volto/components';

import InlineForm from 'volto-slate/futurevolto/InlineForm';

import { ToolbarButton } from 'volto-slate/editor/ui';
import { ZoteroSchema } from './schema';
import { useIntl, defineMessages } from 'react-intl';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import editingSVG from '@plone/volto/icons/editing.svg';
import usePluginToolbar from 'volto-slate/editor/usePluginToolbar';

import './less/editor.less';

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

export const wrapCitation = (editor, data) => {
  if (isActiveCitation(editor)) {
    unwrapCitation(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const citation = {
    type: 'zotero',
    data,
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, { ...citation, children: [{ text: '' }] });
  } else {
    Transforms.wrapNodes(editor, citation, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

function insertCitation(editor, data) {
  if (editor.selection) {
    wrapCitation(editor, data);
  }
}

export const unwrapCitation = (editor) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === 'zotero' });
};

export const isActiveCitation = (editor) => {
  const [note] = Editor.nodes(editor, { match: (n) => n.type === 'zotero' });

  return !!note;
};

export const getActiveCitation = (editor) => {
  const [node] = Editor.nodes(editor, { match: (n) => n.type === 'zotero' });
  return node;
};

export const updateCitationsContextFromActiveCitation = (
  editor,
  {
    setFormData,
    setAndSaveSelection,
    saveSelection = true,
    clearIfNoActiveFootnote = true,
  },
) => {
  if (saveSelection) {
    setAndSaveSelection(editor.selection);
  }

  const note = getActiveCitation(editor);
  if (note) {
    const [node] = note;
    const { data } = node;

    const r = {
      ...data,
    };

    setFormData(r);
  } else if (editor.selection && clearIfNoActiveFootnote) {
    setFormData({});
  }
};

const ZoteroButton = () => {
  const editor = useSlate();
  const intl = useIntl();

  const isCitation = isActiveCitation(editor);

  const [showEditForm, setShowEditForm] = React.useState(false);
  const [selection, setSelection] = React.useState(null);
  const [formData, setFormData] = React.useState({});

  const setAndSaveSelection = React.useCallback((sel) => {
    setSelection(sel);
    setShowEditForm(false);
  }, []);

  const submitHandler = React.useCallback(
    (formData) => {
      // TODO: have an algorithm that decides which one is used
      if (formData.footnote) {
        // const sel = footnoteRef.current.getSelection();
        const sel = selection; // should we save selection?
        if (Range.isRange(sel)) {
          Transforms.select(editor, sel);
          insertCitation(editor, { ...formData });
        } else {
          Transforms.deselect(editor);
        }
      } else {
        unwrapCitation(editor);
      }
    },
    [editor, selection],
  );

  const PluginToolbar = React.useCallback(
    () => (
      <>
        <Button.Group>
          <Button
            icon
            basic
            aria-label={intl.formatMessage(messages.edit)}
            onMouseDown={() => {
              if (!showEditForm) {
                updateCitationsContextFromActiveCitation(editor, {
                  // setAndSaveSelection: setSelection,
                  setAndSaveSelection,
                  setFormData,
                });

                setShowEditForm(true);
                // ReactEditor.focus(editor);
              }
            }}
          >
            <Icon name={editingSVG} size="18px" />
          </Button>
        </Button.Group>
        <Button.Group>
          <Button
            icon
            basic
            aria-label={intl.formatMessage(messages.delete)}
            onMouseDown={() => {
              unwrapCitation(editor);
              ReactEditor.focus(editor);
            }}
          >
            <Icon name={clearSVG} size="18px" />
          </Button>
        </Button.Group>
      </>
    ),
    [editor, intl, setAndSaveSelection, showEditForm],
  );

  usePluginToolbar(editor, isActiveCitation, getActiveCitation, PluginToolbar);

  return (
    <>
      <SidebarPopup open={showEditForm}>
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
                  setShowEditForm(false);
                  submitHandler(formData);
                  ReactEditor.focus(editor);
                }}
              >
                <VoltoIcon size="24px" name={checkSVG} />
              </button>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  ReactEditor.focus(editor);
                }}
              >
                <VoltoIcon size="24px" name={clearSVG} />
              </button>
            </>
          }
        />
      </SidebarPopup>

      <ToolbarButton
        active={isCitation}
        disabled={isCitation}
        onMouseDown={() => {
          const note = getActiveCitation(editor);
          if (note) {
          } else {
            insertCitation(editor, {});
            setFormData({});
            setShowEditForm(true);
          }
        }}
        icon={tagSVG}
      />
    </>
  );
};

export default ZoteroButton;
