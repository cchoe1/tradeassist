import datetime
class UrlList():
    # __init__ ( self , String start_date , String end_date , String desired_query)
    def __init__(self, start, end, query):
        self.start = start
        self.end = end
        self.query = query

        self.start_year = int(start.split('-')[0])
        self.end_year = int(end.split('-')[0])

        self.start_month = int(start.split('-')[1])
        self.end_month = int(end.split('-')[1])

        self.start_day = int(start.split('-')[2])
        self.end_day = int(end.split('-')[2])

        self.structure = []
        self.injectables = []
        self.date_format = None
        self.is_injectable_supplied = False

    def getDates(self):
        start = datetime.date(self.start_year, self.start_month, self.start_day)
        end = datetime.date(self.end_year, self.end_month, self.end_day)
        dates = []

        while start < end:
            dates.append(start)
            # dates.append((start, start + datetime.timedelta(days=1)))
            start += datetime.timedelta(days=1)
        return dates

    # setDateFormat ( self , String format_of_date )
    def setDateFormat(self, date_format):
        self.date_format = date_format

    # formatDates ( self , Array [ Datetime datetime objects ] , String format_of_time )
    def formatDates(self, date_list):
        if self.date_format is None:
            struct = "%m/%d/%Y"
        else:
            struct = self.date_format

        new_dates = []
        print(struct)
        for date in date_list:
            new_dates.append(date.strftime(struct))

        return new_dates

    # getGoogleUrls ( self , Int max_num_of_pages )
    def getGoogleUrls(self, pagemax):
        pagemax = range(0, pagemax)
        date_list = self.getDates()
        dates = self.formatDates(date_list)

        query = self.query.replace(' ', '+')

        final = []
        i = 0
        for date in dates:
            for page in pagemax:
                try:
                    #url = first + dates[i] + second + dates[i + 1] + third + str(page) + fourth
                    url = "https://www.google.com/search?q=%s&tbs=cdr:1,cd_min:%s,cd_max:%s&tbm=nws&ei=pN1XWsHTOtHVzwKIn4ngAg&start=%s0&sa=N&biw=1037&bih=463&dpr=1" % (query, dates[i], dates[i+1], str(page))
                    final.append(url)
                except IndexError as e:
                    pass
            i = i + 1

        return final

    # getUrls ( self , Int number_of_pages )
    def getUrls(self, pagemax):
        date_list = self.getDates()
        dates = self.formatDates(date_list)

        query = self.query.replace(' ', '+')

        final = []
        i = 0

        for date in dates:
            page = 0
            while page < pagemax:

                #####################################################################################
                if self.is_injectable_supplied:
                    order = []
                    for index, item in enumerate(self.injectables):

                        for k, v in item.items():

                            if(v == '$DATE'):
                                try:
                                    endpoint = dates[i+1]
                                except IndexError as index_error:
                                    endpoint = (datetime.datetime.strptime(dates[i], self.date_format) + datetime.timedelta(days=1)).strftime(self.date_format)
                                order.append(dates[i])
                                order.append(endpoint)
                            else:
                                order.append(v)
                    the_url = self.urlFactory(*order)
                #####################################################################################


                else:
                    try:
                        endpoint = dates[i+1]
                        print(endpoint)
                    except IndexError as index_error:
                        endpoint = (datetime.datetime.strptime(dates[i], self.date_format) + datetime.timedelta(days=1)).strftime(self.date_format)
                        print(index_error, " - need to artificially create endpoint since it does not exist in the list - this is normal behavior")
                    the_url = self.urlFactory(query, dates[i], endpoint, page)


                ######################################################################################
                final.append(the_url)
                page += 1
            i = i + 1
        return final

    # urlFactory ( self , Tuple/Array ( *items_to_inject_between_url_frags ) )
    def urlFactory(self, *injectables):
        
        e = 0
        final_url = ''
        for item in injectables:
            final_url = final_url + self.structure[e] + str(item)
            e = e + 1
        final_url = final_url + self.structure[-1]



        return final_url

    # setUrlFormat ( self , Tuple/Array *url_fragments )
    def setUrlFormat(self, *pieces):
        structure = [piece for piece in pieces]
        self.structure = structure if structure else print("Error with ", structure)
        return structure

    # specifyInjectables ( self , Tuple/Array *variables_to_inject_between_url_frags )
    def specifyInjectables(self, *injectables):
        # inject = [item for item in injectables]
        i = 0
        inject = []
        for item in injectables:
            if isinstance(item, list):
                inject.append({'list': item})

            elif isinstance(item, str):
                inject.append({'const': item})
            pass
            i += 1
        self.injectables = inject
        self.is_injectable_supplied = True
        # return inject

