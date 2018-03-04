import { User } from '../model';

const me = (req, res) => {
  if (req.session.user) {
    return res.status(200).send({
      user: req.session.user
    });
  } else {
    return res.status(200).send({
      user: false
    });
  }
}

const register = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  if (!email || !password || !confirm_password) {
    return res.status(400).end();
  }

  if (password !== confirm_password) {
    return res.status(400).end();
  }

  let this_user = new User();
  this_user.new({
    email: email,
    password: password
  })
    .then((user) => {
      if (user) {
        req.session.user = user;
        return res.status(200).send({
          user: user
        });
      } else {
        return res.status(400).end();
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).end();
    });

}

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let find_user = new User();
  find_user.findByEmail(email)
    .then((user) => {
      if (!user) {
        return res.status(400).end();
      }
      user.checkPass(password)
        .then((match) => {
          if (!match) {
            return res.status(400).end();
          } else {
            req.session.user = user.userInfo();
            return res.status(200).send({
              user: user.userInfo()
            });
          }
        })
        .catch((err) => {
          console.log(err);
          throw err;
        })
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).end();
    })
}

export default {
  me,
  register,
  login,
}
