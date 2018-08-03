var path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: ['babel-polyfill', __dirname + '/src/index.js'],
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'public/bundle-[hash].js',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "postcss-loader"
                }]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader?modules&localIdentName=[path]__[name]__[local]===[hash:base64:5]" // translates CSS into CommonJS
                }, {
                    loader: "less-loader", // compiles Less to CSS
                    options: {
                        javascriptEnabled: true
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    query: {
                        name: 'public/images/[name].[ext]?[hash:5]'
                    }
                }]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                use: [{
                    loader: 'file-loader',
                    query: {
                        name: 'public/medias/[name].[ext]?[hash:5]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('production'),
                BABEL_ENV: JSON.stringify('production'),
            },
            RUNTIME_ENV: JSON.stringify('production'),
            SERVICE_API: "'\/API'",
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require']
        }),
        new ExtractTextPlugin("public/style.css"),
        new HtmlWebpackPlugin({
            filename: "index.html",
            favicon: './src/assets/favicon.ico',
            template: __dirname + "/index.tmpl.html"
        })
    ],
};
