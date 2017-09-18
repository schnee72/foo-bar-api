/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sql = require('../sqlServer');

const register = (credentials, done) => {
  if (!(credentials.name || credentials.password))
    return done({ status: 412, msg: { error: 'id and password are required' } });
  sql.getUser(credentials.name, result => {
    if (result) // exits
      return done({ status: 409, msg: { errror: "conflict" } });
    else // doesn't exist
      bcrypt.hash(credentials.password, saltRounds)
        .then(hash => {
          sql.addUser(credentials.name, hash, () => {
            // TODO - generate jwt
            done({ status: 201, msg: { hash: hash } });
          });
        })
        .catch(err => done({ status: 500, msg: { error: err } }));
  });
};

// const login = (credentials, done) => {
// TODO - check user in db and then generate a jwt and return it
// };

// const verify = (jwt, done) => {
// TODO - verify that the jwt is legit
// };

module.exports = { register };
