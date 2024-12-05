# Next Web

> Website front-end for www.nice.org.uk using NextJS

[**:rocket: Jump straight to getting started**](#rocket-set-up)

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [Stack](#stack)

- [Next Web](#next-web)
	- [Stack](#stack)
		- [Software](#software)
		- [React and NextJS learning resources](#react-and-nextjs-learning-resources)
		- [TypeScript path mapping](#typescript-path-mapping)
		- [Logging](#logging)
			- [RabbitMQ locally](#rabbitmq-locally)
			- [Logging performance](#logging-performance)
	- [Config](#config)
		- [Secrets](#secrets)
	- [:rocket: Set up](#rocket-set-up)
	- [Production hosting](#production-hosting)
		- [NextJS server](#nextjs-server)
		- [AWS EC2](#aws-ec2)
	- [Storyblok](#storyblok)
		- [Updating types on the command line manually](#updating-types-on-the-command-line-manually)
		- [The storyblok CLI script tools](#the-storyblok-cli-script-tools)
			- [Setup](#setup)
		- [Debugging Next-Web locally](#debugging-next-web-locally)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Stack

### Software

- [VS Code IDE](https://code.visualstudio.com/)
  - With recommended extensions (VS Code will prompt you to install these automatically)
- [NextJS](https://nextjs.org/) for a React full stack framework
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Pino](https://getpino.io/) for logging

Linting, code style and unit testing are all handled at the root of this repository.

> If you're new to NextJS, don't worry: it's a well used React framework and its [documentation](https://nextjs.org/) and community is superb.

### React and NextJS learning resources

If you're new to React, then start with the [official tutorial](https://reactjs.org/tutorial/tutorial.html) before you learn NextJS.

These resources are a a great place to start learning NextJS:

- [The official interactive Next.js tutorial](https://nextjs.org/learn)
- YouTube videos like:
  - [Next.js for Beginners - Full Course](https://www.youtube.com/watch?v=1WmNXEVia8I)
  - [Learn Next.js in One Video - Fundamentals of Next.js](https://www.youtube.com/watch?v=tt3PUvhOVzo)
  - [Next.js Crash Course for Beginners 2021](https://www.youtube.com/watch?v=MFuwkrseXVE)
  - [Next.js Crash Course 2021](https://www.youtube.com/watch?v=mTz0GXj8NN0)

### TypeScript path mapping

We use [TypeScript path mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) in various places. This allows us to avoid references like _../../../../logging/logger_ in nested files. So for example, use:

- `import { render, getMockRouter } from "@/test-utils/rendering";` to get utils/helpers for unit testing with Jest
- `import { logger, useLogger } from "@/logger";` for quick access to logging functions
- `import { settings, SettingsConfig } from "@/config";` for quick access to configuration values.
- `import { Test } from "@/components/Test/Test";` for quick access to components.

This isn't necessarily a complete list of aliases though: look at `compilerOptions.paths` in [tsconfig.json](tsconfig.json) for the complete list.

> Note: we deliberately use _@/_ to avoid confusion with paths to npm packages in node_modules.

### Logging

We use [Pino](https://getpino.io/) for logging. Pino is a 'very low overhead Node.js logger' - it's super fast and performant (see [benchmarks](https://getpino.io/#/docs/benchmarks)). It also feature-rich (e.g. redaction), well-used and the default logger in frameworks like [Fastify](https://www.fastify.io/).

Locally (for development using `npm run dev`) logs will go to the console (formatted using [pino-pretty](https://github.com/pinojs/pino-pretty)). In production (via `npm run build && npm start`), logs will go to our [ELK stack](https://www.elastic.co/what-is/elk-stack) via RabbitMQ, exactly like [NICELogging](https://github.com/nice-digital/NICELogging).

To use logging, import the `logger` and call log methods like `logger.info` or `logger.warn` etc:

```js
import { logger } from "@/logger";
logger.warn("A warning");
```

> Note: the `@/logger` path might look odd but it's a [TypeScript path mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping). This allows us to avoid references like _../../../../logging/logger_ in nested files.

If you're in a React component then use the `useLogger` hook - this logs extra details about the current URL:

```js
import { useLogger } from "@/logger";

export const SomeReactComponent = () => {
	const logger = useLogger();

	logger.info("Some log message");
}
```

See the pino docs for the [`logger` instance](https://getpino.io/#/docs/api?id=logger) for a full list of log methods.

The above development/production logging is configured so you can just use `logger.warn` etc and not worry about config. However, debugging production logging via RabbitMQ can be tricky:

#### RabbitMQ locally

Sometimes it's useful to use RabbitMQ locally for debugging production logging locally, for example to check JSON message formats. The easiest way to do this is to RabbitMQ locally using Docker. Run the following in a terminal to run RabbitMQ on 5672 and the Rabbit management UI on 8080:

```
docker run --rm -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 8080:15672 rabbitmq:3-management
```

Then use `amqp://guest:guest@localhost:5672/` as the URL for the `uri` property in _.pino-mqrc.json_. Open http://localhost:8080/ in a browser to access the local RabbitMQ management UI and login with guest/guest. Run `npm run build` then `npm start` and you should be able to see log messages come through into RabbitMQ.

#### Logging performance

Pino is focussed on performance. As a result it doesn't natively support [in-process transports](https://getpino.io/#/docs/transports?id=in-process-transports).  That means the core pino `logger` handles writing logs to `stdout` in single line JSON format but doesn't (and shouldn't) handle sending to RabbitMQ or writing to files. To quote the Pino docs:

> Ideally, a transport should consume logs in a separate process to the application, Using transports in the same process causes unnecessary load and slows down Node's single threaded event loop.

This means our npm scripts are _slightly_ more complicated: they contain the command to run NextJS (e.g. `next dev`) which pipes the `stdout` output to a pino transport (pino-pretty locally or pino-mq once deployed). Generally this Just Works™ and you don't need to worry about it. However it's worth knowing in case you need to debug the npm scripts.

## Config

The application is configured using node environment variables. The file _.env_ in the web folder contains _all_ the necessary config options.

Deployment is via Octopus.

### Unit tests config

Unit tests reference variables set in _.env.test_ located in the _web_ directory.

### Secrets

Sensitive values like secrets are deliberately empty - this is a *public* repo. Create a local file (e.g. _.env.development.local_ or _.env.production.local_) in the _web_ directory with any secrets and these will be automatically merged with the config from _.env_.

## :rocket: Set up

We will set up VS Code debug integration, but in the mean time use the command line:

1. Install [Node LTS](https://nodejs.org/en/download/) or even better, use [Volta](https://volta.sh/) to automatically use the correct, pinned version of Node.
2. Clone this repository
3. Open the root of the repository in VS Code
4. Install dependencies from npm:
   1. Run 'npm: Install Dependencies' and then 'All' from the VS Code command palette (_Ctrl+Shift+P_)
   2. Or run `npm ci` on the command line in the root and each sub folder
5. run `npm run dev` from the _web_ folder
6. open http://localhost:4000 in a browser

> This _web_ folder uses dev dependencies from the root folder, because of the way that [NodeJS traverses up folders to find modules](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders).

## NextJS routing

Nextweb uses a hybrid routing setup which supports the old _pages_ router and the _app_ router, introduced in NextJS version 13. This will enable a phased migration from _pages_ router to _app_ router. At time of writing the only page served by _app_ router is the _not-found_ (404) page.

## Production hosting

First run `npm run build` to [build the NextJS app for production](https://nextjs.org/docs/api-reference/cli#build).

Now run the production build on a local sever by either running the built in NextJS server or by using PM2:

### NextJS server

Run `npm start` to run the built in NextJS server as a single process.

This is a good, quick way to verify the production build works properly but it's not 100% representative of how it runs in production. For example, it's a single process rather than clustered over multiple CPU cores.

### AWS EC2

[AWS EC2](https://aws.amazon.com/ec2/) Docker is a platform for developing, shipping, and running applications inside containers. AWS Elastic Container Service (ECS) is a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications using Docker. We use Docker containers hosted on AWS ECS to manage the deployment and scaling of our Next application in production, ensuring efficient resource utilization, process isolation, and seamless scaling across multiple instances. Terraform is used to automate the provisioning and deployment of our infrastructure on AWS, enabling consistent and repeatable deployments via Teamcity and Octopus Deploy.

See the [aws](../aws) folder for more information.

## Storyblok

Storyblok is the CMS we use for our corporate content.

### Updating types on the command line manually

We can get updated Typescript types automatically using the Storyblok CLI. Running `npm run generate-sb-types` in the web folder will connect to our Storyblok instance and replace all the types in `/web/src/types/storyblok.d.ts`.

Two things to bear in mind before you do this:

1. You'll need to log in via the CLI, otherwise you'll get an error that you're not authorised. [Docs for installing the CLI, logging in and so on are here](https://www.storyblok.com/docs/Guides/command-line-interface). Sometimes you need to log out and in again, which is a bit annoying. If you're asked for a region when logging in, it's `eu`. NOTE - `npm run danger-storyblok-push-pull` outlined below will now log you in and out automatically via your unique storyblok token to perform selected operations.

2. You'll need to replace the two instances of {SPACE_ID} in the script with our actual Storyblok space ID, which isn't added to package.json for security reasons. There may be a better way to do this by reading it from our env vars, but for now this'll do.

### The storyblok CLI script tools
We can get updated Typescript types automatically, pull and push components and sync components and types between spaces using the storyblok CLI script tools. 

#### Setup
1. **Add Space IDs to environment variables and your storyblok:**
   - Open your `.env.local` file.
   - Add the space IDs from Storyblok using the following variable names, ensuring they are correct with the storyblok space settings page:
     - `LIVE_SPACE_ID`
     - `ALPHA_SPACE_ID`
     - `DEV_SPACE_ID`
	- Add your uniquely generated storyblok token, you will need to update your token when it expires (see - https://app.storyblok.com/#/me/account?tab=token)
     - `STORYBLOK_TOKEN`

   Example:
   ```plaintext
   LIVE_SPACE_ID=your_live_space_id
   ALPHA_SPACE_ID=your_alpha_space_id
   DEV_SPACE_ID=your_dev_sandbox_space_id
	STORYBLOK_TOKEN=your_storyblok_token
	 ```

### Updating types with the CLI script tool
This will allow you to connect to one of our Storyblok spaces and replace all the types in `/web/src/types/storyblok.d.ts` with those from the chosen space.

1. **Run the generate types command**
   - Navigate to the web directory
   - Execute the push/pull command: npm run danger-storyblok-push-pull
   - Choose 'Generate Types' and follow the prompts in the terminal to generate types from a chosen space

### Push pull components between storyblok spaces

Use extreme caution when push pulling components between spaces as you can overwrite live content if you get the push / pull direction or space ids wrong. The same advice for logging in and out of the storyblok CLI applies ([see updating types](#updating-types)). The pull command creates a temporary local backup directory with the id of the space, then pulls the components from storyblok as individual files. The push command first executes a pull to ensure the latest version from storyblok, then prompts for the name of the component to push to the chosen space - multiple components can be pushed by comma separating the names.

1. **Run the push/pull command**
   - Navigate to the web directory
   - Execute the push / pull command: npm run danger-storyblok-push-pull
   - Follow the prompts in the terminal, double checking the push / pull direction, space ids and components to push/pull.
  
### Syncing Types, Components, and Stories between Storyblok spaces

Use extreme caution when syncing between spaces as you can overwrite live content if you get the sync direction or space ids wrong. The same advice for logging in and out of the storyblok CLI manually applies ([see updating types](#updating-types)).

1. **Run the sync command**
   - Navigate to the web directory
   - Execute the sync command: npm run danger-storyblok-sync
   - Follow the prompts in the terminal, double checking the sync direction, space ids and content to sync

## Local setup between Next-Web and Publications

### Publications setup
Follow these steps to set up the Publications service locally and enable communication with local Next-Web.

1. **Follow the Publications README:**
   - Refer to the [Publications](https://github.com/nice-digital/publications) repository README and complete all the steps for local setup.
2. **Modify `web.config` for local development:**
   - In [web.config](https://github.com/nice-digital/publications/blob/master/src/Publications/web.config#L116), update the value of `UseSecureFeeds` to `false`
   - Modify the value of `Non-Idam-EndpointKey-NextWeb` in `web.config` with the corresponding key from [Octodeploy](https://deploy-aws.nice.org.uk/app#/Spaces-1/projects/publications/variables).
3. **Build and run the application:**
   - Once the configuration is updated, build and run the Publications service as per the repository instructions.

### Next-Web setup
1. **Follow setup instructions:**
   - Start by following the steps outlined in the [Set up](#rocket-set-up) section 
2. **Create a `.env.development.local` file:**
   - In the web directory of `Next-Web`, create a `.env.development.local` file and add the following configuration:

```env
NEXT_PUBLIC_SEARCH_BASE_URL=https://search-api.nice.org.uk/api
NEXT_PUBLIC_JOTFORM_BASE_URL=https://nice.jotform.com
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=SECRET
NEXT_PUBLIC_STORYBLOK_ENABLE_ROOT_CATCH_ALL=true
NEXT_PUBLIC_STORYBLOK_OCELOT_ENDPOINT=
PUBLIC_DENY_ROBOTS=false

# SERVER_FEEDS_PUBLICATIONS_ORIGIN=https://alpha-publications.nice.org.uk
# SERVER_FEEDS_PUBLICATIONS_ORIGIN=https://beta.publications.nice.org.uk
# SERVER_FEEDS_PUBLICATIONS_ORIGIN=https://test-publications.nice.org.uk
# SERVER_FEEDS_PUBLICATIONS_ORIGIN=https://live-publications.nice.org.uk
SERVER_FEEDS_PUBLICATIONS_ORIGIN=http://local-publications.nice.org.uk
SERVER_FEEDS_PUBLICATIONS_API_KEY=SECRET
# SERVER_FEEDS_INDEV_ORIGIN=http://local-indev.nice.org.uk
# SERVER_FEEDS_INDEV_ORIGIN=https://beta-indev.nice.org.uk
# SERVER_FEEDS_INDEV_ORIGIN=https://test-indev.nice.org.uk
# SERVER_FEEDS_INDEV_ORIGIN=https://indev.nice.org.uk
SERVER_FEEDS_INDEV_ORIGIN=https://alpha-indev.nice.org.uk
SERVER_FEEDS_INDEV_API_KEY=SECRET
SERVER_FEEDS_JOTFORM_API_KEY=SECRET

SUPPRESS_NO_CONFIG_WARNING=true
```
Uncomment the relevant `origin` and `apiKey` based on your needs.

**Note:** API keys can be obtained from [Octodeploy](https://deploy-aws.nice.org.uk/app#/Spaces-1/projects/publications/variables). Ensure you have the necessary permissions to access these keys. The `SECRET` in the "publications" section should match `Non-Idam-EndpointKey-NextWeb` and the `SECRET` in "inDev" section should match `ApiKey` in Octodeploy.

3. **Update `next.config.ts`:**
   - In the `next.config.ts` file, add the following line before the `module.exports` block
```
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
```
4. **Install dependencies**
   - Navigate to the `web` directory in your termimal in Visual Studio code and run `npm ci`
5. **Run the development server:**
   - Start the local Next-Web development server by running `npm run dev`
6. **Access Next-Web:**
   - Open the browser and navigate to http://localhost:4000/guidance/published
7. **Access pubished product:**
   - To view a published product created in the local publications instance, open:
```
   http://localhost:4000/guidance/<product>
```
   Replace `product` with the actual product ID from local Publications.

### Debugging Next-Web locally
To debug next-web locally, follow these steps:

1. **Install required packages:**
   Navigate to `web` folder in your terminal and run the following commands to install the necessary packages
   ```
   npm i next@latest react@latest react-dom@latest eslint-config-next@latest
   npm install @types/react@latest @types/react-dom@latest
   npm run dev
   ```
2. **Enable debugging in Chrome:**
   - Open Chrome and enter the following URL
   ```
   chrome://inspect/#devices
   ```
3. **Configure Target discovery settings:**
   - On the devices page, click the `Configure` button.
   - In the pop-up for `Target discovery settings`, add the host and port that the debugger is listening to (as mentioned in the console after [step 5](#run-the-development-server) of the  "Next-web setup" section above). 
   - For example, if the debugger is listening to multiple ports like 127.0.0.1:9229 and 127.0.0.1:9230, add both these ports as
   ```
   localhost:9229
   localhost:9230
   ```
   - Click on `Done` when finished.
4. **Inspect Remote Target:**
   - Under the `Remote Target` section in the devices page, click on `Inspect` for `C:_src_next-web_web_node_modules_next_dist_server_lib_start-server.js`
   - This will launch Chrome DevTools.
5. **Access source files:**
    - In DevTools, go to the `Sources` tab and navigate to `nice-digital/src`. Here, you will find the files needed for debugging. Set breakpoints where necessary to begin debugging.
6. You are all set!

**Note:** Ensure that any changes made for local setup are not committed to GitHub.
