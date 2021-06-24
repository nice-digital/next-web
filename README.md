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
- [Jest](https://jestjs.io/) for JS unit testing
  - With [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

### Linting

We use [Prettier](https://prettier.io/) for code formatting and [ESLint](https://eslint.org/) for JavaScript/TypeScript linting. Both are installed as dev dependencies and configured at the root level of this monorepo.

VSCode is also configured with the necessary extensions (via [extensions.json](.vscode/extensions.json)) and settings (via [settings.json](.vscode/settings.json)) to do in-IDE linting and formatting. There's no further setup needed beyond installing the recommended extensions when you open the project. Just save source files and they'll be reformatted automatically.

Using VSCode should work all the time but if it doesn't you can use the command line instead. Run `npm run lint` in the root to run Prettier, ESLint and Typescript type checking against all source files. This includes source files for the NextJS web app, Jest tests and WDIO functional tests.

Alternatively, run individual commands like `npm run prettier`, `npm run lint:ts` or `npm run typecheck` for more granular control, although you shouldn't normally need to do this - IDE support and the single `npm run lint` command are usually enough.

### Tests

We use [Jest](https://jestjs.io/) for JS unit testing with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) for testing React components.

To run the tests:

1. Run `npm test` to run the Jest tests (note: this doesn't run the WDIO functional tests)
   1. Or, run `npm run test:watch` to run the tests and watch for changes to files, to re-run the tests
   2. Or, run `npm run test:coverage` to run the tests and output a _coverage_ folder with an lcov report.

> Running tests in watch mode via `npm run test:watch` is most useful when developing locally.

If you prefer to run (and debug) the tests via an IDE (VS Code), then read on:

#### Debugging tests

We've configured 3 launch configurations (see [.vscode/launch.json](.vscode/launch.json)) for running and debugging Jest test:

1. **Jest tests (all)** - runs all test, with a debugger attached
2. **Jest tests (current file)** - runs the Jest against the file currently opened file.
3. **Jest tests (watch current file)** - runs the Jest against the file currently opened file and watches for changes.

Run these from the 'Run and Debug' panel (_Ctrl+Shift+D_) in VS Code:

1. Choose the relevent launch configuration from the menu
2. Press the green play button (or press _F5_).

> Note: these launch configurations are based on [Microsoft's "Debugging tests in VS Code" recipe](https://github.com/microsoft/vscode-recipes/tree/master/debugging-jest-tests).
