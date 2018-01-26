// useless logger class that might one day not be useless
class Logger {
    constructor(message) {
        this.fs = require('fs');
        this.message = message || '';
        this.name;
        this.start = "START>>>>>>>>>>>>>>>>>>>>"
        this.end = ">>>>>>>>>>>>>>>>>>>>>>END"
        this.timestamp = Date(Date.now()).toString();

        this.error_msg = this.start;
        return this;
    }
    socketError(message) {
        message ? this.message = message : message = null;
        this.name = 'Web Socket Error';

        this.__write();
        return this;
    }
    // Creates a general error message in the log
    error(name, message) {
        message ? this.message = message : message = null;
        this.name = name;
        console.log(this.timestamp, this.name, this.message);

        this.__write();
        return this;
    }
    __write() {
        let message = this.message;
        let separator = '---------';
        
        let log = this.start + "\n" + "- " + this.timestamp + ", " + `<<${this.name}>>` + "\n" + message + "\n" + this.end + "\n";

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
    }
    setup(type, url, func) {
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
            console.log("Error with REST API Request...", e, Date(Date.now()).toString());
            new Logger().error("REST API ERROR", e);
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
            // body = JSON.parse(body);
            // body = typeof body === 'Object' ? JSON.parse(body) : body;
            console.log("EEEK", body);
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
        
        console.log("ENDPOINT = ", endpoint);
        this.request.setup('GET', endpoint, callback);
        this.__private(endpoint, 'GET');
        this.request.send();

    }
    order(side, price, amount, product_id, callback) {
        callback = callback || function() { };

        let msg = {
            size: amount,
            price: price,
            side: side,
            type: 'limit',
            product_id: product_id,
            post_only: 'true'
        };
        console.log(msg);
        let endpoint = '/orders';
        this.request.setup('POST', endpoint, callback);
        this.__private(endpoint, 'POST', JSON.stringify(msg));

        this.request.send(msg);
    }
    accounts(callback) {
        callback = callback || function() { };

        let endpoint = '/accounts';

        this.request.setup('GET', endpoint, callback);
        this.__private(endpoint, 'GET');

        this.request.send();
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
// Require Logger();
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
    //fix this to be smarter and better
    __readConfig() {
        let config_array = [];
        let config = this.fs.readFileSync('./keys.conf', (err, data) => data);

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

        let timestamp = Date.now() / 1000;
        //endpoint for verification for any websocket connection
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
        this.__sock_message.type = 'subscribe';
        this.__sock_message.channels = this.channels;
        return this;
    }
    setup() {
        this.__composeMessage();
        return this;
    }
    
    beginAndListen(callback) {
        function router(data) {
            // console.log(data);
            callback(data);
        }
        this.webSock.on('open', function open() {
            try{
                this.webSock.send(JSON.stringify(this.__sock_message), function(error) {
                    new Logger().socketError(error);
                    console.log("Error sending message to client...", error);

                }.bind(this));
                this.webSock.on('message', data => router(data));
            }
            catch(e) {
                console.log("ERROR! Appended to log", e, Date(Date.now()).toString());
                new Logger(e).socketError();
            }
        }.bind(this))
    }
    __responseHandler(data) {
        return data;
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
    Logger: Logger,
}