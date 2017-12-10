import controllers from '../controllers';

export default (app) => {
  app.post('/login', controllers.account.login);
  app.post('/tfa', controllers.account.tfa_setup);
}
