const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const glob = require('glob');
const TerserPlugin = require('terser-webpack-plugin');

const PRODUCTION_PLUGINS = [
  new TerserPlugin(),
];

const entries = {};
glob.sync('./src/*.js').map((filePath) => {
  const fileName = path.basename(filePath);
  entries[fileName] = filePath;
});

module.exports = {
  entry: entries,
  output: {
    path: path.join(__dirname + '/dist'),
    filename: '[name]',
  },
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'hidden-source-map' : 'source-map',
  devServer: { // webpack-dev-serverで生成されたバンドルはオンメモリで保持される。そのためバンドルがファイルとして保存されることは無い。（main.jsなどファイルとしての実体はみつからない。）
    hot: true,
    open: true,
    openPage: 'index.html',
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/assets/js/',
    watchContentBase: true,
    port: 4000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    ie: 11,
                  },
                  useBuiltIns: 'usage',
                  corejs: 3,
                }
              ],
              [
                '@babel/react',
              ]
            ]
          }
        }
      }
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  optimization: {
    minimizer: isProduction ? PRODUCTION_PLUGINS : [],
  },
};
