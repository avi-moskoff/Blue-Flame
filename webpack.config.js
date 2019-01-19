const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
	target: "web",
	entry: "./src/ts/index.tsx",
	devtool: "inline-source-map",
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		})
	],
	module: {
		rules: [{
			test: /\.tsx?$/,
			use: "ts-loader",
			exclude: /node_modules/
		}]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".json"]
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "js/bundle.min.js"
	},
    externals: {
		'fs': 'commonjs fs', 
		'perf_hooks': 'commonjs perf_hooks',
		'readline': 'commonjs readline'
    },
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					warnings: false,
					mangle: false
				}
			})
		]
	}
};