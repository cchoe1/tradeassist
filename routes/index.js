var express = require('express');
var router = express.Router();
var GDAXSocketTools = require('../gdax.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('pages/index', { title: 'Trade Assist UI' });
});

router.get('/trade', function(req, res, next) {
  	res.render('pages/trade', { title: 'Trade Assist UI' });
});

router.get('/trade/api/accounts', function (req, res, next) {
	var GDAXAPI = new GDAXSocketTools.GDAXAPI();
	GDAXAPI.accounts(function(response) {
		console.log('callback working on router', response);
		res.json(JSON.parse(response));
	});
});

router.post('/trade/api/order', function(req, res, next) {
	let side = req.body.side;
	let price = req.body.price;
	let size = req.body.size;
	let product_id = req.body.product_id;

	let order_request = new GDAXSocketTools.GDAXAPI();
	let message = {};

	order_request.order(side, price, size, product_id, function(response){
		// message.order = JSON.parse(response);
		console.log('resp from order', response);
		res.json(JSON.parse(response));
	});

	/*let account_status_request = new GDAXSocketTools.GDAXAPI();
	account_status_request.accounts(function(response){
		// res.json(JSON.parse(response));
		message.account = JSON.parse(response);
		console.log('resp from acc', response);
		res.json(message);
	});*/
});


module.exports = router;
