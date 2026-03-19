import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";
import noSecrets from "eslint-plugin-no-secrets";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "garimpei_extension/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "__tests__/**/*.js", "*.js"],
    plugins: {
      jest: jestPlugin,
      "no-secrets": noSecrets
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
        beforeEach: "readonly",
        document: "readonly",
        window: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        URL: "readonly",
        test: "readonly",
        afterAll: "readonly",
        fetch: "readonly",
        navigator: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "no-secrets/no-secrets": ["error", { "tolerance": 4.5 }]
    }
  },
  prettierConfig
];