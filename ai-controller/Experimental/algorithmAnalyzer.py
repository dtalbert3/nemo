import MySQLdb
import MySQLdb.cursors
import random

CONFIG = None

def updateQuestionStatus(id, status):
    global CONFIG
    DATABASE = CONFIG['DATABASE']
    db = MySQLdb.connect(DATABASE['HOST'], DATABASE['USER'], DATABASE['PASS'], DATABASE['DB'])
    cursor = db.cursor()
    cursor.execute(
        "UPDATE Question " +
        "SET StatusID = " + str(status) + " "
        "WHERE ID = " + str(id))
    db.commit()

def fetchInfo(id):
    global CONFIG
    DATABASE = CONFIG['DATABASE']
    db = MySQLdb.connect(DATABASE['HOST'], DATABASE['USER'], DATABASE['PASS'], DATABASE['DB'])
    cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute(
        "SELECT ID, Accuracy, AIFeedback, PredictionFeedback, Algorithm " +
        "FROM AIModel " +
        "WHERE QuestionID = " + str(id) + " " +
        "ORDER BY DateModified DESC " +
        "LIMIT 1")
    return cursor.fetchone()

# def defaultCVParams(id):

def run(id, config):
    global CONFIG
    CONFIG = config

    info = fetchInfo(id)
    algorithm = None
    params = None
    options = None
    if info is None:
        algorithms = {k: v for k, v in CONFIG['ALGORITHMS'].iteritems() if v['Active'] is True}
        algorithm = random.choice(algorithms.keys())
    else:
        algorithm = info['Algorithm']

    # if alg == 'RandomForest':
        # Run wrapper
    # elif alg == 'SVM':
        # Run wrapper
    # elif alg == 'NaiveBayes':
        # Run wrapper
    # updateQuestionStatus(id, config['DATABASE']['RUNNING_STATUS'])
