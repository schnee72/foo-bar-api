/* eslint-disable no-console */
const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.use((req, res, next) => {
  if (req.headers.authorization !== process.env.AUTH_KEY)
    res.status(401).json({ "error": "unauthorized" });
  next();
});

router.get('/', (req, res) => res.send('auth!'));

router.post('/register', (req, res) =>
  auth.register(req.body.credentials, ret =>
    res.status(ret.status).json(ret.msg)));

router.post('/login', (req, res) => {
  auth.login(req.body.credentials, ret =>
    res.status(ret.status).json(ret.msg));
});

// router.post('/verify', (req, res) => {
//   auth.verify(req.body.jwt, ret => ret ?
//     res.send(ret) : res.status(401).send(ret));
// });

module.exports = router;
