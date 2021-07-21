# Next Web Host

> PM2 website hosting for Next Web

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->

- [Stack](#stack)
	- [PM2](#pm2)
	- [Zero-downtime deployments](#zero-downtime-deployments)

<!-- END doctoc -->
</details>

## Stack

### PM2

[PM2](https://pm2.keymetrics.io/) is a daemon process manager for Node. It allows scaling Node processes over multiple cores, process management, restarts and zero-downtime deployments, amongst other things. We use PM2 to host the NextJS application in production.

> Note: We've opted to use existing server infrastructure (hence use of PM2) in the short term for ease and speed. We ~might~ migrate to serverless infrastructure in the future at which point we'd remove PM2.

Build the NextJS web app (using `npm run build` in the _web folder) then run `./Deploy.ps1` in a PowerShell terminal to run PM2 and the NextJS server. This is the same script that's run during deployments on Octopus Deploy so it should be 'live-like'.

This script runs the NextJS server across multiple process on the available CPU cores using PM2. For example, it will run 7 processes on an 8-core CPU. This command will list out the running processes on the terminal and then leave the processes (and server on http://localhost:8092) running in the background.

There are other commands for controlling PM2, for example `npm run stop`, `npm run reload`, `npm run restart`, `npm run delete`, `npm run save` or `npm run kill`. For more fine-grained PM2 control use `npm run pm2 -- <options>` for example `npm run pm2 -- monit` to monitor processes or `npm run pm2 -- list` to list all processes.

### Zero-downtime deployments

We deploy the NextJS web app separately from the PM2 web host. This enables 2 things:
- a decoupled architecure: if we remove PM2 in the future, we can remove this _web-host_ folder without affecting the web app
- zero-downtime deployments using `npm start` which uses PM2's `startOrReload` under the hood.

The zero downtime deployments work because we use a symlink to the deployed web app, much like ['Capistrano like deployments' in the PM2 docs](https://pm2.keymetrics.io/docs/tutorials/capistrano-like-deployments). This allows us to use Octopus Deploy's normal deployment folder and mechanism for the webapp. See the Deploy.ps1 script for the exact details.
