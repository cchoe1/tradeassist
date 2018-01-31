import datetime



def analyze():
    from data.get import gdax_closing_prices
    prices = gdax_closing_prices()


if __name__=='__main__':
    analyze()