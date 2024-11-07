import { spawn } from "child_process";
import fs from "fs";
import path from "path";

import { config } from "dotenv";
import inquirer from "inquirer";

config({ path: ".env.local" });

const STORYBLOK_TOKEN = process.env.STORYBLOK_TOKEN;

if (!STORYBLOK_TOKEN) {
	console.error(
		"Error: STORYBLOK_TOKEN is missing. Please add it to .env.local"
	);
	process.exit(1);
}

const SPACE_IDS = {
	LIVE: process.env.LIVE_SPACE_ID,
	ALPHA: process.env.ALPHA_SPACE_ID,
	DEV: process.env.DEV_SPACE_ID,
};

const options = Object.entries(SPACE_IDS).map(([name, value]) => ({
	name,
	value,
}));

const cautionMessage = `
*************************************************************************
*                                WARNING:                               *
*                 This is a VERY DANGEROUS operation!!!                 *
*                   Use caution with push/pull direction <-->           *
*        Verify local env space ids match actual storyblok space ids    *
*                                                                       *
*************************************************************************
`;

console.log(cautionMessage);

const backupDirBase = "temp-components-backup";

const checkBackupDirExists = (/** @type {string | undefined} */ spaceId) => {
	const spaceBackupDir = `${backupDirBase}-${spaceId}`;
	if (!fs.existsSync(spaceBackupDir)) {
		fs.mkdirSync(spaceBackupDir, { recursive: true });
	} else {
		fs.readdirSync(spaceBackupDir).forEach((file) => {
			fs.unlinkSync(path.resolve(spaceBackupDir, file));
		});
	}
	return spaceBackupDir;
};

const executeCommand = async (
	/** @type {string} */ command,
	/** @type {string} */ workingDir = "."
) => {
	console.log(`Executing: ${command} in directory: ${workingDir}`);
	return new Promise((resolve, reject) => {
		const process = spawn(command, { shell: true, cwd: workingDir });
		process.stdout.on("data", (data) => console.log(`stdout: ${data}`));
		process.stderr.on("data", (data) => console.error(`stderr: ${data}`));
		process.on("close", (code) => {
			code === 0
				? resolve("Process completed successfully.")
				: reject(new Error(`Process failed with code ${code}`));
		});
	});
};

const loginToStoryblok = async (/** @type {string | undefined} */ token) => {
	try {
		console.log(`Logging in to Storyblok using token: ${token}`);
		await executeCommand(`storyblok login --token ${token} --region eu`);
		console.log("Logged in to Storyblok successfully.");
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error during login:", error.message);
		} else {
			console.error("Error during login:", error);
		}
	}
};

const logoutFromStoryblok = async () => {
	try {
		console.log("Logging out of Storyblok...");
		await executeCommand("storyblok logout");
		console.log("Logged out of Storyblok successfully.");
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error during logout:", error.message);
		} else {
			console.error("Error during logout:", error);
		}
	}
};

const promptOperation = () =>
	inquirer.prompt([
		{
			type: "list",
			name: "operation",
			message: "Select operation:",
			choices: [
				"Push Component",
				"Pull ALL Components",
				"Generate Types",
				// "Push ALL Components",
				// "Delete Component",
				// "Delete ALL Components",
			],
		},
	]);

const promptSpace = (
	/** @type {string} */ message,
	/** @type {string | undefined} */ excludeValue
) => {
	const choices = options
		.filter(({ value }) => value !== excludeValue)
		.map(({ name }) => name);
	return inquirer.prompt([
		{
			type: "list",
			name: "space",
			message,
			choices,
		},
	]);
};

const promptComponentName = () =>
	inquirer.prompt([
		{
			type: "input",
			name: "component",
			message: "Enter the name or ID of the component to delete:",
		},
	]);

const promptLocalFiles = () =>
	inquirer.prompt([
		{
			type: "input",
			name: "localFileNames",
			message:
				"Enter the local file names of the components (comma separated, without extension):",
		},
	]);

const confirmOperation = (/** @type {string} */ message) =>
	inquirer.prompt([
		{
			type: "confirm",
			name: "confirm",
			message,
			default: false,
		},
	]);

const validateJSONFiles = (
	/** @type {any[]} */ fileNamesArray,
	/** @type {string | undefined} */ spaceId
) => {
	const spaceBackupDir = `${backupDirBase}-${spaceId}`;
	return fileNamesArray.every((/** @type {any} */ file) => {
		const filePath = path.resolve(`${spaceBackupDir}/${file}-${spaceId}.json`);
		if (!fs.existsSync(filePath)) {
			console.error(`File does not exist: ${filePath}`);
			return false;
		}
		try {
			const fileContent = fs.readFileSync(filePath, "utf8");
			JSON.parse(fileContent);
			console.log(`Valid JSON file: ${filePath}`);
			return true;
		} catch (err) {
			console.error(`Invalid JSON in file: ${filePath}`);
			if (err instanceof Error) {
				console.error(`Error details: ${err.message}`);
			}
			return false;
		}
	});
};

