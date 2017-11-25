import webpack from 'webpack';
import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import devConfig from '../../webpack.config.dev';
import flash from 'express-flash';


export default (app) => {
	const compiler = webpack(devConfig);
	app.use(webpackDev(compiler, {
		noInfo: true, publicPath: devConfig.output.publicPath
	}));
	app.use(webpackHot(compiler));

	app.use(flash());
};