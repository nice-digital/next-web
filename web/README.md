# Next Web

> Website front-end for www.nice.org.uk using NextJS

[**:rocket: Jump straight to getting started**](#rocket-set-up)

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->

- [Stack](#stack)
	- [Software](#software)
	- [React and NextJS learning resources](#react-and-nextjs-learning-resources)
	- [Logging](#logging)
		- [RabbitMQ locally](#rabbitmq-locally)
		- [Logging performance](#logging-performance)
- [Config](#config)
	- [Secrets](#secrets)
- [:rocket: Set up](#rocket-set-up)
- [Production hosting](#production-hosting)
	- [NextJS server](#nextjs-server)
	- [PM2](#pm2)

<!-- END doctoc -->
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

These resources area a great place to start learning NextJS:

- [The official interactive Next.js tutorial](https://nextjs.org/learn)
- YouTube videos like:
  - [Next.js for Beginners - Full Course](https://www.youtube.com/watch?v=1WmNXEVia8I)
  - [Learn Next.js in One Video - Fundamentals of Next.js](https://www.youtube.com/watch?v=tt3PUvhOVzo)
  - [Next.js Crash Course for Beginners 2021](https://www.youtube.com/watch?v=MFuwkrseXVE)
  - [Next.js Crash Course for Beginners 2021](https://www.youtube.com/watch?v=MFuwkrseXVE)
  - [Next.js Crash Course 2021](https://www.youtube.com/watch?v=mTz0GXj8NN0)

### Logging

We use [Pino](https://getpino.io/) for logging. Pino is a 'very low overhead Node.js logger' - it's super fast and performant (see [benchmarks](https://getpino.io/#/docs/benchmarks)). It also feature-rich (e.g. redaction), well-used and the default logger in frameworks like [Fastify](https://www.fastify.io/).

Locally (for development using `npm run dev`) logs will go to the console (formatted using [pino-pretty](https://github.com/pinojs/pino-pretty)). In production (via `npm run build && npm start`), logs will go to our [ELK stack](https://www.elastic.co/what-is/elk-stack) via RabbitMQ, exactly like [NICELogging](https://github.com/nice-digital/NICELogging).

To use logging, import the `logger` and call log methods like `logger.info` or `logger.warn` etc:

```js
import { logger } from "../logger/logger";
logger.warn("A warning");
```

If you're in a React component then use the `useLogger` hook - this logs extra details about the current URL:

```js
import { useLogger } from "../logger/logger";

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

The application is configured using [node-config](https://www.npmjs.com/package/config). The file _default.yml_ in the config folder contains _all_ the necessary config options.

This _default.yml_ file will be transformed with real values on deployment via Octopus, using [Structured Configuration Variables](https://octopus.com/docs/projects/steps/configuration-features/structured-configuration-variables-feature).

### Secrets

Sensitive values like secrets are deliberately empty - this is a *public* repo. Create a local file (e.g. _local.json_ or _local.yml_) in the _config_ directory with any secrets and these will be automatically merged with the config from _default.yml_.

## :rocket: Set up

We will set up VS Code debug integration, but in the mean time use the command line:

1. Install [Node LTS](https://nodejs.org/en/download/) or even better, use [Volta](https://volta.sh/) to automatically use the correct, pinned version of Node.
2. Clone this repository
3. Open the root of the repository in VS Code
4. Install dependencies from npm:
   1. Run 'npm: Install Dependencies' and then 'All' from the VS Code command palette (_Ctrl+Shift+P_)
   2. Or run `npm ci` on the command line in the root and each sub folder
5. run `npm run dev` from the _web_ folder
6. open http://localhost:3000 in a browser

> This _web_ folder uses dev dependencies from the root folder, because of the way that [NodeJS traverses up folders to find modules](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders).

## Production hosting

First run `npm run build` to [build the NextJS app for production](https://nextjs.org/docs/api-reference/cli#build).

Now run the production build on a local sever by either running the built in NextJS server or by using PM2:

### NextJS server

Run `npm start` to run the built in NextJS server as a single process.

This is a good, quick way to verify the production build works properly but it's not 100% representative of how it runs in production. For example, it's a single process rather than clustered over multiple CPU cores. Using PM2 (below) is a more 'production-like' approach:

### PM2

[PM2](https://pm2.keymetrics.io/) is a daemon process manager for Node. It allows scaling Node processes over multiple cores, process management, restarts and zero-downtime deployments, amongst other things. We use PM2 to host the Next application in production.

> Note: We've opted to use existing server infrastructure (hence use of PM2) in the short term for ease and speed. We ~might~ migrate to serverless infrastructure in the future at which point we'll remove PM2.

Run `npm run pm2:start` to run the above NextJS server across multiple process on the available CPU cores using PM2. For example, it will run 7 processes on an 8-core CPU. This command will list out the running processes on the terminal and then leave the processes (and server on http://localhost:3000) running in the background.

There are other commands for controlling PM2, for example `npm run pm2:stop`, `npm run pm2:reload` or `npm run pm2:delete`. For more fine-grained PM2 control use `npm run pm2 -- <options>` for example `npm run pm2 -- monit` to monitor processes or `npm run pm2 -- list` to list all processes.
