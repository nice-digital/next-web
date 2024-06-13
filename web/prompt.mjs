import { exec } from "child_process";

import { config } from "dotenv";
import inquirer from "inquirer";

config({ path: ".env.local" });

const LIVE_SPACE_ID = process.env.LIVE_SPACE_ID;
const SANDBOX_SPACE_ID = process.env.SANDBOX_SPACE_ID;
const TEST_SPACE_ID = process.env.TEST_SPACE_ID;

const options = [
	{ name: "Live", value: LIVE_SPACE_ID },
	{ name: "Sandbox", value: SANDBOX_SPACE_ID },
	{ name: "Test", value: TEST_SPACE_ID },
];

// Custom caution message
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

inquirer
	.prompt([
		{
			type: "list",
			name: "from",
			message: "Select sync 'from' value:",
			choices: options.map((option) => option.name),
		},
	])
	.then((answers) => {
		console.log("Options:", options);
		const selectedFromOption = options.find(
			(option) => option.name === answers.from
		);
		const filteredOptions = options.filter(
			(option) => option.value !== selectedFromOption?.value
		);
		console.log("Filtered Options:", filteredOptions);
		inquirer
			.prompt([
				{
					type: "list",
					name: "to",
					message: "Select sync 'to' value:",
					choices: filteredOptions.map((option) => option.name),
				},
				{
					type: "confirm",
					name: "confirm",
					message: (answers) =>
						`Confirm sync selection: from "${selectedFromOption?.name}" to "${answers.to}"?`,
					default: true,
				},
			])
			.then((answers) => {
				if (answers.confirm) {
					const selectedToOption = filteredOptions.find(
						(option) => option.name === answers.to
					);

					const command = `echo Your selection: syncing from "${selectedFromOption?.name} ${selectedFromOption?.value} " to "${selectedToOption?.name} ${selectedToOption?.value}"`;
					exec(command, (error, stdout, stderr) => {
						if (error) {
							console.error(`Error: ${error.message}`);
							return;
						}
						if (stderr) {
							console.error(`Error: ${stderr}`);
							return;
						}
						console.log(stdout);
					});
				} else {
					console.log("Selection canceled.");
				}
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	})
	.catch((error) => {
		console.error(`Error: ${error}`);
	});
