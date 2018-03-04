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

app.use((req, res, next) => {
  if (req.session.ua){
    if (req.session.ua !== req.headers['user-agent']) {
      req.session.regenerate((err) => {
        if (err) {
          console.log(err);
        }
      })
    }
  } else {
    req.session.ua = req.headers['user-agent'];
  }
  next();
});

routeConfig(app);


app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).send(err);
  }

  next();
})

app.listen(process.env.PORT);
