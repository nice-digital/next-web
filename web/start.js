// Simple start script to get round this issue running npm scripts with PM2 on Windows: https://stackoverflow.com/a/56203967/486434
const exec = require("child_process").exec,
	nextWebProcess = exec("npm run host", {
		windowsHide: true,
	});

// Pipe the outut of the subprocess so we have the option of logging it to the console
nextWebProcess.stdout.pipe(process.stdout);
nextWebProcess.stderr.pipe(process.stderr);
