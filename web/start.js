// Simple start script to get round this issue running npm scripts with PM2 on Windows: https://stackoverflow.com/a/56203967/486434
require("child_process").exec("npm run host", {
	windowsHide: true,
});
