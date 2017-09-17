const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.get('/', (req, res) => res.send('auth!'));

router.post('/register', (req, res) => auth.register(req, h => res.json({h: h})));

module.exports = router;