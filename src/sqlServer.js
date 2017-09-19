/* eslint-disable no-console */
const sql = require('mssql');

const config = {
  "user": process.env.SQL_USER,
  "password": process.env.SQL_PASSWORD,
  "server": process.env.SQL_SERVER,
  "database": process.env.SQL_DB,
  "options": { "encrypt": true }
};

sql.connect(config);
sql.on('error', err => console.log(err));

const getUser = (name, done) => {
  new sql.Request()
    .input('name', name)
    .query('select * from dbo.auth where name = @name')
    .then(result => done(result))
    .catch(err => console.log(err));
};

const addUser = (name, hash, done) => {
  new sql.Request()
    .input('name', name)
    .input('hash', hash)
    .query('insert into dbo.auth (name, hash) values(@name, @hash)')
    .then(() => done())
    .catch(err => console.log(err));
};

module.exports = { getUser, addUser };
