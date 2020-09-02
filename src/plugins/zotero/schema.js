export const ZoteroSchema = {
  title: 'Footnote entry',
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
