export const ZoteroEditorSchema = {
  title: 'Zotero citation',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['footnoteTitle'],
    },
  ],
  properties: {
    footnoteTitle: {
      title: 'Reference text',
      widget: 'textarea',
    },
  },
  required: [],
};
