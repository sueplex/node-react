import bcrypt from 'bcryptjs';
import util from 'util';
import Model from './model';
import log from '../config/logConfig';

const SALT_WORK_FACTOR = 8;

export default class User extends Model {

  constructor(info) {
    super(info);
    this.table = 'users';
    this.columns = 'email, password, created_at, updated_at';
    if (info) {
      this.id = info.id;
      this.email = info.email;
      this.password = info.password;
      this.updated_at = info.updated_at;
      this.created_at = info.created_at;
    }
  }

  /**
   * Return relevant information that
   * can exit the application
   * @return {object} user information
   */
  userInfo() {
    return {
      id        : this.id,
      email     : this.email,
      created_at: this.created_at,
    }
  }

  /**
   * Create new user -- mark creation time
   * and hash password before saving to DB
   * @param {object} info user info
   * @return {object} user information
   */
  new(info) {
    return this.findByEmail(info.email)
      .then((user) => {
        if (user) {
          return false;
        }
        this.new = true;
        this.created_at = Date.now();
        this.email = info.email;
        return this.hashPassword(info.password)
          .then((user)=> {
            // Create user succes
            user.new = false;
            return user.userInfo();
          })
          .catch((err) => {
            // tick/log
            log.Error(err)
            return false
          });
        })
        .catch((err) => {
          log.Error(err);
          return false
        });
  }

  /**
   * Hash user password and save
   * @param {string} password user password
   * @return {object} user or false if no password
   */
  hashPassword(password) {
    if (password) {
      return bcrypt.hash(password, newSalt())
        .then((hash) => {
          this.password = hash;
          this.save();
          return this;
        })
        .catch((err) => {
          throw err;
        });
    }
    else {
      return false;
    }
  }

  checkPass(password) {
    if (password) {
      return bcrypt.compare(password, this.password)
        .then((match) => {
          if (match) {
            return true;
          }
          return false;
        })
        .catch((err) => {
          log.Error(err);
        })
    }
    return false;
  }

  changeField(field, value) {
    if (field === 'password') {
      return this.hashPassword(value);
    } else {
      this[field] = value;
      this.save();
    }
  }

  search(parameters) {
    let queryString = util.format("SELECT id, name, email, created_at FROM %s WHERE", this.table);
    let values = Array();
    let first = false;
    for(let key in parameters) {
      if (0 <= ['id','name', 'email'].indexOf(key)) {
        if (!first){
          first = true;
          queryString = util.format("%s %s=?", queryString, key);
        } else {
          queryString = util.format("%s OR %s=?", queryString, key);
        }
        values.push(parameters[key])
      }
    }
    return this.query(queryString, values)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        log.Error(err);
        return false;
      })

  }

  /**
   * Find user by email associated email address
   * @param {string} email users email
   * @return {object} user or false if no user
   */
  findByEmail(email) {
    return this.findByColumn('email', email);
  }


}

const newSalt = () => {
  return bcrypt.genSaltSync(SALT_WORK_FACTOR);
}
