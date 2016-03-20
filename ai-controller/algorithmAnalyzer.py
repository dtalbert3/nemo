import random

from nemoApi import nemoApi
from nemoConfig import nemoConfig
from wekaWrapper import WekaWrapper

def run(id):
    api = nemoApi()
    config = nemoConfig()

    # Set question status running
    # api.updateQuestionStatus(id, config.RUNNING_STATUS)

    # Fetch question info
    info = api.fetchQuestionInfo(id)

    # Declare vars to collect
    algorithm = None
    parameters = None
    options = None

    # Determine which algorithm to use
    if info is None:
        # If this is the first time running, choose one at random
        algorithms = {k: v for k, v in config.ALGORITHMS.iteritems() if v['Active'] is True}
        algorithm = random.choice(algorithms.keys())
    else:
        # Need to check if algorithm picked is currently active in config file
        # IF we need to swtich algs based on info of ai model
        algorithm = info['Algorithm']

    # Get parameters


    # TODO: Next iteration, maybe?
    # Get options

    # Run
    instance = None
    if algorithm == "SMO":
        instance = WekaWrapper(id, algorithm, 'weka.classifiers.functions.SMO', parameters)
    elif algorithm == "RandomForest":
        instance = WekaWrapper(id, algorithm, 'weka.classifiers.trees.RandomForest', parameters)
    elif algorithm == "NaiveBayes":
        instance = WekaWrapper(id, algorithm, 'weka.classifiers.bayes.NaiveBayes', parameters)
    elif algorithm == "J48": # TODO: J48 THREADS WILL CRASH
        instance = WekaWrapper(id, algorithm, 'weka.classifiers.trees.J48', parameters)

    return instance
