/* eslint-disable @typescript-eslint/no-var-requires */

// Simple script to get round this issue: https://stackoverflow.com/a/56203967/486434
var exec = require("child_process").exec;

exec("npm start", { windowsHide: true });
