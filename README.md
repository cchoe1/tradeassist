# tradeassist
Trading Assist for various cryptocurrencies

 ```
 _____________________________
< You fill a much-needed gap. >
 -----------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||                
```

Welcome to Trade Assist.  This software package is intended to give you enhanced trading tools for various exchanges such as GDAX and other cryptocurrency exchanges (soon to come!).  This also serves as a virtual portfolio for your current assets and gives you detailed views on your current positions, gains, losses, and trade history.  

Trade Assist is capable of syncing up to GDAX's Websocket feed and receive real-time data.  Be advised that in order to receive data for your portfolio, you will need to supply private API keys.  Take caution to conceal these keys and store them safely as API keys may or may not have the ability to make drastic changes to your account or your balances.

In order for this to work properly, please ensure that this software is running whenever you are trading on GDAX.  You can find more detailed instructions on installation below:

If you would like to contribute or fix any bugs, please fork off this repository and make your changes on a new branch and submit a pull request with that branch.  Submit any issues or bugs you may find to the 'Issues' page on this Github repository or send me an e-mail at calvinchoe1@gmail.com.

Some configuration is required.  Please check under the Installation section for more information.

# INSTALLATION

This package is a NodeJS project and requires NodeJS and npm (node package manager) to be installed on your machine.  Please ensure these are on your system before proceeding.

1.  `git clone https://github.com/cchoe1/tradeassist` to clone this repository

2.  `cd tradeassist/`

3.  `npm install` to install necessary dependencies

4.  Edit configuration files and follow instructions within (requires API keys from GDAX)

5.  Once configuration is set, run `npm start` to initialize the UI

6.  Access UI at `http://localhost:3000`

# HOW TO USE THIS SOFTWARE

(Subject to change, this is kind of my outline)

Tradeassist is NOT (currently) autonomous--in other words, this software will not automatically trade for you.  It is up to you to set directives and use the tools provided.  This software represents a toolset that enhances your trading on an exchange such as GDAX.  

Tradeassist provides tools such as more complex orders, taker fee dodger, portfolio trackers, and more.  The ultimate goal of Tradeassist is to get you away from staring at tickers all day long and doing more productive things with your time, while also translating the logic of your trading strategy into simple directives and orders.  In short, Tradeassist's goal is to make your trading more efficient.

## Advanced Orders (Coming Soon)

Tradeassist comes with advanced orders which allow you to make more sophisticated orders besides the traditional market, limit, or stop loss/limit.  Primitive logic statements can be used in conjunction with a set of filtering and analysis tools to make better trades without the need for constant attention.  

# FURTHER NOTES

Public facing interfaces may be created through the use of port forwarding.  Please be advised that this system may not be entirely secured at the time of this writing and that you should be cautious when opening ports that allows you to connect to this UI from the outside internet.  With a default installation, your UI is automatically separated from the outside world and mostly secure.  Please understand the risks of port forwarding and opening your internet to the outside world.  This software will recognize changes to your account and run seamlessly despite your being outside of the local network so it is not entirely necessary to open this interface to the public internet.

# TERMS AND CONDITIONS

This software is presented and provided as is.  I will do my best to ensure stable releases and bug-free environments but I cannot be liable for any losses you incur while using this software.  Misuse of this software may result in tangible financial losses.  Please be advised of the risks when dealing with cryptocurrencies and please be aware that this involves **REAL money**.  Cryptocurrencies may be subject to **extreme volatility** and **phases of low liquidity** -- PLEASE UNDERSTAND THESE RISKS.

Please be aware that any existing trades may be cancelled if your internet connection to GDAX is lost. Some orders may exist within GDAX itself and some orders may only exist on your local machine, not having yet been pushed to GDAX.  You should ensure that this software continually runs in the background if you wish to have any special orders in your pipeline and this software cannot do anything in the event of failure on GDAX's end.  I am not liable for any mishandling, misuse, or other actions that may lead to financial losses.  Please exercise caution and make educated decisions when using this program.