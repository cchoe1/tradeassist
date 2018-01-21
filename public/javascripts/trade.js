class SocketClient {
    constructor() {
        // Open a connection
        this.socket = new WebSocket('ws://localhost:8081/');
    }
    init() {
        // When a connection is made
        this.socket.onopen = this.__onOpen;
        
        // When data is received
        this.socket.onmessage = this.__onMessage;
        
        // A connection could not be made
        this.socket.onerror = this.__onError;
        
        // A connection was closed
        this.socket.onclose = function(code, reason) {
              console.log(code, reason);
        }
        
        // Close the connection when the window is closed
        window.addEventListener('beforeunload', this.__onClose);
    }
    __onOpen() {
        // send data to the server
        console.log("Connected to web socket server!");
        var json = JSON.stringify({ message: 'Hello, from the client ' });
        socket.send(json);
    }
    __onMessage(event) {
        let data = JSON.parse(JSON.parse(event.data));
        console.log(data);
        let btc_price_div = document.querySelector('.btc-price');
        let eth_price_div = document.querySelector('.eth-price');
        let ltc_price_div = document.querySelector('.ltc-price');
        let bcc_price_div = document.querySelector('.bcc-price');

        if(data.product_id === "BTC-USD") {
            btc_price_div.innerHTML = "BTC = $" + data.price;
        }
        else if(data.product_id === "ETH-USD") {
            eth_price_div.innerHTML = "ETH = $" + data.price;
        }
        else if(data.product_id === "LTC-USD") {
            ltc_price_div.innerHTML = "LTC = $" + data.price;
        }
        else if(data.product_id === "BCC-USD") {
            bcc_price_div.innerHTML = "BCC = $" + data.price;
        }
    }
    __onError() {
        console.log("ERROR WITH CLIENT SOCKET!", event);
    }
    __onClose() {
        console.log("Shutting down websocket before you go...");
        this.socket.close();
    }
}

let client = new SocketClient();
client.init();
