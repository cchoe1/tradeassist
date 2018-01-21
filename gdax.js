// useless logger class that might one day not be useless
class Logger {
    constructor(message) {
        this.fs = require('fs');
        this.message = message;
        this.name;
        this.start = "START>>>>>>>>>>>>>>>>>>>>"
        this.end = ">>>>>>>>>>>>>>>>>>>>>>END"

        this.error_msg = this.start;
        return this;
    }
    socketError(message) {
        message ? this.message = message : message = null;
        this.name = 'Web Socket Error';

        this.__write();
        return this;
    }
    error(name, message) {
        message ? this.message = message : message = null;
        this.name = name;

        this.__write();
        return this;
    }
    __write() {
        let message = this.message;
        let separator = '---------';
        let timestamp = Date(Date.now()).toString();
        let log = this.start + "\n" + "- " + timestamp + ", " + `<<${this.name}>>` + "\n" + message + "\n" + this.end + "\n";
        console.log(log);

        let stream = this.fs.createWriteStream('errors.log', {flags:'a'});
        stream.write(log);
        stream.end();
    }
}
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
    setup(type, url, func, args) {
        func = func || function() { };
        args = args || [];

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
        /*params = params || {};
        params = JSON.stringify(params);
        this.httpReq.send(params);*/
        this.req.end();

    }
}

