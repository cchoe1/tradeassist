var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Trade Assist UI' });
});

router.get('/trade', function(req, res, next) {
  	res.render('pages/trade', { title: 'Trade Assist UI' });
});



module.exports = router;
