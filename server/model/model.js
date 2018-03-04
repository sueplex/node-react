import db from '../data/mysql/connection';
import log from '../config/logConfig';
import util from 'util';
import mysql from 'mysql';

export default class Model {

  /**
   * getQuery pulls information from the object
   * begins with the `columns` string from object model
   * and constructs:
   * columns string i.e : `(name, password, created_at)`
   * prep string i.e    : `(?, ?, ?)'`
   * values array i.e   : ['John Doe', 'password', 'idk']
   * keys array i.e     : ['name', 'password', 'created_at']
   *
   * @return {object} columns, prep, values, keys
   */
  getQuery(){
    // values to enter into query
    let values = Array();
    let keys = Array();

    // get VALUE for each KEY in query string
    this.columns.split(', ').forEach((key) => {
      values.push(this[key]);
      keys.push(key);
    });

    return {
      columns      : '(' + this.columns + ')',
      prep        : '(' + Array(this.columns.split(',').length).join('?, ') + '?)', // (?, ?, ... ?,)
      values      : values,
      keys        : keys,
    };
  }

  /**
   * preSave actions to be dealt with before the object is saved
   * default just update the last modified time and return promise
   * (overwritable in extended model)
   *
   * @return {Promise} resolved promise
   */
  preSave() {
     let presave = new Promise((resolve/*, reject*/) => {
       this.updated_at = Date.now();
       return resolve(this);
    });
     return Promise.resolve(presave);
  }

  /**
   * save from this current model (overwritable in extended model)
   * determine whether to update full object value or to insert new
   * object to database from new flag set on the extended object model
   *
   * @return {object} this post save
   */
  save() {

    // create promise for save operation.
    let save = new Promise((resolve, reject) => {

      // execute presave objectives
      this.preSave()
        .then(() => {

        // pull object query data
        let q = this.getQuery()
        let queryString = "";
        // new object full save
        if (this.new === true) {

          // insert into table with full query data
          // queryString = 'INSERT INTO ' + this.table + ' '
          //   + q.query + ' values ' + q.prep;
          queryString = util.format(
            "INSERT INTO %s %s VALUES %s;",
            this.table, q.columns, q.prep
            );
        }
        // update existing object
        else {
          let updateString = "";
          q.keys.forEach((key) => {
            updateString += key + " = ?, "
          });
          updateString = updateString.slice(0, -2);

          // construct query string
          queryString = util.format(
            "UPDATE %s SET %s WHERE id = ?;",
            this.table, updateString
            );
          // if this object already exists add id to end for update
          q.values.push(this.id);
        }

        // Execute query with values
        this.query(queryString, q.values)
          .then((result) => {
            // if we get a result back and we don't have the id
            // add id from where the row was inserted into db
            if (!this.id && result.insertId) {
              this.id = result.insertId;
            }
            // resolve object for promise
            resolve(this);
          })
          .catch((err) => {
            // log err and reject promise
            log.Error(err);
            reject(err);
          });
      })
    });

    return Promise.resolve(save);
  }

  /**
   * findByColumn find row where column has the value
   * in a given table
   *
   * @param {string} column db column
   * @param {string} value db match value
   *
   * @return {object} object
   */
  findByColumn(column, value) {
    let queryString = util.format("SELECT * FROM %s WHERE %s = ? LIMIT 1;", this.table, column);
    return this.query(queryString, value)
       .then((result) => {
          if (result[0]) {
            this.constructor(result[0]);
            return this;
          } else {
            return false;
          }
       })
       .catch((err) => {
         log.Error(err);
         return false;
       });
  }

  /**
   * findById find by column with column id
   *
   * @param {int} id ID Number for this table
   *
   * @return {object} object
   */
  findById(id) {
    return this.findByColumn('id', id);
  }

  /**
   * query execute prepared statement in mysql database
   *
   * @param {string} queryString prepared statement query string
   * @param {array} values entries to execute into query string
   *
   * @return {mixed} results from query
   */
  query(queryString, values) {
    let queryPromise = new Promise((resolve, reject) => {
      db.query(mysql.format(queryString, values))
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          log.Error(err);
          reject(err);
        });
    });

    return Promise.resolve(queryPromise);
  }
}


