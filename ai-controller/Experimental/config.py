import json
import os

def validate(config):
    try:
        # Validate CONTROLLER
        CONTROLLER = config['CONTROLLER']
        MAX_QUEUE_SIZE = CONTROLLER['MAX_QUEUE_SIZE']
        MAX_NUM_THREADS = CONTROLLER['MAX_NUM_THREADS']

        # Validate DATABASE
        DATABASE = config['DATABASE']
        HOST = DATABASE['HOST']
        USER = DATABASE['USER']
        PASS = DATABASE['PASS']
        DB = DATABASE['DB']
        QUEUED_STATUS = DATABASE['QUEUED_STATUS']
        RUNNING_STATUS =  DATABASE['RUNNING_STATUS']
        AWAITING_FEEDBACK_STATUS =  DATABASE['AWAITING_FEEDBACK_STATUS']

        # Validate ALGORITHMS
        ALGORITHMS = config['ALGORITHMS']

        RandomForest = ALGORITHMS['RandomForest']
        Active = RandomForest['Active']
        CVDefault = RandomForest['CVDefault']

        SVM = ALGORITHMS['SVM']
        Active = SVM['Active']
        CVDefault = SVM['CVDefault']

        NaiveBayes = ALGORITHMS['NaiveBayes']
        Active = NaiveBayes['Active']
        CVDefault = NaiveBayes['CVDefault']
        return True
    except KeyError as e:
        print 'Invalid config file, ', e
        return False

def load(file):
    config = None
    if os.path.isfile(file):
        try:
            with open(file, 'r') as f:
                try:
                    config = json.load(f)
                except ValueError as e:
                    print "ValError" , e
                    return config
        except EnvironmentError as e:
            print "EnvError" , e
            return config
    else:
        print "aiconfig.json not found"
        return config
    return config
