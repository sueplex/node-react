import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import devConfig from './config/devConfig';
import routeConfig from './config/routes';
import expressConfig from './config/expressConfig';

dotenv.load();
global.appRoot = path.resolve(__dirname)

const app = express();

if (process.env.NODE_ENV !== 'production') {
	devConfig(app);
}
expressConfig(app);
routeConfig(app);


app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    return res.status(500).send(err);
  }
  next();
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../src/index.html'))
});

app.listen(process.env.PORT);
