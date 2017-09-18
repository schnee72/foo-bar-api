const bcrypt = require('bcrypt');
const saltRounds = 10;

const register = (credentials, done) => {
	// TODO - make sure user doesn't already exist
	bcrypt.hash(credentials.password, saltRounds)
		.then(hash => done({status: 201, msg: {hash: hash}}))
		.catch(err => done({status: 500, msg: {error: err}}));
	// Insert user in db
};

// const login = (credentials, done) => {
	// TODO - check user in db and then generate a jwt and return it
// };

// const verify = (jwt, done) => {
	// TODO - verify that the jwt is legit
// };

module.exports = {register};