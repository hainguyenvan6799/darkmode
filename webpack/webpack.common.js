const path = require('path');

const config = {
  entry: {
    config: ['react-hot-loader/patch', './src/pages/config.tsx'],
    app: ['react-hot-loader/patch', './src/pages/app.tsx'],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName:
                  process.env.NODE_ENV === 'production'
                    ? '[hash:base64:5]'
                    : '[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'images/png',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
};

module.exports = config;
