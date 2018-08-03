var path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: __dirname + '/src/index.js',
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'static/bundle-[hash].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				include: path.join(__dirname, 'src'),
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader'
				}, {
					loader: 'strip-loader?strip[]=console.log'
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
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'less-loader']
				})
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					query: {
						name: 'static/images/[name].[ext]?[hash:5]'
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
			SERVICE_API_URL: JSON.stringify('http://cms-test.deepleaper.com'),
			SERVICE_AUTH_URL: JSON.stringify('http://auth-test.deepleaper.com'),
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			except: ['$super', '$', 'exports', 'require']
		}),
		new ExtractTextPlugin("static/style.css"),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: __dirname + "/index.tmpl.html"
		}),
		new TransferWebpackPlugin([
			{from: 'ueditor', to: '/static/ueditor'},
		])
	],
};
