import bcrypt from 'bcryptjs';
import axios from 'axios';
//import crypto from 'crypto';

let USERS = [];

const login = (req, res) => {
  switch (req.body.action){
    case 'login':
      let username = req.body.name;
      let pass = req.body.pass;
      USERS.forEach((user) => {
        if (username === user.username) {
          bcrypt.compare(pass, user.password)
            .then((match) => {
              if (match) {
                if (user.tfa_user === true) {
                  return res.status(200).send({
                    tfa: true,
                    username: user.username
                  })
                } else {
                  let time_now = Date.now();
                  axios.post('http://localhost:3031/?secret=sage')
                    .then((response) => {
                      console.log(response.data.Code);
                      console.log(response.data.Valid)
                    })
                  return res.status(200).send({
                    tfa: true,
                    cookies: {
                      username: user.username,
                      ak: user.username + "_" + time_now
                    }
                  })
                }
              } else {
                return res.status(401).send({
                  err: "Invalid Username and/or Password."
                });
              }
            });
        }
      })

      break;

    case 'register':
      let reg_user = req.body.name;
      let reg_pass = req.body.pass;
      let reg_pass_con = req.body.pass_confirm;

      if (reg_pass === reg_pass_con) {
        let newUser = {
          username: reg_user
        };

        bcrypt.genSalt(8, (err, salt) => {
          if (err) {
            console.log(err);
            return res.status(500).end();
          }
          bcrypt.hash(reg_pass, salt, (err, hash) => {
            newUser.password = hash;
            console.log(newUser);
            USERS.push(newUser);
          });
        });
        let time_now = Date.now();
        return res.status(200).send({
          tfa: false,
          cookies: {
            username: newUser.username,
            ak: newUser.username + "_" + time_now
          }
        })
      } else {
        return res.status(401).send({
          err: "Passwords do not match"
        });
      }

    case 'tfa':
      let tfa_code = req.body.tfa_code;
      return res.status(201).send({
        cookies: {
            tfa: false,
            code: tfa_code,
            //username: newUser.username,
            //ak: newUser.username + "_" + time_now
          }
      })

    default:
      return res.status(401).end();
  }

  //return res.status(400).end();
}


export default {
  login
}
