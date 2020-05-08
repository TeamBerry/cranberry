module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
    rules: {
        "react/jsx-filename-extension": 'off',
        "no-underscore-dangle": "off",
        // Default no-unused-vars triggers on type imports because of TypeScript
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error"
  },
};
