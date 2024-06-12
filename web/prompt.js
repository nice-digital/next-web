const { exec } = require("child_process");

const prompt = require("prompt-sync");

const args = process.argv.slice(2);
const sandboxSpaceId = args[0];
const liveSpaceId = args[1];

if (!sandboxSpaceId || !liveSpaceId) {
	console.error(
		"Error: Both sandbox_space_id and live_space_id must be provided."
	);
	process.exit(1);
}

const warningMessage = `
╔════════════════════════════════════════════╗
║!!! This is a REALLY DANGEROUS operation !!!║
╚════════════════════════════════════════════╝
Are you sure you want to copy from space ID: ${sandboxSpaceId} to space ID: ${liveSpaceId} ? (y/n):
`;

const userInput = prompt({ sigint: true })(warningMessage);

if (userInput.toLowerCase() === "y") {
	// const command = `sh -c 'echo "Copying space ID: ${sandboxSpaceId} to space ID: ${liveSpaceId}, " '`;
	const command = `sh -c 'echo "Copying space ID: ${sandboxSpaceId} to space ID: ${liveSpaceId}" '`;

	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing shell command: ${error}`);
			return;
		}

		console.log(`Shell command output: ${stdout}`);

		if (stderr) {
			console.error(`Shell command error: ${stderr}`);
		}
	});
} else {
	console.log("Operation canceled.");
	process.exit(0);
}
