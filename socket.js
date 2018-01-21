class WebSocketServer {
    constructor() {
        this.WebSocket = require('ws');
        this.url = require('url');
        this.socketTools = require('./gdax.js');
        
        this.wss = new this.WebSocket.Server({ 'port': 8081 });

        this.__init();
    }
    makeRequest() {
        this.GDAXAPI = new this.socketTools.GDAXAPI();
        
    }
    __handleData(data) {
        var broadcast = function(data) {
            var json = JSON.stringify(data);
            
            this.wss.clients.forEach(function each(client) {
                client.send(json);
            });
        }.bind(this);
        broadcast(data);
    }
    __init() {
        this.wss.on('connection', function (ws, req) {
            const location = this.url.parse(req.url, true);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
        
            ws.on('message', function incoming(message) {
                console.log('Received from client: %s', message);
            });
            ws.on('error', function () {
                ws.close();
                console.log("uh oh! error!");
            });
            ws.on('close', function close() {
                ws.close();
                ws = null;
                if(this.GDAXSocket){
                    this.GDAXSocket.close();
                }
                console.log('user has disconnected! bye bye!');
            }.bind(this));

            this.startGDAX();
            
        }.bind(this));
    }
    startGDAX() {
        this.GDAXSocket = new this.socketTools.GDAXSocket();
        
        this.GDAXSocket.private();
        this.GDAXSocket.sub('user', ['BTC-USD', 'LTC-USD', 'ETH-USD', 'ETH-BTC', 'LTC-BTC']);
        this.GDAXSocket.sub('matches', ['BTC-USD', "ETH-USD", "LTC-USD"]);
        this.GDAXSocket.setup();
        
        //this.GDAXSocket.begin();
        this.GDAXSocket.beginAndListen(this.__handleData.bind(this));
    }
}

/**
 * Listen on provided port, on all network interfaces.
 */

module.exports = {
    WebSocketServer: WebSocketServer
}