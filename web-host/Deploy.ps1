# ! OctopusDeploy deployment script, see https://octopus.com/docs/deployments/custom-scripts/scripts-in-packages#supported-scripts

# TeamCity builds runs on a linux agent so we have to rebuild binaries for our Windows application servers
# Using `!$IsLinux` works on both PowerShell 5 and PSCore.
if(!$IsLinux) {
	Write-Output "Rebuilding pm2 package binary"
	npm rebuild pm2
}

# Update pm2 in case we have a newer version as per https://pm2.keymetrics.io/docs/usage/quick-start/#how-to-update-pm2
npm run pm2 -- update --mini-list

# If we're debugging this script locally then we can just point up a level to the web app folder, otherwise get the directory from Octopus
$deployedWebAppDir = Resolve-Path "../web"
If ($OctopusParameters) {
	$deployedWebAppDir = $OctopusParameters["Octopus.Action[Deploy NextJS webapp].Output.Package.InstallationDirectoryPath"]
}

Write-Output "Web app is deployed to $deployedWebAppDir"

$pm2WorkingDirectory = Resolve-Path "./current"

Write-Output "Creating symlink from $pm2WorkingDirectory to $deployedWebAppDir"

# Use a symlink from to latest web-app deployment, for zero-downtime deployments
# See https://pm2.keymetrics.io/docs/tutorials/capistrano-like-deployments
New-Item -Force -ItemType SymbolicLink -Path $pm2WorkingDirectory -Value $deployedWebAppDir

# Start/reload the webapp. We use --mini-list because of the way that Octopus Deploy shows the PM2 tables in logs
npm start -- --mini-list

# Save the PM2 process list, which allows it to persist across machine restarts
npm run save
