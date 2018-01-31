
import datetime
import matplotlib.pyplot as plt
from matplotlib.dates import date2num
from data.get import DataGetter
import numpy as np

def prices_and_sentiment(start_date, end_date):
    dg = DataGetter()
    sentiment = dg.google_daily_sentiment_ratio(start_date, end_date)
    #sentiment['ratio'] = np.log(sentiment['ratio']) # For scale
    gdax_candles = dg.gdax_candles_between(start_date, end_date)

    dates = gdax_candles['date'].apply(date2num)

    max_price = gdax_candles['close'].max()
    min_price = gdax_candles['close'].min()
    max_ratio = sentiment['ratio'].max()
    scale = (max_price - min_price) / max_ratio
    sentiment['ratio'] = (sentiment['ratio'] * scale) + min_price

    plt.plot_date(dates, gdax_candles['close'], fmt='-')
    plt.plot_date(dates, sentiment['ratio'], fmt='-')
    plt.show()



if __name__ == '__main__':
    prices_and_sentiment('2017-01-01', '2017-05-01')
