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
		"import/resolver": {
			node: {
				extensions: [".js", ".jsx", ".ts", ".tsx"],
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
		"@next/next/no-html-link-for-pages": ["warn", "./web/pages"],
		"import/first": 2,
		"import/order": 2,
		"import/newline-after-import": 2,
	},
};
