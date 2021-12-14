# volto-slate-zotero
[![Releases](https://img.shields.io/github/v/release/eea/volto-slate-zotero)](https://github.com/eea/volto-slate-zotero/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-slate-zotero%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-slate-zotero/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-zotero-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-zotero-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-zotero-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-zotero-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-zotero-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-zotero-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-zotero-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-zotero-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-slate-zotero%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-slate-zotero/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-zotero-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-zotero-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-zotero-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-zotero-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-zotero-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-zotero-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-zotero-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-zotero-develop)


[Zotero](https://www.zotero.org/) integration with [Volto Slate](https://github.com/eea/volto-slate/tree/develop) [Volto](https://github.com/plone/volto) add-on

## Features

- Volto Slate Footnotes integration with Zotero
- OpenAire integration

## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
      $ yo @plone/volto my-volto-project --addon @eeacms/volto-slate-zotero

   $ cd my-volto-project
   $ yarn add -W @eeacms/volto-slate-zotero
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-slate-zotero"
   ],

   "dependencies": {
       "@eeacms/volto-slate-zotero": "^2.0.0"
   }
   ```

1. Install new add-ons and restart Volto:

   ```
   $ yarn
   $ yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!


## Dependencies

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)
- [eea.zotero](https://pypi.org/project/eea.zotero)

### Frontend

- [Volto](https://github.com/plone/volto)
- [volto-slate](https://github.com/eea/volto-slate)

## How to contribute

See [DEVELOP.md](DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
