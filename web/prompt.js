const { exec } = require("child_process");
const path = require("path");
const readline = require("readline");
require("dotenv").config({ path: path.join(__dirname, "./.env.local") });

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const fromId = process.env.FROM_ID;
const toId = process.env.TO_ID;

if (!fromId || !toId) {
	console.error(
		"Missing environment variables. Please set FROM_ID and TO_ID in .env.local."
	);
	rl.close();
	process.exit(1);
}

console.log(`From ID: ${fromId}`);
console.log(`To ID: ${toId}`);

rl.question("Do you want to continue? (yes/no): ", (confirmation) => {
	if (confirmation.toLowerCase() === "yes") {
		const command = `powershell.exe -Command "echo 'From ID: ${fromId}'; echo 'To ID: ${toId}'"`;
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing PowerShell command: ${error}`);
				return;
			}
			console.log(stdout);
		});
	} else {
		console.log("Exiting...");
	}
	rl.close();
});

rl.on("close", () => {
	console.log("Script terminated.");
});
