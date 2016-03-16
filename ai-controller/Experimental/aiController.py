import json
import threading
import Queue
import MySQLdb
import MySQLdb.cursors
import time
import config

CONFIG = None

# Load CONFIG file for settings to be used during runtime
def loadConfig(semaphore):
    global CONFIG

    NEW_CONFIG = config.load('aiConfig.json')

    if config.validate(NEW_CONFIG):
        CONFIG = NEW_CONFIG
        CONTROLLER = CONFIG['CONTROLLER']
        semaphore = threading.BoundedSemaphore(CONTROLLER['MAX_NUM_THREADS'])

# Fetch questions to be worked on by their di
def fetchQuestions(queue):
    global CONFIG
    DATABASE = CONFIG['DATABASE']
    CONTROLLER = CONFIG['CONTROLLER']
    db = MySQLdb.connect(DATABASE['HOST'], DATABASE['USER'], DATABASE['PASS'], DATABASE['DB'])
    cursor = db.cursor()
    cursor.execute(
        "SELECT ID " +
        "FROM Question " +
        "WHERE StatusID = " + str(DATABASE['QUEUED_STATUS']) + " " +
        "ORDER BY DateModified DESC " +
        "LIMIT " + str(CONTROLLER['MAX_QUEUE_SIZE']))
    results = cursor.fetchall()
    for row in results:
        queue.put(row[0])
    db.close()

# Create worker to process question
def worker(id, semaphore):
    time.sleep(2)
    print 'hello', id
    semaphore.release()

def main():
    global CONFIG

    semaphore = threading.BoundedSemaphore(1)
    # Fetch config
    loadConfig(semaphore)
    if CONFIG is None:
        print 'Could not load config file on . . .'

    queue = Queue.Queue()
    # Run indefinitely
    while True:
        while queue.empty():
            fetchQuestions(queue)
        while not queue.empty():
            semaphore.acquire()
            t = threading.Thread(target=worker, args=(queue.get(), semaphore))
            t.start()

if  __name__ =='__main__':
    main()
