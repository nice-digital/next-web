# ! OctopusDeploy deployment script, see https://octopus.com/docs/deployments/custom-scripts/scripts-in-packages#supported-scripts

$ErrorActionPreference = "Stop"

# Hide pesky npm update banner https://stackoverflow.com/a/60525400/486434
npm config set update-notifier false

# TeamCity builds runs on a linux agent so we have to rebuild binaries for our Windows application servers
# Using `!$IsLinux` works on both PowerShell 5 and PSCore.
if(!$IsLinux) {
	Write-Output "Rebuilding pm2 package binary"
	npm rebuild pm2
}

# Update pm2 in case we have a newer version as per https://pm2.keymetrics.io/docs/usage/quick-start/#how-to-update-pm2
Start-Process "npm" -ArgumentList "run pm2 -- update --mini-list" -NoNewWindow -PassThru -Wait
#& npm run pm2 -- update --mini-list

If ($OctopusParameters) {
	# Find where the Next web app was deployed to: we'll symlink to it
	$webAppStepNameVariable = "DeployWebAppStepName"
	$deployWebAppStepName = $OctopusParameters[$webAppStepNameVariable]
	if(!$deployWebAppStepName) {
		throw "Could not find Octopus variable called $webAppStepNameVariable. Did you rename it? It should be the name of the step that deploys the NextJS web app."
	}
	$deployedWebAppDir = $OctopusParameters["Octopus.Action[$deployWebAppStepName].Output.Package.InstallationDirectoryPath"]
} else {
	# If we're debugging this script locally then we can just point up a level to the web app folder
	$deployedWebAppDir = Resolve-Path "../web"
}

Write-Output "Web app is deployed to $deployedWebAppDir"

$pm2WorkingDirectory = Join-Path (Resolve-Path .) "current"

Write-Output "Creating symlink from $pm2WorkingDirectory to $deployedWebAppDir"

# Use a symlink from to latest web-app deployment, for zero-downtime deployments
# See https://pm2.keymetrics.io/docs/tutorials/capistrano-like-deployments
New-Item -Force -ItemType SymbolicLink -Path $pm2WorkingDirectory -Value $deployedWebAppDir

# Start/reload the webapp. We use --mini-list because of the way that Octopus Deploy shows the PM2 tables in logs
Start-Process "npm" -ArgumentList "start -- --mini-list" -NoNewWindow -PassThru -Wait
#& npm start -- --mini-list

# Save the PM2 process list, which allows it to persist across machine restarts
Start-Process "npm" -ArgumentList "run save" -NoNewWindow -PassThru -Wait
#& npm run save

Exit 0
