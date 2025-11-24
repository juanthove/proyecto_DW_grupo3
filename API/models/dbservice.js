const pool = require('mariadb');

const connection = pool.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "api_e_market",
    connectionLimit: 5
});

module.exports = connection;