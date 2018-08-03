var path = require('path');
const webpack = require('webpack');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: ['babel-polyfill', __dirname + '/src/index.js'],
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: '/build/'
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				include: path.join(__dirname, 'src'),
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
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
				test: /\.scss$/,
				use: [{
					loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: "sass-loader" // compiles Sass to CSS
				}]
			},
			{
				test: /\.(png|jpg|gif|ico)$/,
				use: [{
					loader: 'file-loader',
					query: {
						name: 'images/[name].[ext]?[hash:5]'
					}
				}]
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
				use: [{
					loader: 'file-loader',
					query: {
						name: 'medias/[name].[ext]?[hash:5]'
					}
				}]
			}
		],
	},
	devServer: {
		historyApiFallback: true,
		inline: true,
		hot: true,
		disableHostCheck: true,
		port: 7780,
		host: "127.0.0.1"
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),//热加载插件
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify('development'),
				BABEL_ENV: JSON.stringify('development'),
			},
			RUNTIME_ENV: JSON.stringify('development'),
			SERVICE_API: JSON.stringify('http://adp-api-dev.deepleaper.com'),
		}),
	],
};
