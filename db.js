/**
 * Created by bin.shen on 4/17/16.
 */

var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host     : '121.40.97.183',
    user     : 'root',
    password : 'k2s0l1s6qwe123!@#',
    database : 'kskw_db',
    timezone : 'Asia/Shanghai'
});

module.exports = pool;