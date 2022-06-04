module.exports = {
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: '@cybozu/eslint-config/presets/react-typescript-prettier',
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'react/react-in-jsx-scope': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
      },
    },
  ],
};
