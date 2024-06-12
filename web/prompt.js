const { exec } = require("child_process");

const prompt = require("prompt-sync");

const userInput = prompt({ sigint: true })("Do you want to proceed? (y/n): ");

if (userInput.toLowerCase() === "y") {
	console.log("Proceeding with the operation...");

	const command = "sh -c 'echo \"This is a really dangerous operation\" '";

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
}
