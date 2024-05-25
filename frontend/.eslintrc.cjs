module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'import/extensions': 'off'
  },
  overrides: [
    {
      files: ['*.spec.js'],
      rules: {
        'jest/expect-expect': 'off'
      }
    }
  ]
};
