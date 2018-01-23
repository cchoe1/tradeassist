function transition(element, class_name, time) {
    function remove() {
        element.classList.remove(class_name);
    }
    let timeout = null;
    clearTimeout(timeout);
    timeout = setTimeout(remove, time);
    element.classList.add(class_name);
}
let $ = function(selector) {

}
class AdvancedOrder {
    constructor() {
        
    }
}
class Persister {

}
class ExchangeHistoryComponent {
    constructor() {
        this.history_ul = document.querySelector('.exchange-history ol');
        this.length = 1000;
        this.tx_list = [];

    }
    receive(data) {
        this.__addTransaction(data);
        //this.__displayTransactions();
    }
    __addTransaction(data) {
        this.history_ul.innerHTML = "<li>" + "Asset: " + data.product_id + "<br>" + "Side: " + data.side + "<br>" + "Size: " + data.size + "<br>" + "Price: " + data.price + "<br>" + "</li>" + this.history_ul.innerHTML;
        
        /*this.tx_list.unshift(data);
        let length = this.tx_list.length;

        if(length > this.length) {
            this.tx_list.pop();
        }*/


    }
    __displayTransactions() {
        this.history_ul.innerHTML = '';

        this.tx_list.forEach(function(tx){
            /*this.history_ul.innerHTML = "<li>" + "Asset: " + tx.product_id + "<br>" + "Side: " + tx.side + "<br>" + "Size: " + tx.size + "<br>" + "Price: " + tx.price + "<br>" + "</li>" + this.history_ul.innerHTML;*/
            this.history_ul.innerHTML += "<li>" + "Asset: " + tx.product_id + "<br>" + "Side: " + tx.side + "<br>" + "Size: " + tx.size + "<br>" + "Price: " + tx.price + "<br>" + "</li>";
        
        }.bind(this));
    }
}
class LastPriceComponent {
    constructor() {

        this.btc_price_div = document.querySelector('.btc-price');
        this.eth_price_div = document.querySelector('.eth-price');
        this.ltc_price_div = document.querySelector('.ltc-price');
        this.bch_price_div = document.querySelector('.bch-price');

        this.btc_diff = document.querySelector(".btc-diff")
        this.eth_diff = document.querySelector(".eth-diff")
        this.ltc_diff = document.querySelector(".ltc-diff")
        this.bch_diff = document.querySelector(".bch-diff")

        this.btc_bal = document.querySelector('.btc-balance');
        this.eth_bal = document.querySelector('.eth-balance');
        this.ltc_bal = document.querySelector('.ltc-balance');
        this.bch_bal = document.querySelector('.bch-balance');
        this.money_bal = document.querySelector('.money-balance');

        this.btc_worth = document.querySelector('.btc-worth');
        this.eth_worth = document.querySelector('.eth-worth');
        this.ltc_worth = document.querySelector('.ltc-worth');
        this.bch_worth = document.querySelector('.bch-worth');

        this.portfolio_worth = document.querySelector('.portfolio-worth');

        console.log("AHHHH", this);
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
            this.btc_worth.innerHTML = "$" + (Number(this.btc_bal.innerHTML) * Number(data.price)).toFixed(4);
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
            this.eth_worth.innerHTML = "$" + (Number(this.eth_bal.innerHTML) * Number(data.price)).toFixed(4);
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
            this.ltc_worth.innerHTML = "$" + (Number(this.ltc_bal.innerHTML) * Number(data.price)).toFixed(4);
            this.ltc_price_div.innerHTML = data.price;
            this.ltc_diff.innerHTML = diff.toFixed(2);
        }
        else if(data.product_id === "BCH-USD") {
            let current = Number(this.bch_price_div.innerHTML);
            let diff = Number(data.price) - current;
            if(current < Number(data.price)) {
                transition(this.bch_price_div, "traded-up", 500);
                transition(this.bch_diff, "traded-up", 500);
            }
            else if(current > Number(data.price)){
                transition(this.bch_price_div, "traded-down", 500);
                transition(this.bch_diff, "traded-down", 500);
            }
            else {
                transition(this.bch_price_div, 'traded-neutral', 500);
                transition(this.bch_diff, 'traded-neutral', 500);
            }
            this.bch_worth.innerHTML = "$" + (Number(this.bch_bal.innerHTML) * Number(data.price)).toFixed(4);
            this.bch_price_div.innerHTML = data.price;
            this.bch_diff.innerHTML = diff.toFixed(2);
        }

        let total_val = Number(this.btc_worth.innerHTML.substr(1)) + Number(this.eth_worth.innerHTML.substr(1)) + Number(this.ltc_worth.innerHTML.substr(1)) + Number(this.bch_worth.innerHTML.substr(1)) + Number(this.money_bal.innerHTML.substr(1));
        this.portfolio_worth.innerHTML = "$" + total_val.toFixed(4);
    }
}

