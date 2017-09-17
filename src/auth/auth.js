const bcrypt = require('bcrypt');
const saltRounds = 10;

const register = (req, done) => {
	bcrypt.hash(req.body.password, saltRounds)
		.then(hash => done(hash));
}

module.exports = {register};