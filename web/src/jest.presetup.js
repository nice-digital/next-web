// Tests are run from the root, so config looks in the wrong place (e.g. root/config) instead we need it to look in root/web/config
// And this has to be run first, before we import the config module, which is why it's in PREsetup
const path = require("path");

process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "../", "config");
