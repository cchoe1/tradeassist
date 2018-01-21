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

If you would like to contribute or fix any bugs, please fork off this repository and make your changes on a new branch and submit a pull request with that branch.

Some configuration is required.  Please check under the Installation section for more information.

# INSTALLATION

This package is a NodeJS project and requires NodeJS and npm (node package manager) to be installed on your machine.  Please ensure these are on your system before proceeding.

1.  `git clone https://github.com/cchoe1/tradeassist`

2.  `npm install`

3.  Edit configuration files and follow instructions within (requires API keys from GDAX)

4.  Once configuration is set, run `npm start` to initialize the UI

5.  Access UI at `http://localhost:3000`

# FURTHER NOTES

Public facing interfaces may be created through the use of VirtualHost configuration and port forwarding.  Please be advised that this system may not be entirely secured at the time of this writing and that you should be cautious when opening ports that allows you to connect to this UI from the outside internet.  With a default installation, your UI is automatically separated from the outside world and mostly secure.  Please understand the risks of doing so.

# TERMS AND CONDITIONS

This software is presented and provided as is.  I will do my best to ensure stable releases and bug-free environments but I cannot be liable for any losses you incur while using this software.  Misuse of this software may result in tangible financial losses.  Please be advised of the risks when dealing with cryptocurrencies and please be aware that this involves **REAL money**.  Please make educated decisions when engaging in the buying and selling of cryptocurrencies.