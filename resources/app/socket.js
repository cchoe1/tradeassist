class WebSocketServer {
    constructor() {
        this.WebSocket = require('ws');
        this.url = require('url');
        this.socketTools = require('./gdax.js');
        this.fs = require('fs');
        
        this.wss = new this.WebSocket.Server({ 'port': 8081 });

        this.__init();

        this.marketPriceManager = new MarketPrice();
        this.userHistoryManager = new UserHistory();
        this.tickerManager = new Ticker();
    }
    makeRequest() {
        this.GDAXAPI = new this.socketTools.GDAXAPI();

    }
    __handleData(data) {
        

    }
    __init() {
        this.ServerDataHandler = new ServerDataHandler();

        this.startGDAX();
        this.wss.on('connection', function (ws, req) {
            const location = this.url.parse(req.url, true);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
        
            ws.on('message', function incoming(message) {
                console.log('Received from client: %s', message);
            });
            ws.on('error', function (error) {
                new this.socketTools.Logger().error("Web Socket Main Server Error", error);
                console.log("Closing @ ", Date(Date.now()).toString());
                ws.close();
            }.bind(this));
            ws.on('close', function close() {
                console.log('Client window closed at ', Date(Date.now()).toString());
                ws.close();
                if(this.GDAXSocket){
                    this.GDAXSocket.close();
                }
                if(ws.readyState === 1){

                }
                else{
                }
            }.bind(this));

            
        }.bind(this));
    }
    startGDAX() {
        
        this.GDAXSocket = new this.socketTools.GDAXSocket();
        this.GDAXSocket.private();
        // this.GDAXSocket.sub('user', ['BTC-USD', "ETH-USD", "LTC-USD", "BCH-USD", "ETH-BTC", "LTC-BTC", "BCH-BTC"]);
        // this.GDAXSocket.sub('matches', ['BTC-USD', "ETH-USD", "LTC-USD", "BCH-USD", "ETH-BTC", "LTC-BTC", "BCH-BTC"]);
        // this.GDAXSocket.sub('matches', ["BCH-BTC"]);
        // this.GDAXSocket.sub('ticker', ['BTC-USD', "ETH-USD", "LTC-USD", "BCH-USD", "ETH-BTC", "LTC-BTC", "BCH-BTC"]);
        this.GDAXSocket.setup();
        
        //this.GDAXSocket.begin();
        this.GDAXSocket.beginAndListen(this.ServerDataHandler.listen.bind(this));

        // var PythonShell = require('python-shell');

        // var options = {
        //   mode: 'text',
        //   pythonPath: '/usr/bin/python3',
        //   pythonOptions: [],
        //   scriptPath: './py/headline_extraction/',
        //   args: []
        // };
        
        /*PythonShell.run('failsafe.py', options, function (err, results) {
          if (err) throw err;
          // results is an array consisting of messages collected during execution
          console.log('results: %j', results);
        });*/
    }
}





/******************************************
*
* Manipulating stream data below
*
*
*******************************************/
class User {
    constructor() {
        this.trading_pairs = {
            'BTC-USD': {
                price: 0,
                trade_history: [],

            },
            'ETH-USD': {
                price: 0,
                trade_history: [],

            },
            'LTC-USD': {
                price: 0,
                trade_history: [],

            },
            'BCH-USD': {
                price: 0,
                trade_history: [],

            },
            'ETH-BTC': {
                price: 0,
                trade_history: [],

            },
            'LTC-BTC': {
                price: 0,
                trade_history: [],

            },
            'BCH-BTC': {
                price: 0,
                trade_history: [],

            }
        }
    }
}
class ServerDataHandler {
    constructor() {

    }
    listen(data) {
        var broadcast = function(data) {
            var json = JSON.stringify(data);
            this.wss.clients.forEach(function each(client) {
                if(client.readyState === 1){
                    client.send(json);
                }
            }.bind(this));
        }.bind(this);


        data = JSON.parse(data);

        if (data.type === "match") {
            this.marketPriceManager.updatePrice(data);
    
        }
        else if(data.type === 'open' ||
                data.type === 'received' ||
                data.type === 'done'){
            this.userHistoryManager.receive(data);

        }
        else if(data.type === 'subscriptions') {
            console.log("Subbed: ", data);
    
        }
        else if(data.type === 'ticker') {
            this.tickerManager.receive(data);
            console.log(data);
    
        }
        else if(data.type === 'last_match') {
            //nothing
    
        }
        else if(data.type === 'custom'){
    
        }
        else {
            //console.log("Uh.....", data)
            console.log("AAAHHHHHHHHHHHHHH", data);
        }

        data = JSON.stringify(data)
        broadcast(data);
    }
}





