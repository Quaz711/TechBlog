const sql = require('sequelize');

require('dotenv').config();

let sqlStore = '';

if (process.env.JAWSDB_URL) {
    sqlStore = new sql(process.env.JAWSDB_URL);
}

else {
    sqlStore = new sql(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3000
    });
}

module.exports = sqlStore;