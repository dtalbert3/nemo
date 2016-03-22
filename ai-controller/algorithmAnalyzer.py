import random

from nemoApi import nemoApi
from nemoApi import AIParam
from nemoConfig import nemoConfig
from wekaWrapper import WekaWrapper

def run(id):
    api = nemoApi()
    config = nemoConfig()

    # Fetch question info
    info = api.fetchQuestionInfo(id)

    # Declare vars to collect
    algorithm = None
    parameters = []
    options = None

    # Determine which algorithm to use based on feedback
    print "Running algorithm analyzer on QuestionID " + str(id)
    if info is None:
        # If this is the first time running, choose one at random
        print "Picking algorithm for the first time"
        algorithms = {k: v for k, v in config.ALGORITHMS.iteritems() if v['Active'] is True}
        algorithm = random.choice(algorithms.keys())
    else:
        # Need to check if algorithm picked is currently active in config file
        # IF we need to switch algs based on info of ai model
        if info['AIFeedback'] == '\x01': #If AIFeedback is true
            print "AIFeedback is true"
            algorithm = info['Algorithm']
        else:
            print info['AIFeedback']
            print "AIFeedback is false, picking new algorithm"
            algorithms = {k: v for k, v in config.ALGORITHMS.iteritems() if v['Active'] is True and k != info['Algorithm']}
            algorithm = random.choice(algorithms.keys())
            print "Algorithm chosen: " + algorithm
    # Get parameters
    latestAIModel = api.fetchLatestAIModelByAlgorithm(id, algorithm)
    modelParams = []
    modelParamsToSave = []
    if latestAIModel is not None:
        modelID = latestAIModel['ID']
        modelParams = api.fetchAIModelParams(modelID)
        print "Model ID " + str(modelID)
        print modelParams
    # else:



    # Pick an optimizer
    optimizers = {k: v for k, v in config.ALGORITHMS[algorithm]['Optimizers'].iteritems()}
    optimizer = random.choice(optimizers.keys())
    print optimizer

    # Pick a parameter from that optimizer
    tweaks = {k: v for k, v in config.ALGORITHMS[algorithm]['Optimizers'][optimizer].iteritems()}
    tweak = random.choice(tweaks.keys())

    tweakParam = config.ALGORITHMS[algorithm]['Optimizers'][optimizer][tweak]['param']
    tweakValue = config.ALGORITHMS[algorithm]['Optimizers'][optimizer][tweak]['value']

    print "Tweak param " + str(tweakParam)
    print "Tweak value " + str(tweakValue)

    newParam = AIParam(None, tweakParam, tweakValue, optimizer)
    # Add this param only if it isn't already added
    existingParam = next((x for x in modelParams if x.Param == newParam.Param and x.param_use == newParam.param_use), None)
    if existingParam is None:
        modelParams.append(newParam)

    # If we are using options, only pass options to classifier
    if optimizer == 'DefaultOptions':
        for mParam in modelParams:
            # I think this part is wrong, the truthiness of the downloaded from DB Optional Params I was unable to figure out
            # PLEASE FIX
            if mParam.param_use == 'DefaultOptions' and (mParam.Value == True or mParam.Value == 1 or mParam.Value == "1"):
                modelParamsToSave.append(mParam)
                parameters = parameters + [mParam.Param]

    # If we are using cvparams, only pass cvparams to classifier
    elif optimizer == 'DefaultCVParams':
        for mParam in modelParams:
            if mParam.param_use == 'DefaultCVParams' and mParam.Value is not None:
                modelParamsToSave.append(mParam)
                parameters = parameters + ["-P", (mParam.Param + ' ' + mParam.Value)]


    # TODO: Next iteration, maybe?
    # Get options


    # Run
    instance = None
    if optimizer == 'DefaultOptions':
        if algorithm == "SMO":
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.functions.SMO', parameters, modelParamsToSave)
        elif algorithm == "RandomForest":
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.trees.RandomForest', parameters, modelParamsToSave)
        elif algorithm == "NaiveBayes":
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.bayes.NaiveBayes', parameters, modelParamsToSave)
        elif algorithm == "J48": # TODO: J48 THREADS WILL CRASH
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.trees.J48', parameters, modelParamsToSave)
    elif optimizer == 'DefaultCVParams':
        if algorithm == "SMO":
            parameters = parameters + ["-W", "weka.classifiers.functions.SMO"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave)
        elif algorithm == "RandomForest":
            parameters = parameters + ["-W", "weka.classifiers.trees.RandomForest"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave)
        elif algorithm == "NaiveBayes":
            parameters = parameters + ["-W", "weka.classifiers.bayes.NaiveBayes"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave)
        elif algorithm == "J48": # TODO: J48 THREADS WILL CRASH
            parameters = parameters + ["-W", "weka.classifiers.trees.J48"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave)

    return instance
