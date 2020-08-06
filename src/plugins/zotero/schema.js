export const ZoteroSchema = {
  title: 'Zotero entry',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['footnote'],
    },
  ],
  properties: {
    footnote: {
      title: 'Reference text',
      widget: 'textarea',
    },
  },
  required: ['footnote'],
};
