const { exec } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question('Enter the "from" ID: ', (fromId) => {
	rl.question('Enter the "to" ID: ', (toId) => {
		console.log(`You entered:`);
		console.log(`From ID: ${fromId}`);
		console.log(`To ID: ${toId}`);

		rl.question("Is this correct? (yes/no): ", (confirmation) => {
			if (confirmation.toLowerCase() === "yes") {
				// Execute PowerShell command to echo the IDs
				const command = `powershell.exe -Command "echo 'Copying from ID: ${fromId}'; echo 'to ID: ${toId}'"`;
				exec(command, (error, stdout, stderr) => {
					if (error) {
						console.error(`Error executing PowerShell command: ${error}`);
						return;
					}
					console.log(stdout);
				});
			} else {
				console.log("IDs not confirmed. Exiting...");
			}
			rl.close();
		});
	});
});

rl.on("close", () => {
	console.log("Script terminated.");
});

// const { exec } = require("child_process");

// const readlineSync = require("readline-sync");

// const args = process.argv.slice(2);
// const sandboxSpaceId = args[0];
// const liveSpaceId = args[1];

// if (!sandboxSpaceId || !liveSpaceId) {
// 	console.error(
// 		"Error: Both sandbox_space_id and live_space_id must be provided."
// 	);
// 	process.exit(1);
// }

// const warningMessage = `
// *********************************************
// *         !!! WARNING !!!                   *
// *********************************************
// * This is a REALLY DANGEROUS operation!    *
// *********************************************
// * Are you sure you want to copy from       *
// * space ID: ${sandboxSpaceId} to           *
// * space ID: ${liveSpaceId}?                *
// *********************************************
// * (y/n):                                   *
// *********************************************
// `;

// const userInput = readlineSync.question(warningMessage);

// if (userInput.toLowerCase() === "y") {
// 	const command = `sh -c 'echo "Copying space ID: ${sandboxSpaceId} to space ID: ${liveSpaceId}" '`;

// 	exec(command, (error, stdout, stderr) => {
// 		if (error) {
// 			console.error(`Error executing shell command: ${error.message}`);
// 			process.exit(1);
// 		}

// 		console.log(`Shell command output: ${stdout}`);

// 		if (stderr) {
// 			console.error(`Shell command error: ${stderr}`);
// 		}
// 	});
// } else {
// 	console.log("Operation canceled.");
// 	process.exit(0);
// }
