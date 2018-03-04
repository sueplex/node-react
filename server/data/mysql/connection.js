import mysql from 'mysql';
import log from '../../config/logConfig';

// database connection info
const primary = {
  connectionLimit : 5,
  host            : process.env.NODE_ENV === 'development' ? 'localhost' : '',
  user            : 'node_user',
  password        : 'password',
  database        : 'node_db'
};

// database query errors
const E_DB = {
  NOT_FOUND : new Error("Object not found"),
  NO_CONN   : new Error("No Database Connection"),
  BAD_QUERY : new Error("Passed query invalid"),
}

// create mysql connection pool fomr primary information
let pool = mysql.createPool(primary);


const query = (queryString) => {
  let pv = new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if(err) {
        log.Error(E_DB.NO_CONN);
        return reject(E_DB.NO_CONN);
      }
      conn.query(queryString, (err, result/*, fields*/) => {
        conn.release();
        if (err) {
          log.Error(E_DB.BAD_QUERY);
          return reject(E_DB.BAD_QUERY);
        } else {
          return resolve(result);
        }
      })
    })
  })
  return Promise.resolve(pv);
}

export default {
  query,
  E_DB,
};
