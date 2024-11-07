const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 都用当前时间作为文件后缀
const dateNow = Date.now().toString();

// 获取需要直接复制的文件
const getCopyPatterns = require('./build/getCopyPatterns.js')
const copyPatterns = getCopyPatterns(dateNow);

// 获取入口
const getEnrty = require('./build/getEntry.js')
const entry = getEnrty(dateNow);

// 获取html插件
const getHtmlWebpackPlugins = require('./build/getHtmlWebpackPlugins');
const htmlPlugins = getHtmlWebpackPlugins(dateNow)

const getConcatPlugins = require('./build/getConcatPlugins');
const concatPluygins = getConcatPlugins(dateNow)

function MiniCssExtractPluginFilename({ chunk }) {
    if (['common', 'common2'].includes(chunk.name)) {
        return `common-source/css/[name]/index-${dateNow}.css`
    }
    return `pages/[name]/style-${dateNow}.css`
}


module.exports = [
    {
        mode: 'development',
        devtool: "source-map",
        entry: entry,
        externals: {
            'vue': 'vue',
        },
        module:{
          rules:[
              {
                  test: /\.js$/,
              },
              {
                  test: /\.(png|jpg|gif|svg)$/,
                  type: 'asset/resource',
                  generator: {
                      publicPath: '../../../',
                      filename: 'common-source/images/bundle/[hash][ext][query]'
                  }
              },
              {
                  test: /\.css$/,
                  use: [MiniCssExtractPlugin.loader, 'css-loader'],
              },
          ]
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'pages/[name]/index-[contenthash].js',
            clean: true
        },
        plugins: [...htmlPlugins,
            new CopyPlugin({
                patterns: copyPatterns
            }),
            new MiniCssExtractPlugin(
                {
                    // 输出css的时候需要处理两个公共文件
                    filename: MiniCssExtractPluginFilename,
                }
            ),
            ...concatPluygins
        ],
        devServer: {
            port:8001,
            contentBase: path.join(__dirname, "dist"),
            // 自动打开页面
            open: true,
            // 指定打开的页面
            'openPage': 'pages/a/index.html'
        }
    },
];

