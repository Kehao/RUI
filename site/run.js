/* eslint import/no-extraneous-dependencies: ["off"] */

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

new WebpackDevServer(webpack({
  devtool: 'eval',
  context: path.resolve(__dirname),
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('site')],
        exclude: [resolve('src/MyVirtualTable/react-virtualized')], // 第三方库，暂不参与eslint校验
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          resolve('site'),
          resolve('src'),
          resolve('libs')
        ],
        options: {
          root: '../'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: ['style-loader', 'css-loader', {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?.+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(jpe?g|png|gif)(\?.+)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.md$/,
        loader: 'raw-loader'
      }
    ]
  }
}), {
  publicPath: '/',
  hot: true,
  historyApiFallback: true,
  stats: { colors: true }
}).listen(3000, 'localhost', error => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('> Starting server on http://localhost:3000');
});

