var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.login_user) {
        res.render('index.html', { user: req.session.login_user });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
