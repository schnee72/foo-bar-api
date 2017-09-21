/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('../sqlServer');
const saltRounds = 10;

// TODO - add isAdmin flag
const register = (credentials, done) => {
  if (missingCredentials(credentials))
    return done(errorMessage(412, 'name and password are required'));
  sql.getUser(credentials.name, result => {
    if (result.recordset.length > 0)
      return done(errorMessage(409, 'conflict'));
    else
      bcrypt.hash(credentials.password, saltRounds)
        .then(hash => {
          sql.addUser(credentials.name, hash, () => {
            jwt.sign(getPayload(credentials.name), process.env.JWT_KEY, (err, token) => {
              if (err)
                done(errorMessage(500, err));
              else
                done({ status: 201, msg: { jwt: token } });
            });
          });
        })
        .catch(err => done(errorMessage(500, err)));
  });
};

const login = (credentials, done) => {
  if (missingCredentials(credentials))
    return done(errorMessage(412, 'name and password are required'));
  sql.getUser(credentials.name, result => {
    if (result.recordset.length > 0)
      bcrypt.compare(credentials.password, result.recordset[0].hash)
        .then(res => {
          if (res)
            jwt.sign(getPayload(credentials.name), process.env.JWT_KEY, (err, token) => {
              if (err)
                done(errorMessage(500, err));
              else
                done({ status: 201, msg: { jwt: token } });
            });
          else
            done(errorMessage(401, 'unauthorized'));
        })
        .catch(err => done(errorMessage(500, err)));
    else
      return done(errorMessage(404, 'not found'));
  });
};

const verify = (token, done) => {
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    done(!err && decoded !== undefined);
  });
};

const getPayload = (val) => {
  return {
    exp: (Math.floor(Date.now() / 1000) + 3600),
    data: val
  };
};

const missingCredentials = credentials => {
  return !credentials.name || !credentials.password;
};

const errorMessage = (status, err) => {
  return {status: status, msg: {error: err}};
}

module.exports = { register, login, verify };
