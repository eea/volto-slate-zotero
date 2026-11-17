# @eeacms/volto-slate-zotero

[![Releases](https://img.shields.io/github/v/release/eea/volto-slate-zotero)](https://github.com/eea/volto-slate-zotero/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-slate-zotero%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-slate-zotero/job/master/display/redirect)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-zotero&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-zotero)

[Zotero](https://www.zotero.org/) integration with [Volto Slate](https://6.dev-docs.plone.org/volto/configuration/volto-slate/) text editor [Volto](https://github.com/plone/volto) add-on

## Features

- Volto Slate Footnotes integration with Zotero
- OpenAire integration

![Slate Zotero](https://raw.githubusercontent.com/eea/volto-slate-zotero/develop/docs/volto-slate-zotero.gif)

## Upgrade

### Upgrading to 5.x

This version requires: `@plone/volto >= 16.0.0.alpha.15` (`volto-slate` part of Volto Core).

## Dependencies (Backend)

* [eea.zotero](https://pypi.org/project/eea.zotero)

## Requirements

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)

### Frontend

- Node.js: `>=22.0.0`

## Installation

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "dependencies": {
       "@eeacms/volto-slate-zotero": "*"
   }
   ```

   and `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-slate-zotero'];
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
