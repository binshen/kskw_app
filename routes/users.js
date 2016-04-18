var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {

    db.query('SELECT * FROM department', function(err, rows, fields) {
        if (err) throw err;
        console.log(rows[0]);
    });


    db.getConnection(function(err, connection) {
        connection.query('SELECT * FROM department', function(err, rows, fields) {
            if (err) throw err;
            console.log(rows[0]);
            connection.release();
        });
    });

    res.send('respond with a resource');
});


router.post('/login', function(req, res, next) {

    var session = req.session;
    var username = req.body.username;
    var password = req.body.password;
    db.getConnection(function(err, connection) {
        var sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
        connection.query(sql, [username, sha1(password)], function(err, rows, fields) {
            if (err) throw err;
            var user = rows[0];
            if(undefined == user) {
                res.redirect('/login');
            } else {
                session.login_user = user;
                //res.render('index.html', user);
                res.redirect('/');
            }
            connection.release();
        });
    });
});

router.post('/change_password', function(req, res, next) {
    var session = req.session;
    var login_user = session.login_user;
    var old_password = sha1(req.body.old_password);
    if(old_password !== login_user.password) {
        res.send({
            "statusCode":"300",
            "message":"原始密码输入不正确",
        });
    } else {
        var new_password = sha1(req.body.password);
        db.getConnection(function(err, connection) {
            var sql = 'UPDATE user set password = ? WHERE id = ?';
            connection.query(sql, [new_password, login_user.id], function(err, rows, fields) {
                if (err) throw err;
                connection.release();
                login_user.password = new_password;

                console.log("++++++++++++++++++")
                console.log(login_user);

                session.login_user = login_user;
                res.send({
                    "statusCode":"200",
                    "message":"操作成功",
                    "tabid":"my-plan, manage-plan",
                    "closeCurrent":true,
                    "forward":"",
                    "forwardConfirm":""
                });
            });
        });
    }
});

module.exports = router;
