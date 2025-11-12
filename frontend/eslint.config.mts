import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    ignores: [
      "node_modules/**",
      "dist/**",
      "public/**",
      "build/**",
      ".next/**",
      "out/**",
      "coverage/**",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
    ],
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } 
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "semi": ["error", "always"],
      "max-len": ["error", { "code": 100, "ignoreUrls": true, "ignoreStrings": true, "ignoreTemplateLiterals": true }],
      "no-unused-vars": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "indent": ["error", 2],
    },
  },
]);
