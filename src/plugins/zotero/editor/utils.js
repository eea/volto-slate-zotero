const doiRegex = '(10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?![%"#? ])\\S)+)';
const doi = (opts) => {
  opts = opts || {};
  return opts.exact
    ? new RegExp('(?:^' + doiRegex + '$)')
    : new RegExp('(?:' + doiRegex + ')', 'g');
};
export const findDOI = (newStr) => {
  if (!newStr) {
    return;
  }
  // const match = doi().exec(newStr);
  // console.log('doi match', match);

  const words = newStr.split(' ');
  const results = [];
  words.forEach((word) => {
    const match = doi().exec(word);

    if (match) {
      results.push(match[0]);
    }
  });

  console.log('doi results', results);

  return results;
  // return match ? match[0] : null;
};

export const formatCitation = (selectedItem) => {
  const { data } = selectedItem;
  const result = [];
  const name = data.creators
    ? data?.creators[0]
      ? data?.creators[0].name
        ? `${data.creators[0]?.name}`
        : data.creators[0]?.lastName && data.creators[0]?.firstName
        ? `${data.creators[0]?.lastName}, ${data.creators[0]?.firstName}`
        : data.creators[0]?.lastName
        ? `${data.creators[0]?.lastName}`
        : `${data.creators[0]?.firstName}`
      : null
    : null;
  const date = data.date ? ` ${data.date}` : null;
  const title = data.title
    ? ` ${data.title.slice(0, 40)}`
    : data.nameOfAct
    ? ` ${data.nameOfAct}`
    : null;
  const publicationTitle = data.publicationTitle
    ? ` ${data.publicationTitle}`
    : null;
  const place = data.place ? ` ${data.place}` : null;
  if (name) result.push(name);
  if (date) result.push(date);
  if (title) result.push(title);
  if (publicationTitle) result.push(publicationTitle);
  if (place) result.push(place);

  return result.join(', ');
};

const openAireUrlBase = `https://api.openaire.eu/search`;
export const makeOpenAireUrlObj = (filterList) => {
  const openAireUrl = {
    publications: `${openAireUrlBase}/publications`,
    rsd: `${openAireUrlBase}/datasets`,
  };

  return filterList.reduce((accumulator, currentValue) => {
    return [...accumulator, openAireUrl[currentValue]];
  }, []);
};

export const formatOpenAire = (item, label, parentCollection) => {
  const entry = item.metadata['oaf:entity']['oaf:result'];
  const result = {
    data: {},
    icon: 'openaire',
    label,
    isOpenAire: true,
    citationTitle: '',
  };

  const hasDoi = entry.pid
    ? Array.isArray(entry.pid)
      ? entry.pid.find((key) => key['@classid'] === 'doi')
      : entry.pid
      ? entry.pid['@classid'] === 'doi'
        ? entry.pid
        : null
      : null
    : null;

  result.data = {
    title: entry.title[0] ? entry.title[0]['$'] : entry.title['$'],
    itemType: 'journalArticle',
    DOI: hasDoi ? hasDoi['$'] : null,
    creators: Array.isArray(entry.creator)
      ? entry.creator.map((creator) => {
          return {
            creatorType: 'author',
            lastName: creator['@surname'] || creator.$,
            firstName: creator['@name'] || '',
          };
        })
      : entry.creator
      ? [
          {
            creatorType: 'author',
            lastName: entry.creator['@surname'] || entry.creator.$,
            firstName: entry.creator['@name'] || '',
          },
        ]
      : [],
    url: entry.url,
    publicationTitle: entry.publisher?.$,
    date:
      entry.dateofacceptance && entry.dateofacceptance.$
        ? new Date(entry.dateofacceptance.$).getUTCFullYear()
        : null,
    collections: [parentCollection],
    relations: {},
  };
  result.citationTitle = formatCitation(result);

  return result;
};
