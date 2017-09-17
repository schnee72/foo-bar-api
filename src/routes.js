const express = require('express');
const router = express.Router();
const authRouter = require('./auth/authRouter');
const pingRouter = require('./ping/pingRouter');

router.use('/auth', authRouter);
router.use('/ping', pingRouter);

module.exports = router;
