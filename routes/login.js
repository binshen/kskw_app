/**
 * Created by bin.shen on 4/17/16.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('login.html');
});

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
