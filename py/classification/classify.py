import pandas as pd
class Classifier:
    def __init__(self):
        from data.get import DataGetter
        self.dg = DataGetter()
    def classify_raw_articles(self, source, model, start_date, end_date):
        from pickle import load
        import os
        article_df = self.dg.raw_articles(source, start_date, end_date)
        dir = os.path.dirname(os.path.realpath(__file__))
        model_path = dir + '/models/saved/{}.pkl'.format(model)
        m = load(open(model_path, 'rb'))
        labels = m.predict

if __name__ == '__main__':
    classifier = Classifier()
    classifier.classify_raw_articles('twitter', 'headline_posneg', '2017-01-01', '2017-01-05')


