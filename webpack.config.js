var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: path.resolve(__dirname, './repo/public/scripts/src/application.js'),
	output: {
		path: path.resolve(__dirname, './build/public/scripts/src'),
		filename: 'application.js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			}
		]
	},
	resolve: {
		alias: {
			'vue$': path.resolve(__dirname, './node_modules/vue/dist/vue.esm.js')
		}
	},
	performance: {
		hints: false
	}
}
