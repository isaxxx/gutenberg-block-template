const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const glob = require('glob');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const PRODUCTION_PLUGINS = [
  new UglifyJSPlugin({
    uglifyOptions: {
      compress: {
        drop_console: true,
      },
    },
    sourceMap: true,
  }),
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
