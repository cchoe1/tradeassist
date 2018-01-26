function transition(element, class_name, time) {
    function remove() {
        element.classList.remove(class_name);
    }
    let timeout = null;
    clearTimeout(timeout);
    timeout = setTimeout(remove, time);
    element.classList.add(class_name);
}
function $( cssquery ) {
    var t = document.querySelectorAll(cssquery);
    return (t.length === 0) ? false : (t.length === 1) ? Array.prototype.slice.call(t)[0] : Array.prototype.slice.call(t);
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}



//gather front end, send to back end
class AdvancedOrderComponent {
    constructor() {
        this.adv_order_container = $('.adv-order-panel');
        this.initial_adv_order = document.getElementsByClassName('adv-order')[0];
        this.message = {};
        this.general = {};
        this.conditions = {};
        this.actions = {};

        // return this;
        this.__init();
    }
    __init() {
        this.__addEvents();
    }
    __addEvents() {
        console.log(this.initial_adv_order);
    }
    __grabInputs() {

    }
    addOrder() {

    }


}
class Persister {

}
class ExchangeHistoryComponent {
    constructor() {
        this.length = 30;
        this.tx_list = {
            "btc-usd": {
                view: $('#exchange-history-btc-usd'),
                transactions: [],
            },
            "eth-usd": {
                view: $('#exchange-history-eth-usd'),
                transactions: [],
            },
            "ltc-usd": {
                view: $('#exchange-history-ltc-usd'),
                transactions: [],
            },
            "bch-usd": {
                view: $('#exchange-history-bch-usd'),
                transactions: [],
            },
            "eth-btc": {
                view: $('#exchange-history-eth-btc'),
                transactions: [],
            },
            "ltc-btc": {
                view: $('#exchange-history-ltc-btc'),
                transactions: [],
            },
            "bch-btc": {
                view: $('#exchange-history-bch-btc'),
                transactions: [],
            },
        }
    }
    receive(data) {
        this.__addTransaction(data);
    }
    __addTransaction(data) {
        this.tx_list[`${ data.product_id.toLowerCase() }`].transactions.unshift(data);
        if(this.tx_list[`${ data.product_id.toLowerCase() }`].transactions.length > this.length) {
            this.tx_list[`${ data.product_id.toLowerCase() }`].transactions.pop();
        }
        this.__displayTransactions(this.tx_list[`${ data.product_id.toLowerCase() }`]);

    }
    __displayTransactions(prop) {
        // this.tx_list[`${ prop.product_id.toLowerCase() }`].view.innerHTML = '';
        prop.view.innerHTML = '';
        // this.tx_list[`${ prop.product_id.toLowerCase() }`].transactions.forEach(function(tx) {
        prop.transactions.forEach(function(tx){
            let html = "<li>";
            html += tx.side + ": " + tx.size + " @ " + tx.price;
            html += "</li>";

            prop.view.innerHTML += html;

        }.bind(this));

        
    }
}
class LastPriceComponent {
    constructor() {

        this.btc_price_div = $('.btc-price');
        this.eth_price_div = $('.eth-price');
        this.ltc_price_div = $('.ltc-price');
        this.bch_price_div = $('.bch-price');
        this.btcd_eth_price_div = $('.btcd-eth-price');
        this.btcd_ltc_price_div = $('.btcd-ltc-price');
        this.btcd_bch_price_div = $('.btcd-bch-price');

        this.btc_diff = $(".btc-diff")
        this.eth_diff = $(".eth-diff")
        this.ltc_diff = $(".ltc-diff")
        this.bch_diff = $(".bch-diff")
        this.btcd_eth_diff = $(".btcd-eth-diff")
        this.btcd_ltc_diff = $(".btcd-ltc-diff")
        this.btcd_bch_diff = $(".btcd-bch-diff")

        this.btc_bal = $('.btc-balance');
        this.eth_bal = $('.eth-balance');
        this.ltc_bal = $('.ltc-balance');
        this.bch_bal = $('.bch-balance');
        this.money_bal = $('.money-balance');

        this.btc_worth = $('.btc-worth');
        this.eth_worth = $('.eth-worth');
        this.ltc_worth = $('.ltc-worth');
        this.bch_worth = $('.bch-worth');

        this.portfolio_worth = $('.portfolio-worth');

    }
    receive(data) {
        this.__updatePrice(data);
    }
    //optimize one day...
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
        else if(data.product_id === "ETH-BTC") {
            let current = Number(this.btcd_eth_price_div.innerHTML);
            let diff = Number(data.price) - current;
            if(current < Number(data.price)) {
                transition(this.btcd_eth_price_div, "traded-up", 500);
                transition(this.btcd_eth_diff, "traded-up", 500);
            }
            else if(current > Number(data.price)){
                transition(this.btcd_eth_price_div, "traded-down", 500);
                transition(this.btcd_eth_diff, "traded-down", 500);
            }
            else {
                transition(this.btcd_eth_price_div, 'traded-neutral', 500);
                transition(this.btcd_eth_diff, 'traded-neutral', 500);
            }
            //this.bch_worth.innerHTML = "$" + (Number(this.bch_bal.innerHTML) * Number(data.price)).toFixed(4);
            this.btcd_eth_price_div.innerHTML = data.price;
            this.btcd_eth_diff.innerHTML = diff.toFixed(2);
        }
        else if(data.product_id === "LTC-BTC") {
            let current = Number(this.btcd_ltc_price_div.innerHTML);
            let diff = Number(data.price) - current;
            if(current < Number(data.price)) {
                transition(this.btcd_ltc_price_div, "traded-up", 500);
                transition(this.btcd_ltc_diff, "traded-up", 500);
            }
            else if(current > Number(data.price)){
                transition(this.btcd_ltc_price_div, "traded-down", 500);
                transition(this.btcd_ltc_diff, "traded-down", 500);
            }
            else {
                transition(this.btcd_ltc_price_div, 'traded-neutral', 500);
                transition(this.btcd_ltc_diff, 'traded-neutral', 500);
            }
            //this.bch_worth.innerHTML = "$" + (Number(this.bch_bal.innerHTML) * Number(data.price)).toFixed(4);
            this.btcd_ltc_price_div.innerHTML = data.price;
            this.btcd_ltc_diff.innerHTML = diff.toFixed(2);
        }
        else if(data.product_id === "BCH-BTC") {
            let current = Number(this.btcd_bch_price_div.innerHTML);
            let diff = Number(data.price) - current;
            if(current < Number(data.price)) {
                transition(this.btcd_bch_price_div, "traded-up", 500);
                transition(this.btcd_bch_diff, "traded-up", 500);
            }
            else if(current > Number(data.price)){
                transition(this.btcd_bch_price_div, "traded-down", 500);
                transition(this.btcd_bch_diff, "traded-down", 500);
            }
            else {
                transition(this.btcd_bch_price_div, 'traded-neutral', 500);
                transition(this.btcd_bch_diff, 'traded-neutral', 500);
            }
            //this.bch_worth.innerHTML = "$" + (Number(this.bch_bal.innerHTML) * Number(data.price)).toFixed(4);
            this.btcd_bch_price_div.innerHTML = data.price;
            this.btcd_bch_diff.innerHTML = diff.toFixed(2);
        }

