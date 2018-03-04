import session from 'express-session';
import bodyParser from 'body-parser';
//import method from 'method-override';
import express from 'express';
import gzip from 'compression';
import helmet from 'helmet';
import cors from 'cors';
//import path from 'path';
const sess = {
  resave: false,
  name: '_ss',
  saveUninitialized: false,
  secret: 'secret',
  cookie: {
    httpOnly:true,
  }
};

export default (app) => {

	app.set('port', process.env.PORT);

	if (process.env.NODE_ENV === 'production') {
		app.use(gzip());
		app.use(helmet());
	}
  app.use(session(sess));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json({ limit: '100mb' }));
	app.use(cors());
	app.use(express.static(global.appRoot + '../public/assets'));
}
