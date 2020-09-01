# volto-slate-zotero
[![Releases](https://img.shields.io/github/v/release/eea/volto-slate-zotero)](https://github.com/eea/volto-slate-zotero/releases)

[Zotero](https://www.zotero.org/) integration with [Volto Slate](https://github.com/eea/volto-slate/tree/develop) [Volto](https://github.com/plone/volto) add-on

## Features

* Volto Slate Footnotes integration with Zotero
* OpenAire integration

## Getting started

1. Create new volto project if you don't already have one:
    ```
    $ npm install -g @plone/create-volto-app
    $ create-volto-app my-volto-project
    $ cd my-volto-project
    ```

1. Update `package.json`:
    ``` JSON
    "addons": [
        "volto-slate:asDefault",
        "@eeacms/volto-slate-zotero"
    ],

    "dependencies": {
        "@plone/volto": "github:eea/volto#7.11.1-beta.1",
        "volto-slate": "github:eea/volto-slate#0.5.3",
        "@eeacms/volto-slate-zotero": "github:eea/volto-slate-zotero#0.1.0"
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

* [Plone](https://plone.org/download)
* [plone.restapi](https://pypi.org/project/plone.restapi/)
* [eea.zotero](https://pypi.org/project/eea.zotero)

### Frontend

* [Volto](https://github.com/plone/volto)
* [volto-slate](https://github.com/eea/volto-slate)

## How to contribute

See [DEVELOP.md](DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
