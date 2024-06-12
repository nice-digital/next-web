import { exec } from "child_process";
import path, { dirname } from "path";
import readline from "readline";
import { fileURLToPath } from "url";

import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: path.join(__dirname, "./.env.local") });

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const fromId = process.env.LIVE_SPACE_ID;
const toId = process.env.SANDBOX_SPACE_ID;

if (!fromId || !toId) {
	console.error(
		"Missing environment variables. Please set FROM_ID and TO_ID in .env.local."
	);
	rl.close();
	process.exit(1);
}

console.log(`Sync from ID: ${fromId}`);
console.log(`Sync to ID: ${toId}`);

rl.question(
	"WARNING - DANGEROUS OPERATION! Do you want to continue? (yes/no): ",
	(confirmation) => {
		if (confirmation.toLowerCase() === "yes") {
			const command = `powershell.exe -Command "echo 'Syncing From ID: ${fromId}'; echo 'To ID: ${toId}'"`;
			exec(command, (error, stdout, stderr) => {
				if (error) {
					console.error(`Error executing PowerShell command: ${error}`);
					return;
				}
				console.log("Standard output:", stdout);
				console.log("Error output:", stderr);
			});
		} else {
			console.log("Exiting...");
		}
		rl.close();
	}
);

rl.on("close", () => {
	console.log("Script terminated.");
});
