import pandas as pd


class DataGetter:
        def __init__(self):
            pass

        def _save_new_feature_vectorizer(self, sources=['google']):
            from pickle import dump
            from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
            import os
            import numpy as np
            cv = CountVectorizer()
            tfidf = TfidfTransformer()
            all_csv = []
            old_wd = os.getcwd()
            os.chdir(os.path.dirname(os.path.realpath(__file__)))

            for source in sources:
                f_names = os.listdir(source)
                for f in f_names:
                    df = pd.read_csv('{}/{}'.format(source, f))


        def _text_series_to_feature_vector(self, series):
                from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
                return TfidfTransformer().fit_transform(CountVectorizer().fit_transform(series))

        def _dated_csvs_within_range(self, all_csv, start_date, end_date):
                csv_within_range = []
                split_csv = [s.split('-to-') for s in all_csv]
                for i, split in enumerate(split_csv):
                    csv_start_date = split[0]
                    csv_end_date = split[1]
                    csv_end_date = csv_end_date[:csv_end_date.find('.')]  # remove .csv from end date.
                    if csv_start_date >= start_date and csv_end_date < end_date:
                        csv_within_range.append(all_csv[i])
                return csv_within_range

        def training_articles(self, source, mode='pos-vs-neg', date_range=None):
                import os
                import datetime
                from helpers import is_not_nan, non_negative_to_one, negative_to_zero, minus_one_to_zero
                POSSIBLE_SETTINGS = ['pos-vs-neg', 'neutrality', 'relevance']

                assert mode in POSSIBLE_SETTINGS, 'Invalid mode passed to training articles.'

                dir_path = os.path.dirname(os.path.realpath(__file__))
                old_cwd = os.getcwd()
                possible_directories = [d for d in os.listdir('training_articles') if
                                        os.path.isdir('training_articles/{}'.format(d))]

                assert source in possible_directories, "Invalid source passed to training_articles."

                file_names = os.listdir(dir_path + '/training_articles/{}'.format(source))
                rows = []
                cols = ['article', 'date', 'label']
                os.chdir(dir_path)

                for f in file_names:
                    df = pd.read_csv('training_articles/{}/'.format(source) + f)
                    for i, row in df.iterrows():
                        rows.append(row[cols].as_matrix())
                os.chdir(old_cwd)
                data = pd.DataFrame(rows, columns=cols)
                data = data[data['label'].apply(is_not_nan)]
                if mode=='pos-vs-neg':
                    data = data[data['label'] != -2]
                    data = data[data['label'] != -1] #Positive versus negative, so drop all rows labeled -1(which indicates neutral)
                elif mode=='neutrality':
                    data = data[data['label'] != -2]
                    data['label'] = data['label'].apply(non_negative_to_one).apply(negative_to_zero) # Neutral vs. not neutral. Set all neutral rows to 0 all non-neutral rows to 1.
                elif mode=='relevance':
                    data['label'] = data['label'].apply(minus_one_to_zero).apply(non_negative_to_one).apply(negative_to_zero) # Relevant vs irrelevant, relevant set to 1 irrelevant set to 0.


                print('Data initialized with {} rows.'.format(len(data.index)))
                x = data['article']
                x = self._text_series_to_feature_vector(data['article'])
                data['feature_vector'] = x
                data['date'] = data['date'].apply(datetime.datetime.fromtimestamp) #convert dates from timestamp to date time.
                if date_range is not None: # specified date range, so filter out all rows that are not in that range.
                    import datetime
                    start_dt = datetime.datetime.strptime(date_range[0], '%Y-%m-%d')
                    end_dt = datetime.datetime.strptime(date_range[1], '%Y-%m-%d')
                    return data[(data['date'] >= start_dt) & (data['date'] < end_dt)]
                else: # No specified date range, so return all rows.
                    return data


        def raw_articles(self, source, start_date, end_date):
                import os
                os.chdir(os.path.dirname(os.path.realpath(__file__)))
                possible_sources = [d for d in os.listdir('raw_articles') if os.path.isdir('raw_articles/{}'.format(d))]
                assert source in possible_sources, 'Invalid source passed to raw articles, no directory found for {}'.format(source)
                all_csv = [csv for csv in os.listdir('raw_articles/{}'.format(source)) if csv.endswith('.csv')]
                csv_within_range = self._dated_csvs_within_range(all_csv, start_date, end_date)

                rows = []
                for f in csv_within_range:
                    df = pd.read_csv('raw_articles/{}/{}'.format(source, f))
                    for i, row in df.iterrows():
                        rows.append(row.as_matrix())

                df = pd.DataFrame(rows, columns=['article', 'date'])
                df['feature_vector'] = self._text_series_to_feature_vector(df['article'])
                del df['article']
                return df

        def google_daily_sentiment_ratio(self, start_date, end_date):
                import datetime
                from copy import copy
                headline_data = self.training_articles('google', date_range=(start_date, end_date))
                today_dt = datetime.datetime.strptime(start_date, '%Y-%m-%d')
                end_dt = datetime.datetime.strptime(end_date, '%Y-%m-%d')
                r = []
                while today_dt < end_dt:
                    # Filter out data that is not in the correct date range.
                    today_data = headline_data[(headline_data['date'] >= today_dt) & (headline_data['date'] < (today_dt + datetime.timedelta(days=1)))]
                    pos_count = 1
                    neg_count = 1
                    for label in today_data['label'].as_matrix():
                        if label == 1:
                            pos_count += 1
                        elif label == 0:
                            neg_count += 1
                    ratio = pos_count / neg_count
                    dt = copy(today_dt)
                    r.append([dt, ratio])
                    today_dt += datetime.timedelta(days=1)
                return pd.DataFrame(r, columns=['date', 'ratio'])

        def gdax_candles_between(self, start_date, end_date):
                from helpers import datestring_to_datetime
                from pandas import read_csv
                import os
                import datetime
                start_dt = datetime.datetime.strptime(start_date, '%Y-%m-%d')
                end_dt = datetime.datetime.strptime(end_date, '%Y-%m-%d')
                old_cwd = os.getcwd()
                os.chdir(os.path.dirname(os.path.realpath(__file__)))
                r = read_csv('prices/gdax-daily-closing.csv')
                os.chdir(old_cwd)
                r['date'] = r['date'].apply(datestring_to_datetime)
                return r[(r['date'] >= start_dt) & (r['date'] < end_dt)]


if __name__ == '__main__':
        dg = DataGetter()
        print(dg.raw_articles('news_dot_bitcoin', '2017-08-11', '2017-08-28'))
