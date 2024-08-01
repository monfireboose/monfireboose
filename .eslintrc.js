
module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        tabWidth: 2,
        printWidth: 105,
        singleQuote: true,
        semi: true,
        jsxSingleQuote: false,
        bracketSpacing: true,
        bracketSameLine: false,
        arrowParens: 'always',
        singleAttributePerLine: true,
        endOfLine: 'auto',
      },
    ],
    'linebreak-style': ['warn', 'unix'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};

