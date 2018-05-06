def posneg_model():
    from pickle import load
    import os
    old_cwd = os.getcwd()
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    r = load(open('saved/headline_posneg.pkl', 'rb'))
    os.chdir(old_cwd)
    return r

def neutrality_model():
    from pickle import load
    import os
    old_cwd = os.getcwd()
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    r = load(open('saved/headline_neutrality.pkl', 'rb'))
    os.chdir(old_cwd)
    return r
