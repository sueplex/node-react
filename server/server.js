import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import devConfig from './config/devConfig';
import expressConfig from './config/expressConfig';

dotenv.load();
global.appRoot = path.resolve(__dirname)

const app = express();
/* express config */

//app.set('port', SERVER_PORT);

// ROOTDIR/public
//app.use(express.static(path.join(__dirname, '../src/')));

if (process.env.NODE_ENV !== 'production') {
	devConfig(app);
}


app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../src/index.html'))
});

app.listen(process.env.PORT);