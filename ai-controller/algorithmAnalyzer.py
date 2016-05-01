import random

from nemoApi import nemoApi
from nemoApi import AIParam
from nemoConfig import nemoConfig
from wekaWrapper import WekaWrapper

def run(id, optimizer, algorithm):
    api = nemoApi()
    config = nemoConfig()

    # Fetch question info
    info = api.fetchQuestionInfo(id)

    # Declare vars to collect
    parameters = []
    options = None
    tweak = None
    tweakParam = None
    tweakValue = None

    # Determine which algorithm to use based on feedback
    print "Running algorithm analyzer on QuestionID " + str(id)
    if algorithm is None:
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

    # Pick an optimizer if none was passed
    if optimizer is None:
        optimizers = {k: v for k, v in config.ALGORITHMS[algorithm]['Optimizers'].iteritems()}
        if len(optimizers) > 0:
            optimizer = random.choice(optimizers.keys())
    print 'Optimizer chosen: ' + optimizer

    # Pick a parameter from that optimizer
    tweaks = {k: v for k, v in config.ALGORITHMS[algorithm]['Optimizers'][optimizer].iteritems()}
    if len(tweaks) > 0:
        tweak = random.choice(tweaks.keys())

    if tweak is not None:
        tweakParam = config.ALGORITHMS[algorithm]['Optimizers'][optimizer][tweak]['param']
        tweakValue = config.ALGORITHMS[algorithm]['Optimizers'][optimizer][tweak]['value']

    print "Tweak param " + str(tweakParam)
    print "Tweak value " + str(tweakValue)

    newParam = AIParam(None, tweakParam, tweakValue, optimizer)
    # Add this param only if it isn't already added
    existingParam = next((x for x in modelParams if x.Param == newParam.Param and x.param_use == newParam.param_use), None)
    if existingParam is None and tweakParam is not None and tweakValue is not None:
        modelParams.append(newParam)

    # If we are using options, only pass options to classifier
    if optimizer == 'Options':
        for mParam in modelParams:
            # I think this part is wrong, the truthiness of the downloaded from DB Optional Params I was unable to figure out
            # PLEASE FIX
            if mParam.param_use == 'Options' and (mParam.Value == True or mParam.Value == 1 or mParam.Value == "1"):
                modelParamsToSave.append(mParam)
                parameters = parameters + [mParam.Param]

    # If we are using cvparams, only pass cvparams to classifier
    elif optimizer == 'CVParams':
        for mParam in modelParams:
            if mParam.param_use == 'CVParams' and mParam.Value is not None:
                modelParamsToSave.append(mParam)
                parameters = parameters + ["-P", (mParam.Param + ' ' + mParam.Value)]

    # If we are using ensemble, only pass ensemble params to classifier
    elif optimizer == 'Ensemble':
        for mParam in modelParams:
            if mParam.param_use == 'Ensemble' and mParam.Value is not None:
                modelParamsToSave.append(mParam)
                parameters = parameters + [mParam.Param, mParam.Value]

    # Run
    instance = None
    if optimizer == 'Options':
        if algorithm == "SMO":
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.functions.SMO', parameters, modelParamsToSave, optimizer)
        elif algorithm == "RandomForest":
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.trees.RandomForest', parameters, modelParamsToSave, optimizer)
        elif algorithm == "NaiveBayes":
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.bayes.NaiveBayes', parameters, modelParamsToSave, optimizer)
        elif algorithm == "J48":
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.trees.J48', parameters, modelParamsToSave, optimizer)
        elif algorithm == "Perceptron":
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.functions.MultilayerPerceptron', parameters, modelParamsToSave, optimizer)
    elif optimizer == 'CVParams':
        if algorithm == "SMO":
            parameters = parameters + ["-W", "weka.classifiers.functions.SMO"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer)
        elif algorithm == "RandomForest":
            parameters = parameters + ["-W", "weka.classifiers.trees.RandomForest"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer)
        elif algorithm == "NaiveBayes":
            parameters = parameters + ["-W", "weka.classifiers.bayes.NaiveBayes"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer)
        elif algorithm == "J48":
            parameters = parameters + ["-W", "weka.classifiers.trees.J48"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer)
        elif algorithm == "Perceptron":
            parameters = parameters + ["-W", "weka.classifiers.functions.MultilayerPerceptron"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer)
    elif optimizer == 'FeatureSelection':
        if algorithm == "SMO":
            parameters = parameters + ["-W", "weka.classifiers.functions.SMO", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer)
        elif algorithm == "RandomForest":
            parameters = parameters + ["-W", "weka.classifiers.trees.RandomForest", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer)
        elif algorithm == "NaiveBayes":
            parameters = parameters + ["-W", "weka.classifiers.bayes.NaiveBayes", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer)
        elif algorithm == "J48":
            parameters = parameters + ["-W", "weka.classifiers.trees.J48", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer)
        elif algorithm == "Perceptron":
            parameters = parameters + ["-W", "weka.classifiers.functions.MultilayerPerceptron", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer)
    elif optimizer == 'Ensemble':
        if algorithm == "SMO":
            parameters = parameters + ["-B", "weka.classifiers.functions.SMO"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer)
        elif algorithm == "RandomForest":
            parameters = parameters + ["-B", "weka.classifiers.trees.RandomForest"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer)
        elif algorithm == "NaiveBayes":
            parameters = parameters + ["-B", "weka.classifiers.bayes.NaiveBayes"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer)
        elif algorithm == "J48":
            parameters = parameters + ["-B", "weka.classifiers.trees.J48"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer)
        elif algorithm == "Perceptron":
            parameters = parameters + ["-B", "weka.classifiers.functions.MultilayerPerceptron"]
            instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer)
    return instance