class Ticker {
    constructor() {
        console.log("Listening for ticker");
    }
    receive(data) {
        //data = JSON.parse(data);

        console.log("Product: ", data.product_id, "Best bid: ", data.best_bid, "Best Ask: ", data.best_ask);
    }
}
class MarketPrice {
    constructor() {
        console.log('listening for prices');
        this.ETH = 0;
        this.BTC = 0;
        this.LTC = 0;
        this.BCH = 0;
        this.ETH_to_BTC = 0;
        this.LTC_to_BTC = 0;
        this.BCH_to_BTC = 0;
    }
    updatePrice(data) {
        let coin = data.product_id;

        if (coin === "BTC-USD") {
            this.BTC = data.price;
            console.log("BTC = $", this.BTC, "Sz: ", data.size, "<<", data.side, ">>");
        }
        else if (coin === "ETH-USD") {
            this.ETH = data.price;
            console.log("ETH = $", this.ETH, "Sz: ", data.size, "<<", data.side, ">>");
        }
        else if (coin === "LTC-USD") {
            this.LTC = data.price;
            console.log("LTC = $", this.LTC, "Sz: ", data.size, "<<", data.side, ">>");
        }
        else if (coin === "BCH-USD") {
            this.BCH = data.price;
            console.log("BCH = $", this.BCH, "Sz: ", data.size, "<<", data.side, ">>");
        }
        else if(coin === 'ETH-BTC') {
                // console.log(data.product_id, "Converted: ", data.price * this.BTC, "% POTENTIAL: ", (((data.price * this.BTC) - this.ETH) / this.ETH) * 100);
                console.log(data.product_id, "Converted: ", data.price * this.BTC, "% POTENTIAL: ", this.ETH);
        }
        else if(coin === 'LTC-BTC') {
                // console.log(data.product_id, "Converted: ", data.price * this.BTC, "% POTENTIAL: ", (((data.price * this.BTC) - this.LTC) / this.LTC) * 100);
                console.log(data.product_id, "Converted: ", data.price * this.BTC, "% POTENTIAL: ", this.LTC);
        }
        else if(coin === 'BCH-BTC') {
                // console.log(data.product_id, "Converted: ", data.price * this.BTC, "% POTENTIAL: ", (((data.price * this.BTC) - this.BCH) / this.BCH) * 100);
                console.log(data.product_id, "Converted: ", data.price * this.BTC, "% POTENTIAL: ", this.BCH);
        }
    }
}
class UserHistory {
    constructor() {
        console.log('listening for user history');
        this.fs = require('fs');
        this.pairs = {};
    }
    receive(object) {
        let stream = this.fs.createWriteStream('history.conf', {flags:'a'});
        stream.write(JSON.stringify(object) + "\n");
        stream.end();
    }
    importHistory(data) {
        // data = JSON.parse(data);
        data.forEach(function(d){
            let stream = this.fs.createWriteStream('history-clean.conf', {flags:'a'});
            stream.write(JSON.stringify(d) + "\n");
            stream.end();
        }.bind(this));
        this.__separatePairs(data);
        this.__calculateAverage(data);

        console.log("We have history...", data);
        return data;

    }
    __separatePairs(orders) {
        console.log("Received...", orders);

    }
    __calculateAverage(orders) {
        console.log(orders);
        return;
    }


}

/**
 * Listen on provided port, on all network interfaces.
 */

module.exports = {
    WebSocketServer: WebSocketServer,
    UserHistory: UserHistory,
}