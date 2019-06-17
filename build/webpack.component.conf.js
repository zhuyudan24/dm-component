let path = require('path')
let webpack = require('webpack')
const CosPlugin = require('cos-webpack');

let isDev = process.env.NODE_ENV === 'development';
//处理gic的组件
let components = require('../components.json');
let gic = components.gic;
let base = components.base;
let entryMultiple = {};
Object.keys(gic).map(v => {
  entryMultiple[v + '.' + gic[v].version] = path.resolve(__dirname, '../src/components/gic/dm-'+v+'/index.js')
});
Object.keys(base).map(v => {
  entryMultiple[v + '.' + base[v].version] = path.resolve(__dirname, '../src/components/base/dm-'+v+'/index.js')
});

console.log(entryMultiple);
// 配置 腾讯云CDN上传 请勿改动
const cosPlugin = new CosPlugin({
  secretId: 'AKIDGIY0HsoT9bpoJe7s7Bzd6O2mZIrgJiSy',
  secretKey: 'PZhimCygx8jitob3OcpfOAsTythtNnHu',
  bucket: 'web-1251519181',
  region: 'ap-shanghai',
  path: '/'
});

module.exports = {
    entry:entryMultiple,
    output: {
        path: path.resolve(__dirname, '../components'),
        publicPath: '//web-1251519181.file.myqcloud.com/components/',
        filename: '[name].js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                // options: {
                //   limit: 10000,
                //   name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                // }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('src')
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    },
    performance: {
        hints: false
    },
    devtool: false,
    plugins:[
      cosPlugin,
      new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
          }
      }),
      new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
              warnings: false
          }
      }),
      new webpack.LoaderOptionsPlugin({
          minimize: true
      })
    ]
}