def predict(id):

    print "Running prediction on QuestionID " + str(id)

    api = nemoApi()
    config = nemoConfig()

    # Fetch question info
    info = api.fetchQuestionInfo(id)

    # Declare vars to collect
    algorithm = None
    parameters = []
    options = None
    optimizer = None

    # Get parameters
    latestAIModel = api.fetchBestAIModelByQuestion(id)
    modelParams = []
    modelParamsToSave = []
    if latestAIModel is not None:
        modelID = latestAIModel['ID']
        modelParams = api.fetchAIModelParams(modelID)
        print "Model ID " + str(modelID)
        print modelParams

        algorithm = latestAIModel['Algorithm']
        optimizer = latestAIModel['Optimizer']

        # If we are using options, only pass options to classifier
        if optimizer == 'Options':
            for mParam in modelParams:
                # I think this part is wrong, the truthiness of the downloaded from DB Optional Params I was unable to figure out
                # PLEASE FIX
                if mParam.param_use == 'Options' and (mParam.Value == True or mParam.Value == 1 or mParam.Value == "1"):
                    modelParamsToSave.append(mParam)
                    parameters = parameters + [mParam.Param]

        # If we are using cvparams, only pass cvparams to classifier
        elif optimizer == 'CVParams':
            for mParam in modelParams:
                if mParam.param_use == 'CVParams' and mParam.Value is not None:
                    modelParamsToSave.append(mParam)
                    parameters = parameters + ["-P", (mParam.Param + ' ' + mParam.Value)]

        # If we are using ensemble, only pass ensemble params to classifier
        elif optimizer == 'Ensemble':
            for mParam in modelParams:
                if mParam.param_use == 'Ensemble' and mParam.Value is not None:
                    modelParamsToSave.append(mParam)
                    parameters = parameters + [mParam.Param, mParam.Value]

        # Run
        instance = None
        if optimizer == 'Options':
            if algorithm == "SMO":
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.functions.SMO', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "RandomForest":
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.trees.RandomForest', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "NaiveBayes":
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.bayes.NaiveBayes', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "J48":
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.trees.J48', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "Perceptron":
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.functions.MultilayerPerceptron', parameters, modelParamsToSave, optimizer, predict=1)
        elif optimizer == 'CVParams':
            if algorithm == "SMO":
                parameters = parameters + ["-W", "weka.classifiers.functions.SMO"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "RandomForest":
                parameters = parameters + ["-W", "weka.classifiers.trees.RandomForest"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "NaiveBayes":
                parameters = parameters + ["-W", "weka.classifiers.bayes.NaiveBayes"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "J48":
                parameters = parameters + ["-W", "weka.classifiers.trees.J48"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "Perceptron":
                parameters = parameters + ["-W", "weka.classifiers.functions.MultilayerPerceptron"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.CVParameterSelection', parameters, modelParamsToSave, optimizer, predict=1)
        elif optimizer == 'FeatureSelection':
            if algorithm == "SMO":
                parameters = parameters + ["-W", "weka.classifiers.functions.SMO", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "RandomForest":
                parameters = parameters + ["-W", "weka.classifiers.trees.RandomForest", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "NaiveBayes":
                parameters = parameters + ["-W", "weka.classifiers.bayes.NaiveBayes", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "J48":
                parameters = parameters + ["-W", "weka.classifiers.trees.J48", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "Perceptron":
                parameters = parameters + ["-W", "weka.classifiers.functions.MultilayerPerceptron", "-E", "weka.attributeSelection.CfsSubsetEval -M", "-S", "weka.attributeSelection.BestFirst -D 1 -N 5"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.AttributeSelectedClassifier', parameters, modelParamsToSave, optimizer, predict=1)
        elif optimizer == 'Ensemble':
            if algorithm == "SMO":
                parameters = parameters + ["-B", "weka.classifiers.functions.SMO"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "RandomForest":
                parameters = parameters + ["-B", "weka.classifiers.trees.RandomForest"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "NaiveBayes":
                parameters = parameters + ["-B", "weka.classifiers.bayes.NaiveBayes"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "J48":
                parameters = parameters + ["-B", "weka.classifiers.trees.J48"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer, predict=1)
            elif algorithm == "Perceptron":
                parameters = parameters + ["-B", "weka.classifiers.functions.MultilayerPerceptron"]
                instance = WekaWrapper(id, algorithm, 'weka.classifiers.meta.Stacking', parameters, modelParamsToSave, optimizer, predict=1)
        return instance
    else:
        return None
