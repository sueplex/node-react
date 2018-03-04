import path from 'path';
import fs from 'fs';
import { createLogger, format, transports } from 'winston';

// Determine logging directory from env or default to Linux
// base /var/log/ directory in the node folder
// if the process running doesn't have permissions to access
// this directory the logging will default to the console
const logdir = process.env.LOG_DIR || "/var/log/node";

// e.g: /var/log/node/error.log
const error = path.join(logdir, "error.log");
const event = path.join(logdir, "event.log");
const access = path.join(logdir, "access.log");



const console = new transports.Console();

// different logging transports --
// Error, Events, Access
let ErrorLog = createLogger({
  format: format.combine(
    format.timestamp(),
    format.simple(),
    )
});
ErrorLog.clear();
ErrorLog.add(console);

let EventLog = createLogger();
EventLog.clear();
EventLog.add(console);

let AccessLog = createLogger();
AccessLog.clear();
AccessLog.add(console);

if (!fs.existsSync(logdir)) {
  try {
    fs.mkdirSync(logdir, "0o755");
    fs.close(fs.openSync(error, '+a'));
    fs.close(fs.openSync(event, '+a'));
    fs.close(fs.openSync(access, '+a'));
  }
  catch(err){
    console.log("Could not open log files");
  }
}

if (fs.existsSync(error)) {
  ErrorLog.remove(console);
  ErrorLog.add(new transports.File({
    filename: error,
  }));
}

if (fs.existsSync(event)) {
  EventLog.remove(console);
  EventLog.add(new transports.File({
    filename: event,
  }));
}

if (fs.existsSync(access)) {
  AccessLog.remove(console);
  AccessLog.add(new transports.File({
    filename: access,
  }));
}
/**
 * Error log error to error log file
 * @param {Error} err error to log
 * @return {null} no return
 */
const Error = (err) => {
  ErrorLog.log({
    level: "error",
    message: err.stack
  });
}

/**
 * Event log event to event log file
 * @param {object} obj description object
 * @return {null} no return
 */
const Event = (obj) => {
  EventLog.log("info", obj);
}

const Access = (obj) => {
  AccessLog.log("info", obj);
}


export default {
  Error,
  Event,
  Access,
};