        let total_val = Number(this.btc_worth.innerHTML.substr(1)) + Number(this.eth_worth.innerHTML.substr(1)) + Number(this.ltc_worth.innerHTML.substr(1)) + Number(this.bch_worth.innerHTML.substr(1)) + Number(this.money_bal.innerHTML.substr(1));
        this.portfolio_worth.innerHTML = "$" + total_val.toFixed(4);
    }
}
class TradeWindowComponent {
    constructor() {
        this.submit_order = $('.submit-order');
        this.message = {};
        this.order_side_radio = document.getElementsByName('side');
        this.order_choice_radio = document.getElementsByName('coin-choice');

        this.btc_price = Number($('.btc-price').value);
        this.eth_price = Number($('.eth-price').value);
        this.ltc_price = Number($('.ltc-price').value);
        this.bch_price = Number($('.bch-price').value);

        this.order_feedback = $('.order-feedback');

        this.addEvents();
        this.__updateBalances();
    }
    __grabFormValues() {
        this.order_price = $('input.order-price').value;
        this.order_amount = $('.order-amount').value;

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
        let btc_bal = $('.btc-balance');
        let eth_bal = $('.eth-balance');
        let ltc_bal = $('.ltc-balance');
        let bch_bal = $('.bch-balance');
        let money_bal = $('.money-balance');
        let portfolio_worth = $('.portfolio-worth');

        request.setup('GET', 'http://localhost:3000/trade/api/accounts', function(data){
            //console.log('Returned balances: ', data)
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
class UserHistoryComponent {
    constructor() {
        // this.trade_history = $('.trade-history-list');
        this.trade_history = $('.trade-history ol');
        this.total_fees = $('#total-fees-paid span');
        this.__addEvents();
        this.import_history_loader = $('.import-history-loader');

        this.__retrieveFromLocalStorage();
    }
    receive(data) {
        console.log("Received trade: ", data);
        if(data.type === 'received'){
            this.trade_history.innerHTML += "<li>" + "Type: " + data.type + "<br>" + "Order type: " + data.order_type + "<br>" + "Side: " + data.side + "<br>" + "Size: " +  data.size + "<br>" + "Price: " + data.price + "<br>" + "</li>";
        }
        else if(data.type === 'done' ||
                data.type === 'open') {
            this.trade_history.innerHTML += "<li>" + 'Type: ' + data.type + "<br>" + "Side: " + data.side + "<br>" + "Price point: " + data.price + "<br>" + "Remaining size: " + data.remaining_size + "<br>" + "Reason: " + data.reason + "</li>";
        }
    }
    __addEvents() {
        let import_btn = $("button.import-history");
        import_btn.addEventListener('click', this.__getHistory.bind(this));
    }
    //clear local storage upon doing this and then write to view
    __getHistory() {
        let confirmed = confirm("This may take a second...");
        if(confirmed){
            this.import_history_loader.style.visibility = 'visible';
            let history_request = new AjaxRequest();
            history_request.setup('GET', 'http://localhost:3000/trade/api/fills', this.__updateView.bind(this));
            history_request.send();
            localStorage.trade_history = '';
        }
    }
    __updateView(res) {
        this.import_history_loader.style.visibility = 'hidden';

        res = JSON.parse(res);
        console.log("Eyy", res);
        
        this.trade_history.innerHTML = '';
        res.forEach(function(c){
            this.trade_history.innerHTML += "<li>" + c.side + ": " + c.liquidity + ": " + c.size + " " + c.product_id + " @ " + c.price + "</li>";
        }.bind(this));

        let fees = this.__findTotalFees(res);
        this.total_fees.innerHTML = "$" + fees;
        this.__storeToLocalStorage();
    }
    __retrieveFromLocalStorage() {
        this.trade_history.innerHTML = localStorage.trade_history;
        this.total_fees.innerHTML = "$" + localStorage.total_fees_paid;
    }
    __storeToLocalStorage() {
        localStorage.trade_history = this.trade_history.innerHTML;
        localStorage.total_fees_paid = this.total_fees.innerHTML.substr(1);
    }
    __findTotalFees(orders) {
        let total = 0;
        orders.forEach(function(order){
            total += Number(order.fee);
        });
        console.log(total);
        return total;
    }
}
class TickerComponent {
    constructor() {
        this.btc_price_24h = $('.btc-24-hour-change')
        this.eth_price_24h = $('.eth-24-hour-change')
        this.ltc_price_24h = $('.ltc-24-hour-change')
        this.bch_price_24h = $('.bch-24-hour-change')
        this.ethbtc_price_24h = $('.btcd-eth-24-hour-change')
        this.ltcbtc_price_24h = $('.btcd-ltc-24-hour-change')
        this.bchbtc_price_24h = $('.btcd-bch-24-hour-change')
    }
    receive(data) {
        // data = JSON.parse(data);
        let coin = data.product_id;
        let view, current_price_container, params;

        if (coin === "BTC-USD") {
            view = this.btc_price_24h;
            current_price_container = $('.btc-price');
        }
        else if (coin === "ETH-USD") {
            view = this.eth_price_24h;
            current_price_container = $('.eth-price');
        }
        else if (coin === "LTC-USD") {
            view = this.ltc_price_24h;
            current_price_container = $('.ltc-price');
        }
        else if (coin === "BCH-USD") {
            view = this.bch_price_24h;
            current_price_container = $('.bch-price');
        }
        else if(coin === 'ETH-BTC') {
            view = this.ethbtc_price_24h;
            current_price_container = $('.btcd-eth-price');
        }
        else if(coin === 'LTC-BTC') {
            view = this.ltcbtc_price_24h;
            current_price_container = $('.btcd-ltc-price');
        }
        else if(coin === 'BCH-BTC') {
            view = this.bchbtc_price_24h;
            current_price_container = $('.btcd-bch-price');
        }


        let current_price = this.__getCurrentPrice(current_price_container);
        this.__updateView(view, data, current_price);
    }
    __getCurrentPrice(currency_container) {
        let element = currency_container;
        return Number(element.innerHTML);
    }
    __updateView(view, data, current_price) {
        // view.innerHTML = data;
        view.innerHTML = ((current_price - Number(data.open_24h)) / Number(data.open_24h) * 100).toFixed(2) + "%";
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
        this.UserHistoryComponent = new UserHistoryComponent();
        this.AdvancedOrderComponent = new AdvancedOrderComponent();
        this.TickerComponent = new TickerComponent();
    }
    init() {
        this.socket.onopen = this.__onOpen.bind(this);
        this.socket.onmessage = this.__onMessage.bind(this);
        this.socket.onerror = this.__onError.bind(this);
        this.socket.onclose = this.__onClose.bind(this);
        
        // Close the connection when the window is closed
        window.addEventListener('beforeunload', () => this.socket.close());
    }
    __onOpen() {
        // send data to the server
        console.log("Connected to web socket server...");
        var json = JSON.stringify({ message: 'Client accessed socket...' });
        this.socket.send(json);
    }
    __onMessage(event) {
        let data = JSON.parse(JSON.parse(event.data));


        if(data.type !== 'match' || 
            data.type !== 'ticker'){
            this.TickerComponent.receive(data);
        }
        if(data.type === 'match'){
            this.LastPriceComponent.receive(data);
            this.ExchangeHistoryComponent.receive(data);
        }
        else if(data.type === 'received'){
            this.UserHistoryComponent.receive(data);
        }
        else if(data.type === 'done' ||
                data.type === 'open') {
            this.UserHistoryComponent.receive(data);
        }
    }
    __onError(event) {
        console.log("ERROR WITH CLIENT SOCKET!", event);
        this.socket.close();
    }
    __onClose() {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ CLOSING @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        this.socket.close();
        
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

