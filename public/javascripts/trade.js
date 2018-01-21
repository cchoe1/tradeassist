function transition(element, class_name, time) {
    function remove() {
        element.classList.remove(class_name);
    }
    let timeout = null;
    clearTimeout(timeout);
    //timeout = setTimeout(() => element.classList.remove(class_name), time);
    timeout = setTimeout(remove, time);
    element.classList.add(class_name);
}
class ExchangeHistoryComponent {
    constructor() {
        this.history_ul = document.querySelector('.exchange-history ul');

    }
    receive(data) {
        this.__addTransaction(data);
    }
    __addTransaction(data) {
        this.history_ul.innerHTML = "<li>" + "Asset: " + data.product_id + "<br>" + "Side: " + data.side + "<br>" + "Size: " + data.size + "<br>" + "Price: " + data.price + "<br>" + "</li>" + this.history_ul.innerHTML;
    }
}
class LastPriceComponent {
    constructor() {
        this.btc_price_div = document.querySelector('.btc-price');
        this.eth_price_div = document.querySelector('.eth-price');
        this.ltc_price_div = document.querySelector('.ltc-price');
        this.bcc_price_div = document.querySelector('.bcc-price');

        this.btc_diff = document.querySelector(".btc-diff")
        this.eth_diff = document.querySelector(".eth-diff")
        this.ltc_diff = document.querySelector(".ltc-diff")
        this.bcc_diff = document.querySelector(".bcc-diff")
    }
    receive(data) {
        this.__updatePrice(data);
    }
    __updatePrice(data) {
        if(data.product_id === "BTC-USD") {
            let current = Number(this.btc_price_div.innerHTML);
            let diff = Number(data.price) - current;
            if(current < Number(data.price)) {
                transition(this.btc_price_div, "traded-up", 500);
                transition(this.btc_diff, "traded-up", 500);
            }
            else if(current > Number(data.price)){
                transition(this.btc_price_div, "traded-down", 500);
                transition(this.btc_diff, "traded-down", 500);
            }
            else {
                transition(this.btc_price_div, 'traded-neutral', 500);
                transition(this.btc_diff, 'traded-neutral', 500);
            }
            this.btc_price_div.innerHTML = data.price;
            this.btc_diff.innerHTML = diff.toFixed(2);
        }
        else if(data.product_id === "ETH-USD") {
            let current = Number(this.eth_price_div.innerHTML);
            let diff = Number(data.price) - current;
            if(current < Number(data.price)) {
                transition(this.eth_price_div, "traded-up", 500);
                transition(this.eth_diff, "traded-up", 500);
            }
            else if(current > Number(data.price)){
                transition(this.eth_price_div, "traded-down", 500);
                transition(this.eth_diff, "traded-down", 500);
            }
            else {
                transition(this.eth_price_div, 'traded-neutral', 500);
                transition(this.eth_diff, 'traded-neutral', 500);
            }
            this.eth_price_div.innerHTML = data.price;
            this.eth_diff.innerHTML = diff.toFixed(2);
        }
        else if(data.product_id === "LTC-USD") {
            let current = Number(this.ltc_price_div.innerHTML);
            let diff = Number(data.price) - current;
            if(current < Number(data.price)) {
                transition(this.ltc_price_div, "traded-up", 500);
                transition(this.ltc_diff, "traded-up", 500);
            }
            else if(current > Number(data.price)){
                transition(this.ltc_price_div, "traded-down", 500);
                transition(this.ltc_diff, "traded-down", 500);
            }
            else {
                transition(this.ltc_price_div, 'traded-neutral', 500);
                transition(this.ltc_diff, 'traded-neutral', 500);
            }
            this.ltc_price_div.innerHTML = data.price;
            this.ltc_diff.innerHTML = diff.toFixed(2);
        }
        else if(data.product_id === "BCC-USD") {
            let current = Number(this.bcc_price_div.innerHTML);
            let diff = Number(data.price) - current;
            if(current < Number(data.price)) {
                transition(this.bcc_price_div, "traded-up", 500);
                transition(this.bcc_diff, "traded-up", 500);
            }
            else if(current > Number(data.price)){
                transition(this.bcc_price_div, "traded-down", 500);
                transition(this.bcc_diff, "traded-down", 500);
            }
            else {
                transition(this.bcc_price_div, 'traded-neutral', 500);
                transition(this.bcc_diff, 'traded-neutral', 500);
            }
            this.bcc_price_div.innerHTML = data.price;
            this.bcc_diff.innerHTML = diff.toFixed(2);
        }
    }
}
class SocketClient {
    constructor() {
        // Open a connection
        this.socket = new WebSocket('ws://localhost:8081/');
        console.log(this.socket);
        //this.init();
        this.LastPriceComponent = new LastPriceComponent();
        this.ExchangeHistoryComponent = new ExchangeHistoryComponent();

        if (this.socket.readyState === 1) {
            console.log('closed prior');
            this.socket.close();
        }
    }
    init() {
        this.socket.onopen = this.__onOpen.bind(this);
        this.socket.onmessage = this.__onMessage.bind(this);
        this.socket.onerror = this.__onError.bind(this);
        this.socket.onclose = this.__onClose.bind(this);
        console.log(this.socket);
        
        // Close the connection when the window is closed
        window.addEventListener('beforeunload', () => this.socket.close());
    }
    __onOpen() {
        // send data to the server
        console.log("Connected to web socket server!");
        var json = JSON.stringify({ message: 'Hello, from the client ' });
        this.socket.send(json);
    }
    __onMessage(event) {
        let data = JSON.parse(JSON.parse(event.data));
        console.log(data);

        let trade_history = document.querySelector('.trade-history ul');

        if(data.type === 'match'){
            this.LastPriceComponent.receive(data);
            this.ExchangeHistoryComponent.receive(data);
        }
        else if(data.type === 'received'){
            trade_history.innerHTML += "<li>" + "Type: " + data.type + "<br>" + "Order type: " + data.order_type + "<br>" + "Side: " + data.side + "<br>" + "Size: " +  data.size + "<br>" + "Price: " + data.price + "<br>" + "</li>";
        }
        else if(data.type === 'done' ||
                data.type === 'open') {
            trade_history.innerHTML += "<li>" + 'Type: ' + data.type + "<br>" + "Side: " + data.side + "<br>" + "Price point: " + data.price + "<br>" + "Remaining size: " + data.remaining_size + "<br>" + "Reason: " + data.reason + "</li>";
        }
    }
    __onError(event) {
        this.socket.close();
        console.log("ERROR WITH CLIENT SOCKET!", event);
    }
    __onClose() {
        this.socket.close();
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ CLOSING @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        
    }
}




let client = new SocketClient();
client.init();

console.log(document);