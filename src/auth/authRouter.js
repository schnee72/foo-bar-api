const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.get('/', (req, res) => res.send('auth!'));

router.post('/register', (req, res) => {
	auth.register(req.body.credentials, hash => res.json({hash: hash}));
});

router.post('/login', (req, res) => {
	res.send('login!');
});

router.post('/verify', (req, res) => {
	res.send('verify!');
});

module.exports = router;