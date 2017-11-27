import webpack from 'webpack';
import config from '../webpack.config.prod';

process.env.NODE_ENV = 'production';
console.log("Generating minified production bundle...");

webpack(config).run((err, stat) => {
	if (err) {
		console.log(err + "\n\n");
		return 1
	}

	const jst = stat.toJson();

	if (jst.hasErrors) {
		return jst.errors.map(error => console.log(err));
	}

	if (jst.hasWarnings){
		console.log("Bundle Warnings\n\n");
		jst.warnings.map(warning => console.log(warning));
	}

	console.log(`Build stat: ${stat}`);

	console.log("Build complete");
	return 0;
})