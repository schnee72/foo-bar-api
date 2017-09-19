/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('../sqlServer');
const saltRounds = 10;

const register = (credentials, done) => {
  if (!(credentials.name || credentials.password))
    return done({ status: 412, msg: { error: 'id and password are required' } });
  sql.getUser(credentials.name, result => {
    if (result.recordset.length > 0) // exits
      return done({ status: 409, msg: { errror: 'conflict' } });
    else // doesn't exist
      bcrypt.hash(credentials.password, saltRounds)
        .then(hash => {
          sql.addUser(credentials.name, hash, () => {
            jwt.sign(getPayload(credentials.name), process.env.JWT_KEY, (err, token) => {
              if (err)
                done({status: 500, msg: { error: err }});
              else
                done({ status: 201, msg: { jwt: token } });
            });
          });
        })
        .catch(err => done({ status: 500, msg: { error: err } }));
  });
};

const login = (credentials, done) => {
  if (!(credentials.name || credentials.password))
    return done({ status: 412, msg: { error: 'id and password are required' } });
  sql.getUser(credentials.name, result => {
    if (result.recordset.length > 0) // exits
      bcrypt.compare(credentials.password, result.recordset[0].hash)
        .then(res => {
          if (res)
            jwt.sign(getPayload(credentials.name), process.env.JWT_KEY, (err, token) => {
              if (err)
                done({status: 500, msg: { error: err }});
              else
                done({ status: 201, msg: { jwt: token } });
            });
          else
            done({ status: 401, msg: { error: 'unauthorized' } });
        });
    else // doesn't exist
      return done({ status: 404, msg: { errror: 'not found' } });
  });
};

// const verify = (jwt, done) => {
// TODO - verify that the jwt is legit
// };

const getPayload = (val) => {
  return {
    exp: (Math.floor(Date.now() / 1000) + 3600),
    data: val
  };
};

module.exports = { register, login };
