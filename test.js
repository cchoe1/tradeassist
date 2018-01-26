class ServerSideRequest {
    constructor(exchange) {
        this.https = require('https');
        this.req;
        this.options = {};
        if(exchange === 'GDAX'){
            this.hostname = 'api.gdax.com';
        }
        //this.httpReq = new XMLHttpRequest();

    }
    setup(type, url, func) {
        function callbackFunc() {
            
        }
        url = url;

        this.options.hostname = this.hostname;
        this.options.port = 443;
        this.options.path = url;
        this.options.method = type;



        this.req = this.https.request(this.options, function(res){
            let response = '';
            //on('data') receives chunks of the response, must append together
            res.on('data', (d) => {
                response = response + d;
            });
            //when response ends, callback func is called and full response is sent with it
            res.on('end', () => {
                console.log("request ended");
                /*func.forEach(function(f){
                    f(response);
                }.bind(this));*/
                func(response);
            });
        });
        this.req.setHeader('Content-Type', 'application/json');
        this.req.setHeader('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36');

        this.req.on('error', (e) => {
            console.log("Error with REST API Request...", e);
        });

    }
    head(opt, val) {
        this.req.setHeader(opt, val);
        return this;
    }
    send(params){
        params = params || {};
        params = JSON.stringify(params);
        //this.httpReq.send(params);
        this.req.end(params);

    }
}
// Require ServerSideRequest();
class GDAXAPI {
    constructor() {
        this.request = new ServerSideRequest('GDAX');
        this.fs = require('fs');
        this.response = '';
    }
    __private(endpoint, method, body) {
        body = body || '';
        var crypto = require('crypto');
        let data = this.__readConfig();


        let timestamp = Date.now() / 1000;
        let requestPath = endpoint;

        let what, key, hmac, final = null;

        if(body === '') {
            what = timestamp + method + requestPath;
        }
        else {
            body = JSON.parse(body);
            //let msg = JSON.stringify(body);
            what = timestamp + method + requestPath + body;
        }
        key = Buffer(data[0], 'base64');
        hmac = crypto.createHmac('sha256', key);
    
        final = hmac.update(what).digest('base64');

        this.request.head('CB-ACCESS-KEY', data[1]);
        this.request.head('CB-ACCESS-SIGN', final);
        this.request.head('CB-ACCESS-TIMESTAMP', timestamp);
        this.request.head('CB-ACCESS-PASSPHRASE', data[2]);

        return this;
    }
    fills(endpoint, callback) {
        callback = callback || function() { };
        // let endpoint = '/fills?before=24570240';
        
        //i = 0;

        // let endpoint = '/fills?before=24570240';

        this.request.setup('GET', endpoint, callback);
        // this.request.head('cb-before', '25591646');
        this.__private(endpoint, 'GET');
        // this.request.head('CB-BEFORE', 'e5ae6a57-5a46-404d-9acd-0019a59f6253');
        // this.request.head('CB-BEFORE', '24480044');
        this.request.send();

        /*function sendAtInterval(endpoint) {

        }
        function start() {
            let coins = ['BTC-USD', "ETH-USD", "LTC-USD", "BCH-USD", "ETH-BTC", "LTC-BTC", "BCH-BTC"];
            while(true) {
                let base = '/fills?';
                let coin = coins[i];
                let trade_id = null;
                
                
            }
        }*/



            

    }
    order(side, price, amount, product_id, callback) {
        callback = callback || function() { };

        let msg = {
            size: amount,
            price: price,
            side: side,
            type: 'limit',
            product_id: product_id,
            post_only: true
        };
        let endpoint = '/orders';
        this.request.setup('POST', endpoint, callback);
        this.__private(endpoint, 'POST', msg);

        this.request.send(msg);
    }
    accounts(callback) {
        callback = callback || function() { };

        let endpoint = '/accounts';

        this.request.setup('GET', endpoint, callback);
        this.__private(endpoint, 'GET');

        this.request.send();
    }
    __callback(res) {
        console.log("YAY THIS WORKS", res.toString());
    }
    __readConfig() {
        let config_array = [];
        let config = this.fs.readFileSync('keys.conf', (err, data) => data);

        let configuration = config.toString().split('\n');

        configuration.map(line => {
            if (line[0] === '#'){
                return;
            }
            else if(line[0] === '\n') {
                return;
            }
            else if(line[0] === '') {
                return;
            }
            else if(line[0] === null) {
                return;
            }
            else if(line[0] === undefined) {
                return;
            }
            else {
                config_array.push(line.split(' ')[2]);
            }
        });
        config_array.shift();
        config_array.shift();
        config_array.shift();
        return config_array;
    }

}

let lol = new GDAXAPI();

// lol.fills('/fills?product_id=BTC-USD&before=31901402', function (resp) {
lol.fills('/fills?product_id=ETH-USD', function (resp) {
    console.log(resp);
})