class TradeWindowComponent {
    constructor() {
        this.submit_order = document.querySelector('.submit-order');
        this.message = {};
        this.order_side_radio = document.getElementsByName('side');
        this.order_choice_radio = document.getElementsByName('coin-choice');

        this.btc_price = Number(document.querySelector('.btc-price').value);
        this.eth_price = Number(document.querySelector('.eth-price').value);
        this.ltc_price = Number(document.querySelector('.ltc-price').value);
        this.bch_price = Number(document.querySelector('.bch-price').value);

        this.order_feedback = document.querySelector('.order-feedback');

        this.addEvents();
        this.__updateBalances();
    }
    __grabFormValues() {
        this.order_price = document.querySelector('input.order-price').value;
        this.order_amount = document.querySelector('.order-amount').value;

        this.message.size = this.order_amount;
        this.message.price = this.order_price;


        for(let i=0, length=this.order_side_radio.length; i<length; i++) {
            if(this.order_side_radio[i].checked) {
                let order_side = this.order_side_radio[i].value;
                this.message.side = order_side;
            }
        }
        for(let i=0, length=this.order_choice_radio.length; i<length; i++) {
            if(this.order_choice_radio[i].checked) {
                let order_choice = this.order_choice_radio[i].value;
                this.message.product_id = order_choice;
            }
        }
    }
    addEvents() {
        this.submit_order.addEventListener('click', this.__submitTrade.bind(this));
    }
    __submitTrade() {
        this.__grabFormValues();
        let request = new AjaxRequest();
        request.setup('POST', 'http://localhost:3000/trade/api/order', function(data){
            console.log(data);
            this.__updateFeedback(data);
        }.bind(this));
        request.send(this.message);

        this.__updateBalances();
    }
    __updateFeedback(feedback) {
        feedback = JSON.parse(feedback);
        if(!Array.isArray(feedback)){
            //check if message is good - if it has prop message, then its bad
            if(feedback.hasOwnProperty('message')) {
                this.order_feedback.innerHTML = "ERROR: " + feedback.message
                return;
            }
            this.order_feedback.innerHTML = feedback.side + ": " + feedback.size + "<br>" + feedback.product_id + ": " + feedback.price;
        }
    }
    __updateBalances() {
        let request = new AjaxRequest();
        let btc_bal = document.querySelector('.btc-balance');
        let eth_bal = document.querySelector('.eth-balance');
        let ltc_bal = document.querySelector('.ltc-balance');
        let bch_bal = document.querySelector('.bch-balance');
        let money_bal = document.querySelector('.money-balance');
        let portfolio_worth = document.querySelector('.portfolio-worth');

        request.setup('GET', 'http://localhost:3000/trade/api/accounts', function(data){
            console.log('Returned balances: ', data)
            data = JSON.parse(data);
            data.forEach(function(d){
                if(d.currency === "BTC"){
                    btc_bal.innerHTML = d.balance;
                    let btc_worth = Number(d.balance) * Number
                }
                else if (d.currency === "ETH") {
                    eth_bal.innerHTML = d.balance;
                }
                else if (d.currency === "LTC") {
                    ltc_bal.innerHTML = d.balance;
                }
                else if (d.currency === "BCH") {
                    bch_bal.innerHTML = d.balance;
                }
                else if (d.currency === "USD") {
                    money_bal.innerHTML = "$" + Number(d.balance).toFixed(4);
                }
            });
        });
        request.send();
    }
}
class SocketClient {
    constructor() {
        // Open a connection
        this.socket = new WebSocket('ws://localhost:8081/');
        //this.init();
        this.TradeWindow = new TradeWindowComponent();
        this.LastPriceComponent = new LastPriceComponent();
        this.ExchangeHistoryComponent = new ExchangeHistoryComponent();

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

        let trade_history = document.querySelector('.trade-history ol');

        if(data.type !== 'match'){
            console.log(data);
        }
        if(data.type === 'match'){
            this.LastPriceComponent.receive(data);
            this.ExchangeHistoryComponent.receive(data);
        }
        else if(data.type === 'received'){
            console.log("@@@@@@@@@@@@@@@@@@@@\n\n\n@@@@@@@@@@@@@@@@@\n\n\n", data);
            trade_history.innerHTML += "<li>" + "Type: " + data.type + "<br>" + "Order type: " + data.order_type + "<br>" + "Side: " + data.side + "<br>" + "Size: " +  data.size + "<br>" + "Price: " + data.price + "<br>" + "</li>";
        }
        else if(data.type === 'done' ||
                data.type === 'open') {
            console.log("@@@@@@@@@@@@@@@@@@@@\n\n\n@@@@@@@@@@@@@@@@@\n\n\n", data);
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



/*
* MAIN
*
*
*
*/

let client = new SocketClient();
client.init();


