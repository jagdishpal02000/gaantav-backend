const { createPool } = require('mysql');

const db = createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    connectionLimit:10
});




function executeQuery(queryString)
{
    return new Promise(function(resolve, reject) {
        db.query(queryString,function (err, rows, fields) {
            if (err)  return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(rows))));
        });
    });
}



module.exports = executeQuery;
