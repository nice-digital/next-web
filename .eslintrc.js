module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	env: {
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:prettier/recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:testing-library/react",
		"plugin:@next/next/recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
	],
	parserOptions: {
		sourceType: "module",
	},
	settings: {
		react: {
			version: "17",
		},
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
		"import/resolver": {
			typescript: {
				project: ["./tsconfig.json", "./web/tsconfig.json"],
			},
		},
	},
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-explicit-any": "error",
		// Allow unused variables that start with _ see https://stackoverflow.com/a/64067915/486434
		"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		"react/react-in-jsx-scope": "off",
		"react/display-name": "off",
		"react/prop-types": "off",
		"@next/next/no-html-link-for-pages": ["warn", "./web/src/pages"],
		"import/first": 2,
		"import/order": 2,
		"import/newline-after-import": 2,
		"import/no-unresolved": "error",
	},
	overrides: [
		{
			files: ["*.js"],
			rules: {
				"@typescript-eslint/no-var-requires": "off",
			},
		},
	],
};
