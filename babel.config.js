module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['last 2 versions', 'ie >= 11'],
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['react-hot-loader/babel', '@babel/plugin-transform-runtime'],
};
