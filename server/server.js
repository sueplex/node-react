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
    return res.status(500).send(err);
  }
  next();
})
if (process.env.NODE_ENV !== 'development') {
  app.get('*', (req, res) => {
    let asset = req.url.replace("/", "");
    let prefix = asset.split(".")[0]
    if (prefix !== "main") {
      asset = "index.html";
    }
    res.sendFile(path.join(__dirname, '../public/assets/dist', asset));
  });
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
  })
}

app.listen(process.env.PORT);
