from extract import HeadlineExtractor
import inspect
import datetime
import time
import sys

class InsuredCaller:
    def __init__(self):
        self.start_time = datetime.datetime.now()
        self.finish_time = None
        self.time_taken = None
        print('Starting...')
        
    # do not call this func directly
    def _main(self, *params):
        parameters = [param for param in params]
        func_name = parameters.pop(0)
        print('Args: ', parameters)
        main = True
        while main == True:
            try:
                self.caller = HeadlineExtractor()

                self.function_map = {
                    'start_google': self.caller.scrape_google,
                    'start_twitter': self.caller.scrape_twitter,
                    'start_news_dot_bitcoin': self.caller.scrape_news_dot_bitcoin,
                    'start_cnbc': self.caller.scrape_cnbc,
                }

                func = self.function_map[func_name]
                returned = func(*parameters)
                
                main = False
                return returned

            except KeyboardInterrupt as ki:
                user_input = input("Stopped (" + datetime.datetime.now() + ") : 'q' to quit or 'r' to restart...")
                if user_input == 'q':
                    print("Goodbye...")
                    main = False
                    break
                elif user_input == 'r':
                    print("Restarting...")
                    continue
            except Exception as e:
                print("ERROR" + e + "(" + datetime.datetime.now() + ")")
                print(e, "Error... restarting")
                break
            except ConnectionResetError as e:
                print("Stopped (" + e + datetime.datetime.now() + ")")
                continue

    def start_google(self, start_date, end_date, pages, save=False, return_dataframe=True):
        '''
        Scrapes all google.com search headlines from start_date to end date in YYYY-MM-DD format, getting up to the pages-th page of results and returns them.
        :param start_date: Date to begin scraping.
        :param end_date: Date to cease scraping.
        :param pages: Number of results pages to scrape.
        :param save: If true saves the file to data/raw_articles/google/startdate-enddate.csv
        :param return_dataframe: if true returns the dataframe.
        :return: Pandas dataframe containing headlines and time stamps..
        '''
        return self._main(sys._getframe().f_code.co_name, start_date, end_date, pages, save, return_dataframe)


    def start_twitter(self, start_date, end_date, query, user=None, pages=1, save=False, return_dataframe=True):
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
        return self._main(sys._getframe().f_code.co_name, start_date, end_date, query, user, pages, save, return_dataframe)


    def start_news_dot_bitcoin(self, from_page, to_page, save=False, return_dataframe=True):
        '''
        Scrape news.bitcoin.com headlines from the second page of news headlines up to the to_page page.
        :param to_page: Page to scrape to, inclusive.
        :return: Dataframe containing headlines and timestamps.
        '''
        return self._main(sys._getframe().f_code.co_name, from_page, to_page, save, return_dataframe)

    def start_cnbc(self, from_page, to_page, query, save=False, return_dataframe=True):
        '''
        Scrapes cnbc for headlines
        :param from_page: Page to begin scraping.
        :param end_page: Page to cease scraping.
        :param query: Search query.
        :param save: If true saves the file to data/raw_articles/google/startdate-enddate.csv
        :param return_dataframe: if true returns the dataframe.
        :return: Pandas dataframe containing headlines and time stamps..
        '''
        return self._main(sys._getframe().f_code.co_name, from_page, to_page, query, save, return_dataframe)



if __name__== '__main__':
    caller = InsuredCaller()
    df = caller.start_twitter('2017-01-01', '2017-01-02', 'bitcoin', user=None, pages=1, save=False, return_dataframe=True)
    # df = 
    print('Returned!...', df)
    time.sleep(40)
