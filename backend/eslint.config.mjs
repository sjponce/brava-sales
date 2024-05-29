import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      semi: ['error', 'always'],
      'no-extra-semi': 'error',
      eqeqeq: 'error',
      camelcase: 'error',
      'no-var': 'error',
    },
  },
  {
    ignores: ['**/*.spec.js'],
  },
  {
    languageOptions: {
      globals: {
        process: true,
      },
    },
  },
];
