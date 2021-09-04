module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["prettier"],
  ignorePatterns: ["node_modules/"],
  rules: {
    indent: ["warn", 2],
    quotes: ["warn", "double"],
    semi: ["warn", "always"],
    curly: ["warn", "all"],
    "no-var": "error",
    "prettier/prettier": "warn",
    "eol-last": ["warn", "always"],
    "arrow-parens": ["warn", "always"],
    "func-style": ["warn", "expression"],
    "comma-dangle": ["warn", "always-multiline"],
    "linebreak-style": ["warn", "unix"],
    "no-unused-vars": [
      "warn",
      {
        args: "none",
      },
    ],
    "arrow-spacing": [
      "warn",
      {
        before: true,
        after: true,
      },
    ],
    "prefer-const": [
      "warn",
      {
        destructuring: "any",
        ignoreReadBeforeAssign: false,
      },
    ],
  },
};
