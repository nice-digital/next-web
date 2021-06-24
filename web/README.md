# Next Web

> Website front-end for www.nice.org.uk using NextJS

[**:rocket: Jump straight to getting started**](#rocket-set-up)

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->

- [Next Web](#next-web)
	- [Stack](#stack)
		- [Software](#software)
		- [React and NextJS learning resources](#react-and-nextjs-learning-resources)
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

## :rocket: Set up

We will set up VS Code debug integration, but in the mean time use the command line:

1. Install [Node 12+](https://nodejs.org/en/download/) (latest LTS version)
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
