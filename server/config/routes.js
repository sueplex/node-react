import fs from 'fs';
import path from 'path';
//import log from './logConfig';
import controllers from '../controllers';

export default (app) => {

  app.post('/login', controllers.user.login);
  app.post('/register', controllers.user.register);
  app.post('/me', controllers.user.me);

  app.get('/assets/*', asset);
  app.get('*', index);
}

const tryFile = (fp, req, res) => {
  if (fs.existSync(fp)) {
    res.sendFile(fp);
  } else {
    return false
  }
}

const asset = (req, res) => {
  let fp = path.join(__dirname, '../../public', req.path);
  tryFile(fp, req, res);
  return;
}

const index = (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    res.sendFile(path.join(__dirname, '../../src/index.html'));
  } else {
    res.sendFile(path.join(__dirname, '../../public/assets/dist/index.html'));
  }
}
