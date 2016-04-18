var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.html', { user: req.session.login_user });
});

module.exports = router;
