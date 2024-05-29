module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '@': './src',
        },
      },
    ],
    ['babel-plugin-transform-import-meta'],
  ],
};
