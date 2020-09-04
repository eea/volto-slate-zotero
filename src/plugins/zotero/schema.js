export const ZoteroSchema = {
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
