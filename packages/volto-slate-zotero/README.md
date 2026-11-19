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

### Upgrading to 8.x

> This version requires `Volto 18` or `Volto 19` and Node.js 22.

The plugin keeps the same element type, the same toolbar button and the same stored citation, so
rich text created with 7.x keeps rendering unchanged. The release adds Volto 19 support and moves
the repository to the Volto 19 layout, where the published package lives in
`packages/volto-slate-zotero`.

#### Fixes

- DOI links open with `rel="noopener noreferrer"` instead of `rel="noopener"`.
- Loading a sub-collection no longer overwrites the collections list: the collection fetch and the
  sub-collection fetch are applied by separate effects, and the collection one now stops early when
  the flag does not name it.

#### Breaking changes

- **Node.js 22 or newer is required** (`engines.node >= 22`), 7.x declared no engine.
- **React 18 is required.** The package declares `react` and `react-dom` as `^18.2.0` peers, 7.x
  declared no peers.
- **The package no longer ships the repository tooling.** The Cypress specs and the Jest setup are
  gone and the unit tests moved to Vitest next to the add-on, so nothing a site imports was
  removed.

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
