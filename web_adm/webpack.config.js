var path = require('path');
module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'app.bundle.js',
		publicPath: '/build/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.join(__dirname, 'src'),
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
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
			}
		]
	},
	devServer: {
		historyApiFallback: true,
		port: 3000
	}
};
