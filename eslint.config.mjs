import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/**", ".husky/_/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        console: "readonly",
        document: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        Option: "readonly",
        setTimeout: "readonly",
        window: "readonly",
      },
    },
    rules: {
      eqeqeq: ["error", "smart"],
      "no-console": "warn",
      "no-var": "error",
      "prefer-const": "error",
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
