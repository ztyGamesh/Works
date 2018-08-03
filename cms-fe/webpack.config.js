var path = require('path');
const webpack = require('webpack');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: __dirname + '/src/index.js',
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
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: "less-loader" // compiles Less to CSS
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
				test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					query: {
						name: 'images/[name].[ext]?[hash:5]'
					}
				}]
			}
		]
	},
	devServer: {
		historyApiFallback: true,
		inline: true,
		hot: true,
		port: 7777
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),//热加载插件
		new webpack.DefinePlugin({
			SERVICE_API_URL: JSON.stringify('http://cms-dev.deepleaper.com'),
			SERVICE_AUTH_URL: JSON.stringify('http://auth-dev.deepleaper.com'),
		}),
	],
};
