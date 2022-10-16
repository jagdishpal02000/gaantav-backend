const { createPool } = require('mysql');

const db = createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'gaantav',
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
