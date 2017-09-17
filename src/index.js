/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');

const routes = require('./routes');
const app = express();
const port = process.env.PORT || 7331;

if (process.env.NODE_ENV === 'production')
	app.use(morgan('combined'));
else
	app.use(morgan('dev'));

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compression());
app.use('/', routes);

app.listen(port, err => {
	if (err)
		console.log(err);
	else
		console.log(`Listening on port ${port}`);
});