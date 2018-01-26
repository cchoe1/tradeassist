var express = require('express');
var router = express.Router();
var GDAXSocketTools = require('../gdax.js');
var SocketMiddleware = require('../socket.js');


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
});

router.get('/trade/api/fills', function(req, res, next) {
	let FillRequest = new GDAXSocketTools.GDAXAPI();
	let start_url = '/fills?product_id=BTC-USD';
	let starting_coin = 'BTC-USD';
	let product_id = '';

	FillRequest.fills(start_url, function(response) {
		
		let totalObj = [];
    	
		let initial_response = JSON.parse(response);
    	totalObj.push(initial_response);
	
		let last_obj = initial_response[initial_response.length - 1];
		let last_trade_id = last_obj.trade_id;


    	let coins = ['BTC-USD', "ETH-USD", "LTC-USD", "BCH-USD", "ETH-BTC", "LTC-BTC", "BCH-BTC"];
		let i = 0;
	
		function start(trade_id, fills, newUrl) {
			newUrl = newUrl || undefined;

			if (fills.length !== 100) {
				console.log("Not long enough to qualify", fills.length);
    			if(coins[i] === coins[coins.length - 1]){
    				// Pass response to server for handling...
					let combined = [];

					totalObj.forEach(function(r){
        			    r.forEach(function(trade) {
        			        combined.push(trade);
        			    }.bind(this));
        			    combined.sort(function(a,b){
        			        return new Date(b.created_at) - new Date(a.created_at);
        			    });
        			}.bind(this));

					let UserHistory = new SocketMiddleware.UserHistory();
					UserHistory.importHistory(totalObj);
					res.json(combined);
    				return;
    			}
    			else {
    				i++;
    				console.log("i = ", i);
    				let elseEndpoint = '/fills?product_id=' + coins[i];// + '&before=' + trade_id;

    				setTimeout(function(elseEndPoint) {
    					let FillReqElse = new GDAXSocketTools.GDAXAPI();
						FillReqElse.fills(elseEndpoint, function(fromLoopElse){
    						console.log("new endpoint from else...", elseEndpoint);

							console.log("The type...", typeof fromLoopElse);
							if(typeof fromLoopElse == 'string') {
								fromLoopElse = JSON.parse(fromLoopElse);

								if (fromLoopElse.length === 0){
									last_trade_id = '';
									new_url = '';
									start.call(this, last_trade_id, fromLoopElse);
								}
								else{
									totalObj.push(fromLoopElse);
									last_trade_id = fromLoopElse[fromLoopElse.length - 1].trade_id;
									let new_url = '/fills?product_id=' + coins[i] + "&after=" + last_trade_id;
									start.call(this, last_trade_id, fromLoopElse[0], new_url);
								}
							}
							else{
								totalObj.push(fromLoopElse[0]);
								last_trade_id = fromLoopElse[0][fromLoopElse[0].length - 1].trade_id;
								let new_url = '/fills?product_id=' + coins[i] + "&after=" + last_trade_id;
								// start(last_trade_id, fromLoopElse[0], new_url);
								start.call(this, last_trade_id, fromLoopElse[0], new_url);
							}
							//start.bind(this);

							// callback.bind(this);
						}.bind(totalObj));
    				}.bind(this, totalObj, trade_id), 600);
    			}
    		}
    		else if (newUrl !== undefined){
    			let endpoint = newUrl;
    			//let endpoint = '/fills?product_id=' + coins[i] + '&after=' + trade_id;

    			let timeout = setTimeout(function() {
    				console.log("new endpoint...", endpoint);
    				let FillReq = new GDAXSocketTools.GDAXAPI();

					FillReq.fills(endpoint, function(fromLoop){
						// console.log('Received a response...', fromLoop);
						// console.log("The response within setTimeout...", fromLoop);
						//console.log("Main...", fromLoop);
						totalObj.push(fromLoop[0]);
						last_trade_id = fromLoop[0][fromLoop[0].length - 1].trade_id;
						if(last_trade_id === trade_id) {
							last_Trade_id = '';
						}
						// console.log("Last ", fromLoop[0].length, fromLoop[0][fromLoop[0].length - 1]);
						start(last_trade_id, fromLoop[0]);
					}.bind(this, totalObj, last_trade_id, trade_id));
    			}.bind(totalObj, last_trade_id, endpoint, trade_id), 600);
    		}
		}




		// console.log("Before invoking loop...", initial_response);
		// start(last_trade_id, initial_response);
		start.call(this, last_trade_id, initial_response);
	});
});


module.exports = router;


/*function setTimeoutFunc() {
			let FillReq = new GDAXSocketTools.GDAXAPI();
			FillReq.fills(endpoint, function(resp){
				totalObj.push(resp);
				last_trade_id = JSON.parse(resp).trade_id;
			}.bind(totalObj, last_trade_id));

			return last_id
		}*/
		/*let totalObj = [];


		let initial_response = JSON.parse(response);
		let last_obj = initial_response[initial_response.length - 1];
		let last_trade_id = last_obj.trade_id;

        let coins = ['BTC-USD', "ETH-USD", "LTC-USD", "BCH-USD", "ETH-BTC", "LTC-BTC", "BCH-BTC"];*/

        /*coins.forEach(function(coin){
            let base = '/fills?product_id=' + coin;
            // let coin = coins[i];
            let trade_id = "&" + "after=" + last_trade_id;

            let endpoint = base + trade_id;

            setTimeout(setTimeoutFunc.bind(endpoint), 1500);



            
        }.bind(totalObj, last_trade_id));*/
        /*let i = 0;
    	while(true) {
    		if(resp === ''){
    			if(coins[i] === coins[coins.length - 1]){
    				break;
    			}
    			else {
    				i++;
    				continue;
    			}
    		}
    		function sendFillsReq() {
				let FillReq = new GDAXSocketTools.GDAXAPI();
				FillReq.fills(endpoint, function(resp){
					totalObj.push(resp);
					last_trade_id = JSON.parse(resp).trade_id;
				}.bind(totalObj, last_trade_id));

			return last_id
    		}
    		function callback(resp) {
    			setTimeout(sendFillsReq.bind(endpoint), 1500);
    		}
    		sendFillsReq();
    	}

		// Pass response to server for handling...
		let UserHistory = new GDAXSocketTools.UserHistory();
		UserHistory.importHistory(response);
		res.json(JSON.parse(response));
	});*/