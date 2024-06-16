module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'import/extensions': 'off',
    'linebreak-style': 'off',
  },
  overrides: [
    {
      files: ['*.spec.js'],
      rules: {
        'jest/expect-expect': 'off',
      },
    },
    {
      files: ['*.jsx'],
      rules: {
        'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
        'react/react-in-jsx-scope': 'off',
        'import/no-unresolved': 'off',
        'no-console': 'off',
        'import/extensions': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-underscore-dangle': 'off',
        'react/jsx-closing-bracket-location': 'off',
        'trailing-comma': 'es5',
      },
    },
  ],
};
