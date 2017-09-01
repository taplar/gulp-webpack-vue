var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: path.resolve(__dirname, './repo/public/scripts/src/application.js'),
	output: {
		path: path.resolve(__dirname, './build/scripts/public/scripts/src'),
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
			, 'vuex$': path.resolve(__dirname, './node_modules/vuex/dist/vuex.esm.js')
			, 'vue-resource$': path.resolve(__dirname, './node_modules/vue-resource/dist/vue-resource.js')
		}
	},
	performance: {
		hints: false
	}
}
