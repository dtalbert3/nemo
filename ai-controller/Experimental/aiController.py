import json
import threading
import Queue
import MySQLdb
import MySQLdb.cursors
import time

import config
import algorithmAnalyzer

CONFIG = None
SEMAPHORE = None

# Load config file for settings to be used during runtime
def loadConfig():
    global CONFIG, SEMAPHORE

    NEW_CONFIG = config.load('aiConfig.json')

    if config.validate(NEW_CONFIG):
        CONFIG = NEW_CONFIG
        CONTROLLER = CONFIG['CONTROLLER']
        SEMAPHORE = threading.BoundedSemaphore(CONTROLLER['MAX_NUM_THREADS'])

# Fetch questions to be worked on by their di
def fetchQuestions(queue):
    global CONFIG
    DATABASE = CONFIG['DATABASE']
    CONTROLLER = CONFIG['CONTROLLER']
    db = MySQLdb.connect(DATABASE['HOST'], DATABASE['USER'], DATABASE['PASS'], DATABASE['DB'])
    cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute(
        "SELECT ID " +
        "FROM Question " +
        # "WHERE StatusID = " + str(DATABASE['QUEUED_STATUS']) + " " +
        "ORDER BY DateModified DESC " +
        "LIMIT " + str(CONTROLLER['MAX_QUEUE_SIZE']))
    results = cursor.fetchall()
    for row in results:
        queue.put(row['ID'])
    db.close()

# Create worker to process question
def worker(id, SEMAPHORE):
    global CONFIG
    algorithmAnalyzer.run(id, CONFIG)
    SEMAPHORE.release()

def main():
    global CONFIG, SEMAPHORE

    SEMAPHORE = threading.BoundedSemaphore(1)
    # Fetch config
    loadConfig()
    if CONFIG is None:
        print 'Could not load config file on . . .'

    queue = Queue.Queue()
    # Run indefinitely
    while True:
        fetchQuestions(queue)
        if queue.empty():
            time.sleep(CONFIG['CONTROLLER']['TIMEOUT'])
        else:
            while not queue.empty():
                SEMAPHORE.acquire()
                t = threading.Thread(target=worker, args=(queue.get(), SEMAPHORE))
                t.start()

if  __name__ =='__main__':
    main()
