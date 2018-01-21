class WebSocketServer {
    constructor() {
        this.WebSocket = require('ws');
        this.url = require('url');
        this.socketTools = require('./data.js');

        this.wss = new this.WebSocket.Server({ 'port': 8081 });

        this.__init();
    }
    handleData(data) {
        var broadcast = function(data) {
            var json = JSON.stringify({
                message: data
            });
            
            // wss.clients is an array of all connected clients
            this.wss.clients.forEach(function each(client) {
                client.send(json);
                console.log('Sent: ' + json);
            });
        }.bind(this);
        broadcast(data)
        // setInterval(broadcast, 3000);
    }
    __init() {
        this.wss.on('connection', function (ws, req) {
            const location = this.url.parse(req.url, true);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
        
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
                console.log('www file is working');
            });
            // Every three seconds broadcast "{ message: 'Hello hello!' }" to all connected clients
            this.GDAXSocket = new this.socketTools.GDAXSocket();

            this.GDAXSocket.private();
            this.GDAXSocket.sub('user', ['BTC-USD', 'LTC-USD', 'ETH-USD', 'ETH-BTC', 'LTC-BTC']);
            this.GDAXSocket.sub('matches', ['BTC-USD', "ETH-USD", "LTC-USD"]);
            this.GDAXSocket.setup();
            
            //this.GDAXSocket.begin();
            this.GDAXSocket.beginAndListen(this.handleData.bind(this));
        }.bind(this));
    }
}

/**
 * Listen on provided port, on all network interfaces.
 */




module.exports = {
    WebSocketServer: WebSocketServer
}