(async () => {
	try {
		await loginToStoryblok(STORYBLOK_TOKEN);
		const { operation } = await promptOperation();
		/**
		 * @type {{ name: string; value: string | undefined; } | undefined}
		 */
		let fromOption, toOption, componentName, localFiles;

		if (
			[
				"Pull",
				"Push Component",
				"Delete Component",
				"Push ALL Components",
				"Generate Types",
			].some((op) => operation.includes(op))
		) {
			const { space: from } = await promptSpace(
				`Select ${operation} 'from' value:`
			);
			fromOption = options.find((option) => option.name === from);
		}

		if (operation.includes("Push")) {
			const { space: to } = await promptSpace(
				`Select ${operation} 'to' value:`,
				fromOption?.value
			);
			toOption = options.find((option) => option.name === to);

			if (["Push Component", "Push ALL Components"].includes(operation)) {
				const spaceBackupDir = checkBackupDirExists(fromOption?.value);
				await executeCommand(
					`storyblok pull-components --space ${fromOption?.value} --separate-files --prefix-presets-names`,
					spaceBackupDir
				);

				if (operation === "Push Component") {
					const { localFileNames } = await promptLocalFiles();
					const fileNamesArray = localFileNames
						.split(",")
						.map((/** @type {string} */ file) => file.trim());

					if (!validateJSONFiles(fileNamesArray, fromOption?.value)) {
						console.log(
							"Please correct the invalid JSON files before proceeding."
						);
						return;
					}

					localFiles = fileNamesArray.map(
						(/** @type {any} */ file) => `${file}-${fromOption?.value}.json`
					);
				}
			}
		}

		if (operation === "Delete Component") {
			const { component } = await promptComponentName();
			componentName = component;
		}

		const confirmMessage = `Confirm ${operation} selection: ${operation} ${
			localFiles || ""
		} ${componentName || ""} ${
			fromOption ? `from "${fromOption.name} (${fromOption.value})"` : ""
		} ${toOption ? `to "${toOption.name} (${toOption.value})"` : ""}?`;
		const { confirm } = await confirmOperation(confirmMessage);

		if (confirm) {
			let command;
			let workingDir = "."; // Default working directory is root unless changed for other operations
			const spaceBackupDir = `${backupDirBase}-${fromOption?.value}`;

			switch (operation) {
				case "Pull ALL Components": {
					checkBackupDirExists(fromOption?.value);
					command = `storyblok pull-components --space ${fromOption?.value} --separate-files --prefix-presets-names`;
					workingDir = spaceBackupDir;
					break;
				}
				case "Push Component": {
					command = `storyblok push-components ${localFiles.join(
						","
					)} --space ${toOption?.value}`;
					workingDir = spaceBackupDir; // Execute in backup dir for push
					break;
				}
				case "Push ALL Components": {
					const allFiles = fs
						.readdirSync(spaceBackupDir)
						.filter((file) => file.endsWith(".json"))
						.map((file) => path.join(spaceBackupDir, file));
					command = `storyblok push-components ${allFiles.join(",")} --space ${
						toOption?.value
					}`;
					workingDir = spaceBackupDir;
					break;
				}
				case "Generate Types": {
					checkBackupDirExists(fromOption?.value);
					await executeCommand(
						`storyblok pull-components --space ${fromOption?.value} --prefix-presets-names`,
						workingDir
					);

					const jsonFilePath = `./components.${fromOption?.value}.json`;
					if (!fs.existsSync(jsonFilePath)) {
						console.error(`JSON file not found: ${jsonFilePath}`);
						return;
					}
					command = `storyblok generate-typescript-typedefs --sourceFilePaths=${jsonFilePath} --destinationFilePath=./src/types/storyblok.d.ts`;
					break;
				}
				case "Delete Component": {
					command = `storyblok delete-component ${componentName} --space ${fromOption?.value}`;
					break;
				}
				case "Delete ALL Components": {
					command = `storyblok delete-components ./components-${fromOption?.value}.json --space ${fromOption?.value}`;
					break;
				}
				default: {
					console.log("Invalid operation.");
					return;
				}
			}
			await executeCommand(command, workingDir);
		} else {
			console.log("Operation cancelled.");
		}
	} catch (error) {
		console.error(`Error: ${error instanceof Error ? error.message : error}`);
	} finally {
		await logoutFromStoryblok();
	}
})();
