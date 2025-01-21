import { spawn } from "child_process";

import { config } from "dotenv";
import inquirer from "inquirer";

config({ path: ".env.dev.local" });

const LIVE_SPACE_ID = process.env.LIVE_SPACE_ID;
const ALPHA_SPACE_ID = process.env.ALPHA_SPACE_ID;
const DEV_SPACE_ID = process.env.DEV_SPACE_ID;

const options = [
	{ name: "LIVE", value: LIVE_SPACE_ID },
	{ name: "ALPHA", value: ALPHA_SPACE_ID },
	{ name: "DEV", value: DEV_SPACE_ID },
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
			const { types } = await inquirer.prompt([
				{
					type: "checkbox",
					name: "types",
					message: "Select types to copy:",
					choices: [
						{ name: "folders" },
						{ name: "components" },
						{ name: "stories" },
					],
				},
			]);

			const typesStr = types.join(",");

			const { confirmTypes } = await inquirer.prompt([
				{
					type: "confirm",
					name: "confirmTypes",
					message: `You selected the following types to copy: ${typesStr}. Confirm?`,
					default: false,
				},
			]);

			if (confirmTypes) {
				const command = `storyblok sync --type "${typesStr}" --source ${selectedFromOption?.value} --target ${selectedToOption?.value}`;
				const child = spawn("powershell.exe", ["-Command", command]);
				child.stdout.on("data", function (data) {
					console.log("Sync Data: " + data);
				});
				child.stderr.on("data", function (data) {
					console.log("Sync Errors: " + data);
				});
				child.on("exit", function () {
					console.log("Sync Script finished");
				});
				child.stdin.end();
			} else {
				console.log("Type selection canceled.");
			}
		} else {
			console.log("Sync selection canceled.");
		}
	} catch (error) {
		console.error(`Error: ${error}`);
	}
})();
