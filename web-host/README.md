# Next Web Host

> PM2 website hosting for Next Web

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->

- [Stack](#stack)
	- [PM2](#pm2)

<!-- END doctoc -->
</details>

## Stack

### PM2

[PM2](https://pm2.keymetrics.io/) is a daemon process manager for Node. It allows scaling Node processes over multiple cores, process management, restarts and zero-downtime deployments, amongst other things. We use PM2 to host the Next application in production.

> Note: We've opted to use existing server infrastructure (hence use of PM2) in the short term for ease and speed. We ~might~ migrate to serverless infrastructure in the future at which point we'll remove PM2.

Run `npm run pm2:start` to run the above NextJS server across multiple process on the available CPU cores using PM2. For example, it will run 7 processes on an 8-core CPU. This command will list out the running processes on the terminal and then leave the processes (and server on http://localhost:3000) running in the background.

There are other commands for controlling PM2, for example `npm run pm2:stop`, `npm run pm2:reload` or `npm run pm2:delete`. For more fine-grained PM2 control use `npm run pm2 -- <options>` for example `npm run pm2 -- monit` to monitor processes or `npm run pm2 -- list` to list all processes.
