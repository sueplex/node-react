import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default {
  mode: "development",
	resolve: {
		extensions: ['*', '.js', '.jsx', '.json']
	},

	devtool: 'cheap-module-eval-source-map',

	entry: [
		// Reloading in dev
		'./src/webpack-public-path',
		'webpack-hot-middleware/client?reload=true',
		path.resolve(__dirname, 'src/index.js')
	],

	target: 'web',

	output: {
		path: path.resolve(__dirname, 'public/assets/dist'),
		publicPath: '/',
		filename: 'bundle.js'
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
			__DEV__: true
		}),

		new webpack.HotModuleReplacementPlugin(),

		new webpack.LoaderOptionsPlugin({
			minimize: false,
			debug: true,
			noInfo: false,
			options: {
				sassLoader: {
					includePaths: [path.resolve(__dirname, 'src', 'scss')]
				},
				context: '/',
				postcss: () =>[autoprefixer]
			}
		})
	],

	module: {
		rules: [
			{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
			{
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        loader: 'file-loader'
      },
			{
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{ loader: 'url-loader', options: {limit:' 10000', mimetype: 'application/font-woff'} }]
			},
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [{ loader: 'url-loader', options: {limit: '10000', mimetype: 'application/octet-stream'} }]
			},
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: 'url-loader', options: {limit: '10000', mimetype: 'image/svg+xml'} }]
			},
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [{ loader: 'file-loader', options: {name: '[name].[ext]'} }]
			},
      {
        test: /\.ico$/,
        use: [{ loader: 'file-loader', options: {name: '[name].[ext]'} }]
			},
      {
        test: /(\.css|\.scss|\.sass)$/,
        use: [
          { loader: 'style-loader', options: {sourceMap: true} },
          { loader: 'css-loader', options: {sourceMap: true} },
          { loader: 'postcss-loader', options: {sourceMap: true} },
          { loader: 'sass-loader', options: {sourceMap: true} }
        ]
      }
		]
	}
}
