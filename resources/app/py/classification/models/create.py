import os

from data.get import DataGetter

MLP_PARAMS = {'epsilon': 1e-9, 'beta_2': .999, 'alpha': 0.0001, 'tol': .0001, 'beta_1': 0.9,
                      'hidden_layer_sizes': (10, 10)}

class ModelMaker:
    def _best_model(self, x, y, untrained_model):
        '''
        Initiates a loop that train and tests a model then outputs it's performance metrics. The user can whether to continue training
        and testing new models until a model with desired performance is created.
        :param x: Feature data. Inputs for the model.
        :param y: Target data. Outputs for the model.
        :param untrained_model: Any sklearn regression algorithm.
        :return: Returns the model that the user selects.
        '''
        from sklearn.model_selection import train_test_split
        from copy import copy
        from sklearn.metrics import classification_report
        x_train, x_test, y_train, y_test = train_test_split(x, y)
        i = ''
        while i == '':
            m = copy(untrained_model)
            m.fit(x_train, y_train)
            pred = m.predict(x_test)
            print(classification_report(y_test, pred))
            i = input('Press enter to try next model. Type anything and then press enter to save model.')
        return m

    def create_posneg_google_headline_model(self, save_path):
        '''
        Creates and saves a model for labeling headlines as positive or negative. The model is saved in models/saved
        and named the passed in save_path.
        :param save_path: Name for file to save.
        :return:
        '''
        old_cwd = os.getcwd()
        dg = DataGetter()
        x, y = dg.training_google_headlines()
        from sklearn.neural_network import MLPClassifier
        model = MLPClassifier(**MLP_PARAMS)
        from pickle import dump
        os.chdir(os.path.dirname(os.path.realpath(__file__)))
        dump(self._best_model(x, y, model), open(save_path, 'wb+'))
        os.chdir(old_cwd)

    def create_neutrality_google_headline_model(self, save_path):
        old_cwd = os.getcwd()
        dg = DataGetter(pos_vs_neg=False)
        x, y = dg.training_google_headlines()
        from sklearn.neural_network import MLPClassifier
        model = MLPClassifier(**MLP_PARAMS)
        from pickle import dump
        os.chdir(os.path.dirname(os.path.realpath(__file__)))
        dump(self._best_model(x, y, model), open(save_path, 'wb+'))
        os.chdir(old_cwd)

def make_google_posneg():
    mm = ModelMaker()
    mm.create_posneg_google_headline_model('saved/headline_posneg.pkl')
    
def make_google_neutral():
    mm = ModelMaker()
    mm.create_neutrality_google_headline_model('saved/headline_neutrality.pkl')

