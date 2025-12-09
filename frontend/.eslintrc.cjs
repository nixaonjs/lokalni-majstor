module.exports = {
  root: true,
  env: { browser: true, es2023: true, node: true },
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  plugins: ["react", "react-hooks", "import", "react-refresh"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "prettier"
  ],
  rules: {
    "react-refresh/only-export-components": "off",
    "react/prop-types": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "import/no-unresolved": "off"
  },
  ignorePatterns: ["dist/", "build/", "node_modules/", "vite.config.*"]
};
