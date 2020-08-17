import React from 'react';

export const ZoteroElement = ({ attributes, children, element, mode }) => {
  const { data = {} } = element;
  const { uid = 'undefined' } = data;

  return (
    <>
      {mode === 'view' ? (
        <a
          href={`#footnote-${uid}`}
          id={`ref-${uid}`}
          aria-describedby="footnote-label"
        >
          {children}
        </a>
      ) : (
        <span {...attributes} className="footnote zotero-edit-node">
          {children}
        </span>
      )}
    </>
  );
};
