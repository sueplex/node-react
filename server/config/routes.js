import controllers from '../controllers';

export default (app) => {
  app.post('/login', controllers.account.login);
}
