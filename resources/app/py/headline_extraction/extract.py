import datetime
from time import mktime
import pandas as pd

import time
from bs4 import BeautifulSoup

class HeadlineExtractor:
    def __init__(self):
        from selenium.webdriver import Firefox
        import os
        current_dir = os.path.dirname(os.path.realpath(__file__))
        self.driver = Firefox(executable_path=current_dir + "/geckodriver")

    def __del__(self):
        self.driver.close()

    def _scrape_google_url(self, url):
        '''
        Use webdriver to scrape the passed in URL and add all new headlines to the headline_list and date_list.
        :param url: Url to scrape.
        :return: None
        '''
        driver = self.driver
        headline_list = []
        date_list = []
        headlines = []
        driver.get(url)
        new_headlines = []
        new_dates = []
        class_names = (['_pJs', 'r._gJs'], ['f.nsa._QHsF', 'f.nsa._QHs']) # (headline class names, date class names)

        for headline_class in class_names[0]:
            new_headlines += driver.find_elements_by_class_name(headline_class)
        for date_class in class_names[1]:
            new_dates += driver.find_elements_by_class_name(date_class)
        new_dates = [mktime(datetime.datetime.strptime(d.text, '%b %d, %Y').timetuple()) for d in new_dates]
        for h in new_headlines:
            headline_list.append(h.text)
        for d in new_dates:
            date_list.append(d)
        return (headline_list, date_list)

    def _daterange_string_from(self, datetime_series):
        posix_timestamps = [t.timestamp() for t in datetime_series]
        start_dt = datetime.datetime.fromtimestamp(min(posix_timestamps))
        end_dt = datetime.datetime.fromtimestamp(max(posix_timestamps)) + datetime.timedelta(days=1)
        return start_dt.strftime('%Y-%m-%d') + '-to-' + end_dt.strftime('%Y-%m-%d')

    def _save_article_df(self, df, article_source):
        import os
        old_cwd = os.getcwd()
        os.chdir(os.path.dirname(os.path.realpath(__file__)))
        timestamps = [t.timestamp() for t in df['date']]
        earliest_ts = min(timestamps)
        latest_ts = max(timestamps)
        earliest_dt = datetime.datetime.fromtimestamp(earliest_ts).replace(hour=0, minute=0, second=0, microsecond=0)
        latest_dt = datetime.datetime.fromtimestamp(latest_ts).replace(hour=0, minute=0, second=0, microsecond=0) + datetime.timedelta(days = 1)
        if not os.path.isdir('../data/raw_articles/{}'.format(article_source)):
            os.mkdir('../data/raw_articles/{}'.format(article_source))

        current_dt = earliest_dt
        c = 0
        while current_dt < latest_dt:
            tomorrow_dt = current_dt + datetime.timedelta(days = 1)
            today_df = df[(df['date'] >= current_dt) & (df['date'] < tomorrow_dt)]
            save_name = '{}-to-{}.csv'.format(current_dt.strftime("%Y-%m-%d"), tomorrow_dt.strftime("%Y-%m-%d"))
            current_dt = tomorrow_dt
            today_df.to_csv('../data/raw_articles/{}/{}'.format(article_source, save_name), index=False)
            c += 1
        os.chdir(old_cwd)
        print('Saved new data at /data/raw_articles/{}, created {} new csv files.'.format(article_source, c))

    def scrape_google(self, start_date, end_date, pages, save=False, return_dataframe=True):
        '''
        Scrapes all google.com search headlines from start_date to end date in YYYY-MM-DD format, getting up to the pages-th page of results and returns them.
        :param start_date: Date to begin scraping.
        :param end_date: Date to cease scraping.
        :param pages: Number of results pages to scrape.
        :param save: If true saves the file to data/raw_articles/google/startdate-enddate.csv
        :param return_dataframe: if true returns the dataframe.
        :return: Pandas dataframe containing headlines and time stamps..
        '''
        if not save and not return_dataframe: raise ValueError
        from headline_extraction.urls import google_date_urls
        import datetime
        urls = google_date_urls(start_date, end_date, pages)
        r = []
        all_headlines_and_dates = []
        for url in urls:
            all_headlines_and_dates.append(self._scrape_google_url(url))
        i = 0
        for headlines, dates in all_headlines_and_dates:
            print(headlines, dates)
            while i < len(headlines):
                r.append([headlines[i], dates[i]])
                i += 1
        df = pd.DataFrame(r, columns=['article', 'date'])
        df['date'] = df['date'].apply(datetime.datetime.fromtimestamp)
        if save:
            self._save_article_df(df, 'google')
        if return_dataframe:
            return df
    def scrape_twitter(self, start_date, end_date, query, user=None, pages=1, save=False, return_dataframe=True):
        '''
        Scrapes twitter and goes down pages-number of times down (each iteration loads more results per day) and scrapes all tweets.  Can specify specific user and query

        :param (String) start_date  : Date to begin scraping.
        :param (String) end_date    : Date to cease scraping.
        :param (String) query       : The specific query to search for
        :param (String) user        : Specify user whose tweets you wish to scrape
        :param (Int) pages          : Number of extra tweet sets to load.
        :param (Bool) save          : If true saves the file to data/raw_articles/google/startdate-enddate.csv
        :param (Bool) return_dataframe: if true returns the dataframe.
        :return: Pandas dataframe containing headlines and time stamps..
        '''
        if not save and not return_dataframe: raise ValueError
        #if from_page > to_page or from_page < 1: raise ValueError
        # from headline_extraction.urls import UrlListWrapper
        from urls import UrlListWrapper

        date_list = UrlListWrapper(start_date, end_date, query)
        urls = date_list.getTwitterUrls(user)
        twitter_headlines = []
        for url in urls:
            i = 1 
            self.driver.get(url)
            time.sleep(1)

            while i < pages: 
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                i += 1
                time.sleep(3)

            tweet_list = self.driver.find_elements_by_css_selector('div.tweet.js-stream-tweet div.content')

            for tweet in tweet_list:
                headline = tweet.find_element_by_css_selector('p.TweetTextSize.js-tweet-text.tweet-text').get_attribute('innerHTML')

                headline = BeautifulSoup(headline, 'lxml').get_text()
                # headline = soup.get_text()
                headline = headline.replace('\n', ' ')
                user = tweet.find_element_by_css_selector('span.username.u-dir b').get_attribute('innerHTML')
                timestamp = tweet.find_element_by_css_selector('a.tweet-timestamp span._timestamp').get_attribute('innerHTML')
                timestamp = mktime(datetime.datetime.strptime(timestamp, '%d %b %Y').timetuple())
                # print(headline, timestamp)
                twitter_headlines.append((headline, timestamp))


        df = pd.DataFrame(twitter_headlines, columns=['article', 'date'])
        df['date'] = df['date'].apply(datetime.datetime.fromtimestamp)


        print('Saving dataframe...', df)
        if save:
            self._save_article_df(df, 'twitter')
        if return_dataframe:
            return df


    def scrape_news_dot_bitcoin(self, from_page, to_page, save=False, return_dataframe=True):
        '''
        Scrape news.bitcoin.com headlines from the second page of news headlines up to the to_page page.
        :param to_page: Page to scrape to, inclusive.
        :return: Dataframe containing headlines and timestamps.
        '''
        if not save and not return_dataframe: raise ValueError
        if from_page > to_page or from_page < 2: raise ValueError
        r = []
        for i in range(from_page, to_page):
            self.driver.get("https://news.bitcoin.com/page/{}".format(i))
            titles = self.driver.find_elements_by_class_name('td-module-title')
            dates = self.driver.find_elements_by_class_name('td-module-date')
            assert len(titles) == len(dates), "Unequal titles and dates scraped from page!"
            for i in range(len(titles)):
                r.append((titles[i].text, mktime(datetime.datetime.strptime(dates[i].text, '%b %d, %Y').timetuple())))
        r = pd.DataFrame(r, columns=['article', 'date'])
        r['date'] = r['date'].apply(datetime.datetime.fromtimestamp)
        if save:
            self._save_article_df(r, 'news_dot_bitcoin')
        if return_dataframe:
            return r

    def printResults(self):
        pass

    def scrape_cnbc(self, from_page, to_page, query, save=False, return_dataframe=True):
        '''
        Scrapes cnbc for headlines
        :param from_page: Page to begin scraping.
        :param end_page: Page to cease scraping.
        :param query: Search query.
        :param save: If true saves the file to data/raw_articles/google/startdate-enddate.csv
        :param return_dataframe: if true returns the dataframe.
        :return: Pandas dataframe containing headlines and time stamps..
        '''
        if not save and not return_dataframe: raise ValueError
        if from_page > to_page or from_page < 1: raise ValueError
        
        try:
            start_page_num = from_page

            start_page = self.driver.get('https://search.cnbc.com/rs/search/view.html?partnerId=2000&keywords=' + query + '  &pubtime=0&pubfreq=a' + '&sort=date&page=' + str(from_page))
    
            list_of_headlines = []
            end = False
            while from_page <= to_page or end == True:
                list_of_articles = self.driver.find_elements_by_css_selector('div.SearchResultCard')
                for article in list_of_articles:
                    headline = article.find_element_by_css_selector('h3.title a').get_attribute('innerHTML')
                    headline = BeautifulSoup(headline).get_text().strip()

                    date = article.find_element_by_css_selector('time').get_attribute('innerHTML')
                    date = BeautifulSoup(date).get_text()
                    date = date.split(' | ')[0].split(', ')[1]
                    date = mktime(datetime.datetime.strptime(date, '%d %b %Y').timetuple())
    
                    list_of_headlines.append((headline, date))
                
                time.sleep(1)
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)
        
                next_button = self.driver.find_elements_by_css_selector('div#centerPagCol a')
                for index, button in enumerate(next_button):
                    if int(button.get_attribute('innerHTML')) == from_page + 1:
                        next_button[index].click()
                        end = False
                        break
                    end = True
                
                if end:
                    break
                else:
                    pass
                from_page += 1
                time.sleep(2)
            
            df = pd.DataFrame(list_of_headlines, columns=['article', 'date'])
            df['date'] = df['date'].apply(datetime.datetime.fromtimestamp)
            print(df)
            if save:
                self._save_article_df(df, 'cnbc')
            if return_dataframe:
                return df
        except KeyboardInterrupt as ki:
            print("One second...shutting down...stopped at page ", len(list_of_headlines) / 10, '(restart script on page ', len(list_of_headlines) / 10 + start_page_num, ')...' )
            df = pd.DataFrame(list_of_headlines, columns=['article', 'date'])
            df['date'] = df['date'].apply(datetime.datetime.fromtimestamp)
            print(df)
            if save:
                self._save_article_df(df, 'cnbc')
            if return_dataframe:
                return df
        except Exception as e:
            print("Error on page ", len(list_of_headlines) / 10, '(restart script on page ', len(list_of_headlines) / 10 + start_page_num, ')...', e)
            df = pd.DataFrame(list_of_headlines, columns=['article', 'date'])
            df['date'] = df['date'].apply(datetime.datetime.fromtimestamp)
            print(df)
            if save:
                self._save_article_df(df, 'cnbc')
            if return_dataframe:
                return df


class InvalidConfigurationException(Exception):
    pass

if __name__ == '__main__':
    TEST_URL = 'https://www.google.com/search?q=bitcoin&client=ubuntu&hs=FJp&channel=fs&biw=1440&bih=809&source=lnt&tbs=cdr%3A1%2Ccd_min%3A10%2F29%2F2017%2Ccd_max%3A10%2F29%2F2017&tbm=nws'
    extractor = HeadlineExtractor()
    # print(extractor.scrape_news_dot_bitcoin(2, save=True))
    # extractor.scrape_cnbc(74, 999999, 'bitcoin', save=True)
    # extractor.scrape_cnbc(142, 999999, 'bitcoin', save=True)

    # extractor.scrape_twitter('2017-01-01', '2017-01-02', 'bitcoin', user=None, pages=5, save=True)
    extractor.scrape_twitter('2017-01-01', '2017-01-05', 'bitcoin', user=None, pages=1, save=True)
