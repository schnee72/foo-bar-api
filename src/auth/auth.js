/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('../sqlServer');
const saltRounds = 10;

const register = (credentials, done) => {
  if (!(credentials.name || credentials.password))
    return done({ status: 412, msg: { error: 'id and password are required' } });
  sql.getUser(credentials.name, result => {
    if (result) // exits
      return done({ status: 409, msg: { errror: "conflict" } });
    else // doesn't exist
      hash(credentials.password, hash => {
        if (hash.error)
          done({ status: 500, msg: hash.error });
        else
          generateJwt(credentials.name, token => {
            if (token.error)
              done({ status: 500, msg: token.error });
            else
              done({ status: 201, msg: { jwt: token } });
          });
      });
  });
};

// const login = (credentials, done) => {
// TODO - check user in db and then generate a jwt and return it
// };

// const verify = (jwt, done) => {
// TODO - verify that the jwt is legit
// };

const hash = (password, done) => {
  bcrypt.hash(password, saltRounds)
    .then(hash => done(hash))
    .catch(err => done({ error: err }));
}

const generateJwt = (name, done) => {
  jwt.sign(getPayload(name), process.env.JWT_KEY, (err, token) => {
    if (err)
      done({ error: err });
    else
      done(token);
  });
};

const getPayload = (val) => {
  return {
    exp: (Math.floor(Date.now() / 1000) + 3600),
    data: val
  };
};

module.exports = { register };
