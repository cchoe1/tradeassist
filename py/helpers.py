def is_not_nan(e):
    from numpy import isnan
    return not isnan(e)

def non_negative_to_one(e):
    if e < 0:
        return e
    else:
        return 1

def negative_to_zero(e):
    if e < 0:
        return 0
    else:
        return e

def minus_one_to_zero(e):
    if e == -1:
        return 0
    else:
        return e

def datestring_to_datetime(date_string):
    import datetime
    return datetime.datetime.strptime(date_string[:10], '%Y-%m-%d')

