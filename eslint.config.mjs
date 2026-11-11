import nextPlugin from "@next/eslint-plugin-next";
import unusedImports from "eslint-plugin-unused-imports";
import tsParser from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
	{
		ignores: ["dist", "node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "publish/**"],
	},
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
		plugins: {
			"unused-imports": unusedImports,
		},
		rules: {
			"no-unused-vars": "off",
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"error",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],
		},
	},
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
			"@next/next": nextPlugin,
			"unused-imports": unusedImports,
			"react": reactPlugin,
			"jsx-a11y": jsxA11yPlugin,
			"import": importPlugin,
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			...nextPlugin.configs["core-web-vitals"].rules,

			"@typescript-eslint/no-explicit-any": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",

			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"error",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],

			"@typescript-eslint/no-floating-promises": "error",
			"@typescript-eslint/no-misused-promises": "error",
			"@typescript-eslint/no-unnecessary-type-assertion": "error",
			"@typescript-eslint/await-thenable": "error",

			"eqeqeq": ["error", "always"],
			"no-debugger": "error",
			"no-unreachable": "error",
			"no-var": "error",
			"prefer-const": "error",
			"no-implied-eval": "error",
			"no-throw-literal": "error",

			// "simple-import-sort/imports": "error",
			// "simple-import-sort/exports": "error",

			"react/jsx-key": "error",
			"react/self-closing-comp": "error",
			"@next/next/no-img-element": "warn",

			"jsx-a11y/alt-text": "error",
			"jsx-a11y/anchor-is-valid": "error",

			"import/no-cycle": "error",
			"import/no-duplicates": "error",
			"import/first": "error",
			"import/newline-after-import": "error",
		},
	},
];
