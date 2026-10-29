import {
  findDOI,
  formatCitation,
  makeOpenAireUrlObj,
  formatOpenAire,
} from './utils';

describe('findDOI', () => {
  it('returns an array of DOIs', () => {
    const str = 'Test DOI: 10.1000/test';
    const expected = ['10.1000/test'];
    expect(findDOI(str)).toEqual(expected);
  });

  it('returns nothing', () => {
    const str = '';
    const expected = undefined;
    expect(findDOI(str)).toEqual(expected);
  });
});

describe('formatCitation', () => {
  it('formats a citation correctly with name', () => {
    const selectedItem = {
      data: {
        creators: [{ name: 'John Doe' }],
        date: '2023',
        title: 'Example Title',
      },
    };
    const expected = 'John Doe,  2023,  Example Title';
    expect(formatCitation(selectedItem)).toBe(expected);
  });

  it('formats a citation correctly with lastName and firstName', () => {
    const selectedItem = {
      data: {
        creators: [{ lastName: 'Doe', firstName: 'John' }],
        date: '2023',
        title: 'Example Title',
      },
    };
    const expected = 'Doe, John,  2023,  Example Title';
    expect(formatCitation(selectedItem)).toBe(expected);
  });

  it('formats a citation correctly with lastName', () => {
    const selectedItem = {
      data: {
        creators: [{ lastName: 'Doe' }],
        date: '2023',
        title: 'Example Title',
      },
    };
    const expected = 'Doe,  2023,  Example Title';
    expect(formatCitation(selectedItem)).toBe(expected);
  });

  it('formats a citation correctly with firstName and publicationTitle', () => {
    const selectedItem = {
      data: {
        creators: [{ firstName: 'John' }],
        date: '2023',
        name: 'Example Name',
        publicationTitle: 'Example Publication Title',
      },
    };
    const expected = 'John,  2023,  Example Name,  Example Publication Title';
    expect(formatCitation(selectedItem)).toBe(expected);
  });

  it('formats a citation correctly with no name and no date and nameOfAct', () => {
    const selectedItem = {
      data: {
        creators: [],
        date: undefined,
        nameOfAct: 'Example Act',
      },
    };
    const expected = ' Example Act';
    expect(formatCitation(selectedItem)).toBe(expected);
  });

  it('formats a citation correctly with no creators and place', () => {
    const selectedItem = {
      data: {
        date: '2023',
        place: 'Example Place',
      },
    };
    const expected = ' 2023,  Example Place';
    expect(formatCitation(selectedItem)).toBe(expected);
  });
});

describe('makeOpenAireUrlObj', () => {
  it('creates correct OpenAire URL objects', () => {
    const filterList = ['publications', 'rsd'];
    const expected = [
      'https://api.openaire.eu/search/publications',
      'https://api.openaire.eu/search/datasets',
    ];
    expect(makeOpenAireUrlObj(filterList)).toEqual(expected);
  });
});

describe('formatOpenAire', () => {
  it('formats OpenAire data correctly', () => {
    const item = {
      metadata: {
        'oaf:entity': {
          'oaf:result': {
            title: { $: 'Example Title' },
            creator: [{ '@surname': 'Doe', '@name': 'John' }],
            dateofacceptance: { $: '2023-01-01' },
          },
        },
      },
    };
    const expected = {
      data: {
        DOI: null,
        url: undefined,
        title: 'Example Title',
        itemType: 'journalArticle',
        creators: [
          {
            creatorType: 'author',
            lastName: 'Doe',
            firstName: 'John',
          },
        ],
        date: 2023,
        collections: ['Example Collection'],
        relations: {},
      },
      icon: 'openaire',
      label: 'Example Label',
      isOpenAire: true,
      citationTitle: 'Doe, John,  2023,  Example Title',
    };
    expect(formatOpenAire(item, 'Example Label', 'Example Collection')).toEqual(
      expected,
    );
  });

  it('handles entry.pid as an array correctly, title as in array no firstName and lastName', () => {
    const item = {
      metadata: {
        'oaf:entity': {
          'oaf:result': {
            title: [{ $: 'Example Title' }],
            creator: [{ $: 'Doe' }],
            dateofacceptance: { $: '2023-01-01' },
            pid: [{ '@classid': 'doi', $: '10.1000/test' }],
          },
        },
      },
    };
    const expected = {
      data: {
        DOI: '10.1000/test',
        url: undefined,
        title: 'Example Title',
        itemType: 'journalArticle',
        creators: [
          {
            creatorType: 'author',
            lastName: 'Doe',
            firstName: '',
          },
        ],
        date: 2023,
        collections: ['Example Collection'],
        relations: {},
      },
      icon: 'openaire',
      label: 'Example Label',
      isOpenAire: true,
      citationTitle: 'Doe,  2023,  Example Title',
    };

    expect(formatOpenAire(item, 'Example Label', 'Example Collection')).toEqual(
      expected,
    );
  });

  it('handles entry.pid as an object correctly and no title and creator object', () => {
    const item = {
      metadata: {
        'oaf:entity': {
          'oaf:result': {
            creator: { $: 'Doe' },
            dateofacceptance: { $: '2023-01-01' },
            pid: { '@classid': 'doi', $: '10.1000/test' },
          },
        },
      },
    };
    const expected = {
      data: {
        DOI: '10.1000/test',
        url: undefined,
        title: '',
        itemType: 'journalArticle',
        creators: [
          {
            creatorType: 'author',
            lastName: 'Doe',
            firstName: '',
          },
        ],
        date: 2023,
        collections: ['Example Collection'],
        relations: {},
      },
      icon: 'openaire',
      label: 'Example Label',
      isOpenAire: true,
      citationTitle: 'Doe,  2023',
    };

    expect(formatOpenAire(item, 'Example Label', 'Example Collection')).toEqual(
      expected,
    );
  });

  it('handles entry.pid as an object correctly with no @classId, no creator and no date', () => {
    const item = {
      metadata: {
        'oaf:entity': {
          'oaf:result': {
            title: { $: 'Example Title' },
            pid: { '@classid': '', $: '10.1000/test' },
          },
        },
      },
    };
    const expected = {
      data: {
        DOI: null,
        url: undefined,
        title: 'Example Title',
        itemType: 'journalArticle',
        creators: [],
        date: null,
        collections: ['Example Collection'],
        relations: {},
      },
      icon: 'openaire',
      label: 'Example Label',
      isOpenAire: true,
      citationTitle: ' Example Title',
    };

    expect(formatOpenAire(item, 'Example Label', 'Example Collection')).toEqual(
      expected,
    );
  });

  it('handles no entry.pid correctly', () => {
    const item = {
      metadata: {
        'oaf:entity': {
          'oaf:result': {
            title: { $: 'Example Title' },
            creator: [{ '@surname': 'Doe', '@name': 'John' }],
            dateofacceptance: { $: '2023-01-01' },
          },
        },
      },
    };
    const expected = {
      data: {
        DOI: null,
        url: undefined,
        title: 'Example Title',
        itemType: 'journalArticle',
        creators: [
          {
            creatorType: 'author',
            lastName: 'Doe',
            firstName: 'John',
          },
        ],
        date: 2023,
        collections: ['Example Collection'],
        relations: {},
      },
      icon: 'openaire',
      label: 'Example Label',
      isOpenAire: true,
      citationTitle: 'Doe, John,  2023,  Example Title',
    };

    expect(formatOpenAire(item, 'Example Label', 'Example Collection')).toEqual(
      expected,
    );
  });
});