class GDAXAPI {
    constructor() {
        this.request = new ServerSideRequest('GDAX');
        this.fs = require('fs');
        this.response = '';
    }
    __private(endpoint, method) {
        var crypto = require('crypto');
        let data = this.__readConfig();


        let timestamp = Date.now() / 1000;
        let requestPath = endpoint;

        let body, what, key, hmac, final = null;

        if(method === 'GET') {
            what = timestamp + method + requestPath;
        }
        else {
            body = body;
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
    accounts(callback) {
        callback = callback || function() { };
        let endpoint = '/accounts';
        let response = null;
        //registers callback function
        this.request.setup('GET', endpoint, this.__callback);
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
        /*config_array = config_array.unshift();*/
        config_array.shift();
        config_array.shift();
        config_array.shift();
        return config_array;
    }

}
let lol = new GDAXAPI();

let accounts = lol.accounts();
// socket specific to GDAX for creating and listening to info
class GDAXSocket {
    constructor() {
        // Define ws object
        const WebSocket = require('ws');
        this.fs = require('fs');

        // Create new ws connection
        this.webSock = new WebSocket("wss://ws-feed.gdax.com");
        this.__sock_message = {};

        this.products;
        this.channels = [];
    }
    close() {
        this.webSock.close();
    }
    sub(channel, products) {
        let channel_obj = this.__channelFactory(channel, products);
        let add = true;
        let check = JSON.stringify(channel_obj);
        this.channels.forEach(function(chan){
            let temp = JSON.stringify(chan);
            if(temp === check) {
                add = false;
            }
            else {
                return;
            }
        });
        if(add === true) {
            this.channels.push(channel_obj);
        }
        return this;
    }
    __channelFactory(name, products) {
        return { "name": name, "product_ids": products }
    }
    products(...products) {
        let final = new Array;

        products.map(x => final.push(x));
        this.products = final;

        return final;
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
                return
            }
            else if(line[0] === undefined) {
                return
            }
            else {
                config_array.push(line.split(' ')[2]);
            }
        });
        return config_array;
    }
    private() {
        var crypto = require('crypto');
        let data = this.__readConfig();
        console.log("SHOULD HAVE READ DATA...", data);

        //data = this.__readConfig(data);

        let timestamp = Date.now() / 1000;
        let requestPath = '/users/self/verify';
        
        let method = 'GET';
        let what = timestamp + method + requestPath;// + body;
        let key = Buffer(data[0], 'base64');
        let hmac = crypto.createHmac('sha256', key);

        let final = hmac.update(what).digest('base64');

        this.__sock_message.signature = final;
        this.__sock_message.key = data[1];
        this.__sock_message.passphrase = data[2];
        this.__sock_message.timestamp = timestamp;

        return this;

    }
    __composeMessage() {
        this.__sock_message = {
            "type": "subscribe",
            "product_ids": this.products,
            "channels": this.channels
        }
        console.log(this.__sock_message);
        return this;
    }
    setup() {
        this.__sock_message = {};
        this.__composeMessage();
        return this;

    }
    begin() {
        console.log(this.__sock_message);
        this.webSock.on('open', function open() {
            try{
                this.webSock.send(JSON.stringify(this.__sock_message));
                let stream = new StreamHandler();
                this.webSock.on('message', data => stream.listen(data));
            }
            catch(e) {
                console.log("ERROR! Appended to log", e);
                new Logger(e).socketError();
            }
        }.bind(this));
    }
    beginAndListen(callback) {
        let stream = new StreamHandler();
        //the fork in the road -- one data stream goes to the front end and the other stays in the back end
        //  to be used further
        function router(data) {
            // callback() is supplied from the Web Server that calls this func - used fo front end
            callback(data);

            // StreamHandler() is used by the back end
            stream.listen(data);
        }
        console.log("Began and listening...", this.__sock_message);
        this.webSock.on('open', function open() {
            try{
                this.webSock.send(JSON.stringify(this.__sock_message));
                this.webSock.on('message', data => router(data));
            }
            catch(e) {
                console.log("ERROR! Appended to log", e);
                new Logger(e).socketError();
            }
        }.bind(this))
    }
    __responseHandler(data) {
        return data;
    }
}
//this class is the router -- it receives all of the updates from our CLIENT which listens to GDAX
// this class is responsible for triggering other classes that have their own responsibilities
class StreamHandler {
    constructor() {
        console.log("starting stream...");
        this.marketPriceManager = new MarketPrice();
        this.userHistoryManager = new UserHistory();
        //this.init();
    }
    listen(data) {
        data = JSON.parse(data);
        try{
            // rough check to see if its a match or user event
            if (data.type === "match") {
                this.marketPriceManager.updatePrice(data);
            }
            else if(data.type === 'open' ||
                    data.type === 'received' ||
                    data.type === 'done'){
                this.userHistoryManager.receive(data);
            }
            else if(data.type === 'last_match' ||
                    data.type === 'subscribe') {
                //console.log("Some info: ", data);
            }
            return data;
        }
        catch(e) {
        }

    }
}
class MarketPrice {
    constructor() {
        console.log('listening for prices');
        this.ETH = 0;
        this.BTC = 0;
        this.LTC = 0;
        this.BCC = 0;
    }
    updatePrice(data) {
        let coin = data.product_id;

        if (coin === "BTC-USD") {
            this.BTC = data.price;
            console.log("BTC = $", this.BTC);
        }
        else if (coin === "ETH-USD") {
            this.ETH = data.price;
            console.log("ETH = $", this.ETH);
        }
        else if (coin === "LTC-USD") {
            this.LTC = data.price;
            console.log("LTC = $", this.LTC);
        }
        else if (coin === "BCC-USD") {
            this.BCC = data.price;
            console.log("BCC = $", this.BCC);
        }
    }

}
class UserHistory {
    constructor() {
        console.log('listening for user history');
        this.fs = require('fs');
    }
    receive(object) {
        console.log('Received: ', object);
        let stream = this.fs.createWriteStream('history.conf', {flags:'a'});
        stream.write(JSON.stringify(object) + "\n");
        stream.end();
    }

}

/**********************************************************************
*
* List of channels:
*  -level2
*  -heartbeat
*  -ticker
*  -user
*  -matches
*  -full
*
**********************************************************************/
/*const sock = new GDAXSocket();
sock.private();
// sock.products('BTC-USD', 'ETH-USD');
//sock.products("LTC-USD");
sock.sub('user', ['BTC-USD', 'LTC-USD', 'ETH-USD', 'ETH-BTC', 'LTC-BTC']);
sock.sub('matches', ['BTC-USD', "ETH-USD", "LTC-USD"]);
sock.setup();

sock.begin();*/
//module.exports.GDAXSocket;
module.exports = {
    GDAXSocket: GDAXSocket,
    GDAXAPI: GDAXAPI,
}