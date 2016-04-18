/**
 * Created by bin.shen on 4/17/16.
 */

var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../db');

router.get('/', function(req, res, next) {

    db.getConnection(function(err, connection) {
        var sql = 'SELECT id, name FROM activity_type;';
        connection.query(sql, function(err, r1) {
            if (err) throw err;
            var types = [{'':''}];
            for(var i in r1) {
                var t = {};
                t[r1[i].id] = r1[i].name;
                types.push(t);
            }
            sql = 'SELECT * FROM activity WHERE user_id = ?';
            var user = req.session.login_user;
            connection.query(sql, [user.id],function(err, r2) {
                var activities = [];
                for(var i in r2) {
                    var a = r2[i];
                    activities.push([ a.date, a.t1, a.tq1, a.t2, a.tq2, a.t3, a.tq3, a.t4, a.tq4, a.t5, a.tq5, a.id ])
                }
                res.render('tasks/index.html', { types: JSON.stringify(types), activities: JSON.stringify(activities), query: {}});
                connection.release();
            });
        });
    });
});

router.all('/manage', function(req, res, next) {

    if (req.method == 'GET' && req.body.date == undefined) {
        req.body.date = moment().format('YYYY-MM-DD');
    }
    db.getConnection(function(err, connection) {
        var sql = 'SELECT * FROM activity_type;';
        connection.query(sql, function(err, r1) {
            if (err) throw err;
            var types = [{'':''}];
            var scores = {};
            for(var i in r1) {
                var t = {};
                t[r1[i].id] = r1[i].name;
                scores[r1[i].id] = r1[i].score;
                types.push(t);
            }

            var name = req.body.name;
            var date = req.body.date;
            // var pageCurrent = req.body.pageCurrent || 1;
            // var pageSize = req.body.pageSize || 10;
            // var orderField = req.body.orderField || 'activity.date';
            // var orderDirection = req.body.orderDirection || 'desc';

            sql = ' SELECT activity.*, user.name AS user, role.id AS role_id, role.name AS role FROM activity JOIN user ON activity.user_id = user.id JOIN role ON user.role_id = role.id WHERE 1 = 1 ';
            if(date) {
                sql += ' AND activity.date = "' + date + '" ';
            }
            if(name) {
                sql += ' AND user.name LIKE "%' + name + '%" ';
            }
            // sql += ' ORDER BY ' + orderField + ' ' + orderDirection;
            // sql += ' LIMIT ' + pageSize + ' OFFSET ' + (pageCurrent - 1) * pageSize;

            var user = req.session.login_user;
            connection.query(sql, function(err, r2) {
                var activities = [];
                for(var i in r2) {
                    var a = r2[i];
                    var score = scores[a.t1] * a.tq1 + scores[a.t2] * a.tq2 + scores[a.t3] * a.tq3 + scores[a.t4] * a.tq4 + scores[a.t5] * a.tq5;
                    activities.push([ a.user, a.role, a.date, a.t1, a.tq1, a.t2, a.tq2, a.t3, a.tq3, a.t4, a.tq4, a.t5, a.tq5, score + "|" + a.role_id ])
                }
                res.render('tasks/manage.html', { types: JSON.stringify(types), activities: JSON.stringify(activities), query: req.body });
                connection.release();
            });
        });
    });
});


router.post('/edit', function(req, res, next) {

    var rows = JSON.parse(req.body.json);
    var data = rows[0];

    var addFlag = data.addFlag;
    if(undefined === addFlag) {
        var id = data.id;
        var date = data.date;
        var t1   = data.t1;
        var tq1  = data.tq1;
        var t2   = data.t2;
        var tq2  = data.tq2;
        var t3   = data.t3;
        var tq3  = data.tq3;
        var t4   = data.t4;
        var tq4  = data.tq4;
        var t5   = data.t5;
        var tq5  = data.tq5;
        db.getConnection(function(err, connection) {
            var sql = 'UPDATE activity set date = ?, t1 = ?, tq1 = ?, t2 = ?, tq2 = ?, t3 = ?, tq3 = ?, t4 = ?, tq4 = ?, t5 = ?, tq5 = ? WHERE id = ?';
            connection.query(sql, [date, t1, tq1, t2, tq2, t3, tq3, t4, tq4, t5, tq5, id], function(err, rows, fields) {
                if (err) throw err;
                connection.release();

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
    } else {
        var date = data.date;
        var t1   = data.t1;
        var tq1  = data.tq1;
        var t2   = data.t2;
        var tq2  = data.tq2;
        var t3   = data.t3;
        var tq3  = data.tq3;
        var t4   = data.t4;
        var tq4  = data.tq4;
        var t5   = data.t5;
        var tq5  = data.tq5;
        db.getConnection(function(err, connection) {
            var user = req.session.login_user;
            var sql = "select count(1) AS count from activity WHERE user_id = ? AND date = ?";
            connection.query(sql, [user.id, date, t1, tq1, t2, tq2, t3, tq3, t4, tq4, t5, tq5], function(err, rows, fields) {
                if (err) throw err;
                if(rows[0].count > 0) {
                    res.send({
                        "statusCode":"300",
                        "message":"请不要重复定制该日期的计划",
                    });
                } else {
                    sql = 'INSERT INTO activity (user_id, date, t1, tq1, t2, tq2, t3, tq3, t4, tq4, t5, tq5) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
                    connection.query(sql, [user.id, date, t1, tq1, t2, tq2, t3, tq3, t4, tq4, t5, tq5], function(err, rows, fields) {
                        if (err) throw err;
                        connection.release();

                        res.send({
                            "statusCode":"200",
                            "message":"操作成功",
                            "tabid":"my-plan, manage-plan",
                            "closeCurrent":true,
                            "forward":"",
                            "forwardConfirm":""
                        });
                    });
                }
            });
        });
    }
});

router.post('/delete', function(req, res, next) {
    var rows = JSON.parse(req.body.json);
    var data = rows[0];
    var id = data.id;
    db.getConnection(function(err, connection) {
        var sql = 'DELETE FROM activity WHERE id = ?';
        connection.query(sql, [id], function(err, rows, fields) {
            if (err) throw err;
            connection.release();
            res.send({
                "statusCode":"200",
                "message":"删除成功",
                "tabid":"my-plan, manage-plan",
                "closeCurrent":true,
                "forward":"",
                "forwardConfirm":""
            });
        });
    });
});

module.exports = router;