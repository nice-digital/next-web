# Next Web

> Website front-end for www.nice.org.uk using NextJS

## Project structure

The repository is set up as a monorepo. That is, there are various sub folders providing different

| Folder            | Purpose        |
| ----------------- | -------------- |
| [web](web#readme) | NextJS web app |

## Stack

- [VS Code IDE](https://code.visualstudio.com/)
  - With recommended extensions (VS Code will prompt you to install these automatically)
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io/) for code formatting
- [ESLint](https://eslint.org/) for JavaScript/TypeScript linting
- [stylelint](https://stylelint.io/) for SCSS linting
- [Jest](https://jestjs.io/) for JS unit testing
  - With [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

### Linting

We use [Prettier](https://prettier.io/) for code formatting, [ESLint](https://eslint.org/) for JavaScript/TypeScript linting and [stylelint](https://stylelint.io/) for SCSS linting. All 3 are installed as dev dependencies and configured at the root level of this monorepo.

VSCode is also configured with the necessary extensions (via [extensions.json](.vscode/extensions.json)) and settings (via [settings.json](.vscode/settings.json)) to do in-IDE linting and formatting. There's no further setup needed beyond installing the recommended extensions when you open the project. Just save source files and they'll be reformatted automatically.

Using VSCode should work all the time but if it doesn't you can run the lint commands manually. Run `npm run lint` in the root to run Prettier, ESLint, stylelint and TS type checking against all source files. This includes source files for the NextJS web app, Jest tests and WDIO functional tests.

If you prefer using an IDE to command line, open the VSCode command palette (`Ctrl` + `Shift` + `P`) and choose _Tasks: Run Task_ then _Lint all the things_.

Alternatively, run individual commands like `npm run prettier`, `npm run lint:ts`, `npm run lint:scss` or `npm run typecheck` for more granular control, although you shouldn't normally need to do this - IDE support and the single `npm run lint` command are usually enough.

### Tests

We use [Jest](https://jestjs.io/) for JS unit testing with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) for testing React components.

[vscode-jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) is added as recommended extension (via [extensions.json](.vscode/extensions.json)). This gives you the ability in-IDE to run and debug tests.

Use the command line instead if you neeed more granular control:

1. Run `npm test` to run the Jest tests (note: this doesn't run the WDIO functional tests)
   1. Or, run `npm run test:watch` to run the tests and watch for changes to files, to re-run the tests
   2. Or, run `npm run test:coverage` to run the tests and output a _coverage_ folder with an lcov report.

> Running tests in watch mode via `npm run test:watch` is most useful when developing locally.
