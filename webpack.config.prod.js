import webpack from 'webpack';
import Extract from 'extract-text-webpack-plugin';
import md5 from 'webpack-md5-hash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default {

	resolve: {
		extensions: ['*', '.js', '.jsx', '.json']
	},

	devtool: 'source-map',

	entry: path.resolve(__dirname, 'src/index'),

	target: 'web',

	output: {
		path: path.resolve(__dirname, 'public'),
		publicPath: '/',
		filename: '[name].[chunkhash].js',
	},

	plugins: [
		new md5(),

		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			__DEV__: false
		}),

		new Extract('[name].[contenthash].css'),

		new HtmlWebpackPlugin({
			template: 'src/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				//removeEmptyAttributes: true,
				//removeStyleLinkTypeAttributes: true,
				//keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			},
		inject: true
		}),

		new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),

		new webpack.LoaderOptionsPlugin({
			minify: true,
			debug: false,
			noInfo: false,
			options: {
				sassLoader: {
					includePaths: path.resolve(__dirname, 'src', 'scss')]
				},
				context: '/',
				postcss: () => autoprefixer
			}
		})
	],

	modules: {
		rules: [
			{test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
			{test: /(\.css|\.scss|\.sass)$/, loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')}
    	]
	}
}