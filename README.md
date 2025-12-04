<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Next Web](#next-web)
  - [Project structure](#project-structure)
  - [Stack](#stack)
    - [Linting](#linting)
    - [Tests](#tests)
  - [JotForms Integration](#jotforms-integration)
  - [Setting up Ocelot for Storyblok](#setting-up-ocelot-for-storyblok)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Next Web

> Website front-end for www.nice.org.uk using NextJS

## Project structure

The repository is set up as a monorepo. That is, there are various sub folders providing different parts of the project e.g. the web app and functional tests:

| Folder                      | Purpose                                |
| --------------------------- | ---------------------------------------|
| [web](web#readme)           | NextJS web app                         |
| [aws](aws#readme)           | AWS ECS hosting for the NextJS web app |
| [api](api#readme)           | Ocelot Api Cache                       |

## Stack

The common components of the stack are:

- [VS Code IDE](https://code.visualstudio.com/)
  - With recommended extensions (VS Code will prompt you to install these automatically)
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io/) for code formatting
- [ESLint](https://eslint.org/) for JavaScript/TypeScript linting
- [stylelint](https://stylelint.io/) for SCSS linting
- [Jest](https://jestjs.io/) for JS unit testing
  - With [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

There are also more specific stacks detailed in the readme for each sub folder.

### Linting

We use [Prettier](https://prettier.io/) for code formatting, [ESLint](https://eslint.org/) for JavaScript/TypeScript linting and [stylelint](https://stylelint.io/) for SCSS linting. All 3 are installed as dev dependencies and configured at the root level of this monorepo.

VSCode is also configured with the necessary extensions (via [extensions.json](.vscode/extensions.json)) and settings (via [settings.json](.vscode/settings.json)) to do in-IDE linting and formatting. There's no further setup needed beyond installing the recommended extensions when you open the project. Just save source files and they'll be reformatted automatically.

Using VSCode should work for in-IDE linting but if it doesn't you can run the lint commands manually. Run `npm run lint` in the root to run Prettier, ESLint, stylelint and TS type checking against all source files. This includes source files for the NextJS web app, Jest tests and WDIO functional tests.

If you prefer using an IDE to command line, open the VSCode command palette (`Ctrl` + `Shift` + `P`) and choose _Tasks: Run Task_ then _Lint all the things_.

Alternatively, run individual commands like `npm run prettier`, `npm run lint:ts`, `npm run lint:scss` or `npm run ts:check` for more granular control, although you shouldn't normally need to do this - IDE support and the single `npm run lint` command are usually enough.

### Tests

We use [Jest](https://jestjs.io/) for JS unit testing with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) for testing React components.

[vscode-jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) is added as recommended extension (via [extensions.json](.vscode/extensions.json)). This gives you the ability in-IDE to run and debug tests.

Use the command line instead if you need more granular control:

1. Run `npm test` to run the Jest tests (note: this doesn't run the WDIO functional tests)
   1. Or, run `npm run test:watch` to run the tests and watch for changes to files, to re-run the tests
   2. Or, run `npm run test:coverage` to run the tests and output a _coverage_ folder with an lcov report.

> Running tests in watch mode via `npm run test:watch` is most useful when developing locally.

## JotForms Integration

We use an enterprise edition of JotForms, [https://nice.jotform.com/myforms/](https://nice.jotform.com/myforms/) to host forms on the NICE Website through Storyblok.

For further information, please see [docs/jotforms-integration.md](docs/jotforms-integration.md).

## Setting up Ocelot for Storyblok

Ocelot has been added as an alternative to Storybloks own inbuilt caching. To set up Ocelot for Storyblok locally the following steps need to be taken:

1.  Ensure Redis is installed and running. Check that the redis endpoint URL is correct in the Ocelot section of appsettings.Development.json or appsettings.Production.json
2.  There are two endpoints for clearing the Ocelot Cache, for which postman is used to access, these can be obtained from a developer or tester.
3.  Amend the appsettings.Development.json or appsettings.Production.json so that the Ocelot.ClientSecret matches the client_secret in the Get Token postman request.
4.  In the ocelot.development.json and/or ocelot.production.js in GlobalConfiguration add a BaseUrl key and the value is the local ocelot endpoint

```
"GlobalConfiguration": {
   "BaseUrl": "http://localhost:45127"
}
```

5. Open next-web/api/NICE.NextWeb.API.sln in Visual Studio and Run. You should be presented with a web page that says 'Not found'.
6. Ensure that in the Storyblok's .env file STORYBLOK_OCELOT_ENDPOINT correctly matches your local Ocelot endpoint URL and has a suffix of /storyblok. i.e. `STORYBLOK_OCELOT_ENDPOINT=http://localhost:45127/storyblok`
7. Run Storyblok, it should now use Ocelot for it's caching.
