import { exec } from "child_process";

import { config } from "dotenv";
import inquirer from "inquirer";

config({ path: ".env.local" });

const LIVE_SPACE_ID = process.env.LIVE_SPACE_ID;
const SANDBOX_SPACE_ID = process.env.SANDBOX_SPACE_ID;
const DEV_SANDBOX_SPACE_ID = process.env.DEV_SANDBOX_SPACE_ID;

const options = [
	// { name: "Live", value: LIVE_SPACE_ID },
	{ name: "Sandbox", value: SANDBOX_SPACE_ID },
	{ name: "DEV Sandbox", value: DEV_SANDBOX_SPACE_ID },
];

const cautionMessage = `
*************************************************************************
*                                WARNING:                               *
*                 This is a VERY DANGEROUS operation!!!                 *
*                   Use caution with sync direction <-->                *
*        Verify local env space ids match actual storyblok space ids    *
*                                                                       *
*************************************************************************
`;

console.log(cautionMessage);

(async function () {
	try {
		const { from } = await inquirer.prompt([
			{
				type: "list",
				name: "from",
				message: "Select sync 'from' value:",
				choices: options.map((option) => option.name),
			},
		]);

		const selectedFromOption = options.find((option) => option.name === from);
		const filteredOptions = options.filter(
			(option) => option.value !== selectedFromOption?.value
		);

		const { to } = await inquirer.prompt([
			{
				type: "list",
				name: "to",
				message: "Select sync 'to' value:",
				choices: filteredOptions.map((option) => option.name),
			},
		]);

		const selectedToOption = filteredOptions.find(
			(option) => option.name === to
		);

		const { confirm } = await inquirer.prompt([
			{
				type: "confirm",
				name: "confirm",
				message: `Confirm sync selection: Sync from "${selectedFromOption?.name} ${selectedFromOption?.value}" to "${selectedToOption?.name} ${selectedToOption?.value}"?`,
				default: false,
			},
		]);

		if (confirm) {
			const command = `
			echo "Your selection: syncing from '${selectedFromOption?.name} ${selectedFromOption?.value}' to '${selectedToOption?.name} ${selectedToOption?.value}'";
			echo "List directory contents";
			dir;
			echo "Creating a temporary file";
            echo "torybloock! sync --type folders, components, stories  --source ${selectedFromOption?.value} --target ${selectedToOption?.value}" > temp.txt;
			code temp.txt;
            echo "Temporary file created";
            echo "Harmless commands completed";
		`;

			exec(
				`powershell -Command "${command
					.replace(/\n/g, " ")
					.replace(/"/g, '\\"')}"`,
				(error, stdout, stderr) => {
					if (error) {
						console.error(`Error: ${error.message}`);
						return;
					}
					if (stderr) {
						console.error(`Error: ${stderr}`);
						return;
					}
					console.log(stdout);
				}
			);
		} else {
			console.log("Sync selection canceled.");
		}
	} catch (error) {
		console.error(`Error: ${error}`);
	}
})();