class UrlListWrapper:
    def __init__(self, start, end, query):
        self.start = start
        self.end = end
        self.query = query
        self.urlList = UrlList(start, end, query)


    def getGoogleUrls(self, page_count):
        first = "https://www.google.com/search?q="
        #query
        blarg = "&tbs=cdr:1,cd_min:"
        #start_date = timestamp[0]
        second = ",cd_max:"
        #end_date = timestamp[1]
        third = "&tbm=nws&ei=pN1XWsHTOtHVzwKIn4ngAg&start="
        #page_number = pagemax
        fourth = "0&sa=N&biw=1037&bih=463&dpr=1"

        # test = UrlList('2017-01-01', '2017-01-02', 'bitcoin')
        test = UrlList(self.start, self.end, self.query)
        test.setDateFormat('%m/%d/%Y')
        test.setUrlFormat(first, blarg, second, third, fourth)
        return test.getUrls(page_count)

    def getTwitterUrls(self, user=None):
        
        first = 'https://twitter.com/search?l=&q='
        # query
        second = '%' + '20from%3A'
        # user
        third = '%' + '20since%3A'
        # yyyy-mm-dd start
        fourth = '%' + '20until%3A'
        # yyyy-mm-dd end
        fifth = '&src=typd'

        url_list = UrlList(self.start, self.end, self.query)
        url_list.setDateFormat('%Y-%m-%d')
        if(user == None):
            url_list.setUrlFormat(first, third, fourth, fifth)
            url_list.specifyInjectables(self.query, '$DATE')
        else:
            url_list.setUrlFormat(first, second, third, fourth, fifth)
            url_list.specifyInjectables(user, self.query, '$DATE')
        return url_list.getUrls(1)
            
    def getCNBCUrls(self):
        #https://search.cnbc.com/rs/search/view.html?source=CNBC.com&categories=exclude&partnerId=2000&keywords=BITCOIN
        #https://search.cnbc.com/rs/search/view.html?partnerId=2000&keywords=BITCOIN&sort=date&page=1

        #print(url_list.getUrls(1))
        pass

#get_headlines(searchStartDate, searchEndDate, 'helloworld.py')


####
# getDateList() returns a list of all dates - change the array of years to change the timeframe

#############################################
# Steps to using this:
#     0. Determine breakpoints in URL and separate into list, figure out variables (injectables) in URL
#    1. Configure start/end date in format given, specify query
#    2. Instantiate UrlList() class and format the URL structure
#     3. Format date if necessary
#     4. Call method getUrls() with # of pages you wish to grab
#     OPTIONAL:
#        - Manually override injectables by calling method specifyInjectables()
#        - Create a wrapper for method urlFactory() and generate URLs with custom parameters
#    NOTE:
#        - Method getUrls() should be called last
#        - # of URL pieces should equal # of injectables + 1
#        - Date must always be entered in static format, but you can specify the use format with 
#             setDateFormat()
#        - 
#        
#############################################
first = "https://www.google.com/search?q="
#query
blarg = "&tbs=cdr:1,cd_min:"
#start_date = timestamp[0]
second = ",cd_max:"
#end_date = timestamp[1]
third = "&tbm=nws&ei=pN1XWsHTOtHVzwKIn4ngAg&start="
#page_number = pagemax
fourth = "0&sa=N&biw=1037&bih=463&dpr=1"


# GoogleUrlList = UrlListWrapper('2017-01-01', '2017-01-02', 'bitcoin prices')
# google_urls = GoogleUrlList.getGoogleUrls(1)

TwitterUrlList = UrlListWrapper('2017-01-01', '2017-01-15', 'bitcoin')
twitter_urls = TwitterUrlList.getTwitterUrls()
#google_urls = UrlListWrapper()

# print(google_urls)





# test = UrlList('2017-01-01', '2017-01-02', 'bitcoin')
# test.setDateFormat('%m/%d/%Y')
# test.setUrlFormat(first, blarg, second, third, fourth)
#datetest = test.getDates()
# print(test.formatDates(datetest))






searchStartDate = '2017-02-01'
searchEndDate = '2017-03-01'
query = 'bitcoin prices'



date = UrlList(searchStartDate, searchEndDate, query)
date.setDateFormat('%m/%d/%Y')
date.setUrlFormat(first, blarg, second, third, fourth)
#print(date.getUrls(5))
#print(date.specifyInjectables('hahaha', 'wtf', 'ok', 'one', 'two', 'yes'))
#date.setUrlFormat('hi', 'wanna', 'buy', 'a', 'cookie?')

#date.specifyInjectables('yo', 'wassup', 'hello', 'ok')
def google_date_urls(start, end, pages):
    date = UrlList(start, end, query)
    date.setDateFormat('%m/%d/%Y')
    date.setUrlFormat(first, blarg, second, third, fourth)
    print(date.getUrls(pages))
    return date.getUrls(pages)






