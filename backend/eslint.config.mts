// eslint.config.js

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  js.configs.recommended,            
  ...tseslint.configs.recommended,     
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" }, // ✅ allow unused vars if prefixed with "_"
      ],
      "@typescript-eslint/no-explicit-any": "off", // ✅ disable strict "any" rule
      "@typescript-eslint/no-unused-expressions": "off", // ✅ allow `condition && doSomething()`
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error", // ✅ prevent unsafe non-null assertions
    },
  },
];
