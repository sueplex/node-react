import bcrypt from 'bcryptjs';
import axios from 'axios';
//import qr from 'qrious';
//import crypto from 'crypto';
/*
User {
  username => string,
  password => string,
  tfa_user => bool,
  tfa_type => string,
  tfa_secret => string,
  tfa_counter => int
}
*/

let USERS = [];

const login = (req, res) => {
  let username = req.body.name;
  let pass = req.body.pass;
  switch (req.body.action){
    case 'login':
      user = find_user(username)
      if (!user) {
        return res.status(401).send({
          err: "Invalid Username and Password"
        });
      }
      bcrypt.compare(pass, user.password)
        .then((match) => {
          if (match) {
            if (user.tfa_user === true) {
              return res.status(200).send({
                tfa: true,
              });
            } else {
              let time_now = Date.now();
              return res.status(200).send({
                tfa: false,
                cookies: {
                  username: user.username,
                  ak: user.username + "_" + time_now
                }
              });
            }
          } else {
            return res.status(401).send({
              err: "Invalid Username and/or Password."
            });
          }
        });
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
            return res.status(500).end();
          }
          bcrypt.hash(reg_pass, salt, (err, hash) => {
            newUser.password = hash;
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
      let user = find_user(username);
      if (user === false) {
        return res.status(400).send({
          err: "User Does Not Exist."
        });
      }
      let options = {
        Secret: user.tfa_secret,
        Code: tfa_code
      };
      switch (user.tfa_type) {
        case "TOTP":
          options.Type = "TOTP";
          break;
        case "HOTP":
          options.Type = "HOTP";
          options.Counter = user.tfa_counter;
          break;
        default:
          return res.status(401).send({
            err: "Invalid Request"
          });
      }

      axios.post('http://localhost:3031/', options)
        .then((response) => {
          if (response.data.Valid === true) {
            if (options.Type === "HOTP") {
              user.tfa_counter = response.data.Counter;
            }
            let time_now = Date.now();
            return res.status(200).send({
              cookies: {
                  tfa: false,
                  username: user.username,
                  ak: user.username + "_" + time_now
                }
            })
          }
          return res.status(401).send({
            err: "Invalid Code."
          });
        });
      break;

    default:
      return res.status(401).send({
        err: "Invalid Request"
      })
  }
}

const find_user = (username) => {
  let user;
  USERS.forEach((thisUser) => {
    if (thisUser.username === username) {
      user = thisUser;
    }
  });
  return user;
}

const tfa_setup = (req, res) => {
  const username = req.body.name;
  let user = find_user(username);
  if (!user) {
    return res.status(403).end();
  }
  let options = {};
  switch (req.body.action) {
    case 'gen_code':
      options = {
        Account: user.username,
        Issuer: "Auth"
      }
      if (req.body.type === "TOTP" || req.body.type ==="HOTP") {
        options.Type = req.body.type;
      } else {
        return res.status(401).send({
          err: "Invalid Request"
        });
      }
      axios.post("http://localhost:3031/new", options)
        .then((response) => {
          user.tfa_secret = response.data.Secret
          if (req.body.type === "HOTP") {
            user.tfa_counter = response.data.Counter;
          }
          let qrLink = response.data.Link
          let b = Buffer.from(qrLink).toString('base64');
          return res.status(200).send({x: b });
        });
      break;

    case 'enable':
      const tfa_code = req.body.tfa_code;
      options = {
        Secret: user.tfa_secret,
        Code: tfa_code
      };
      if (req.body.type === "TOTP" || req.body.type ==="HOTP") {
        options.Type = req.body.type;
      } else {
        return res.status(401).send({
          err: "Invalid Request"
        });
      }
      if (options.Type === "HOTP") {
        options.Counter = user.tfa_counter;
      }
      axios.post("http://localhost:3031/", options)
        .then((response) => {
          if (response.data.Valid === true) {
            user.tfa_user = true;
            user.tfa_type = options.Type;
            if (options.Type === "HOTP") {
              user.tfa_counter = response.data.Counter;
            }
          }
          return res.status(200).send({valid: response.data.Valid});
        })
      break;

    default:
      return;
  }

}

export default {
  login,
  tfa_setup
}
