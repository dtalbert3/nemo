import json
import threading
import Queue
import MySQLdb
import MySQLdb.cursors
import time
import os

CONFIG = None
MAX_QUEUE_SIZE = 10
MAX_NUM_THREADS = 1
TIMEOUT = 5 # in seconds

HOST = None
USER = None
PASS = None
DB = None

semaphore = threading.BoundedSemaphore(MAX_NUM_THREADS)
queue = Queue.Queue()

def printConfig():
    global MAX_QUEUE_SIZE, MAX_NUM_THREADS, HOST, PASS, USER, DB
    print MAX_QUEUE_SIZE, MAX_NUM_THREADS, HOST, PASS, USER, DB

# Load CONFIG file for settings to be used during runtime
def loadConfig():
    global MAX_QUEUE_SIZE, MAX_NUM_THREADS, HOST, PASS, USER, DB, CONFIG
    global semaphore

    if os.path.isfile('aiConfig.json'):
        try:
            with open('aiConfig.json', 'r') as f:
                try:
                    NEW_CONFIG = json.load(f)
                except ValueError as e:
                    print "ValError" , e
                    return
        except EnvironmentError as e:
            print "EnvError" , e
            return
    else:
        print "aiconfig.json not found"
        return

    try:
            MAX_QUEUE_SIZE = NEW_CONFIG['MAX_QUEUE_SIZE']
            MAX_NUM_THREADS = NEW_CONFIG['MAX_NUM_THREADS']
            semaphore = threading.BoundedSemaphore(MAX_NUM_THREADS)

            # Set database config

            HOST = NEW_CONFIG['HOST']
            USER = NEW_CONFIG['USER']
            PASS = NEW_CONFIG['PASS']
            DB = NEW_CONFIG['DB']
            CONFIG = NEW_CONFIG
    except KeyError as e:
        print e
        print "Reverting to old config"

        if CONFIG != None:
            MAX_QUEUE_SIZE = CONFIG['MAX_QUEUE_SIZE']
            MAX_NUM_THREADS = CONFIG['MAX_NUM_THREADS']
            semaphore = threading.BoundedSemaphore(MAX_NUM_THREADS)

            # Set database config

            HOST = CONFIG['HOST']
            USER = CONFIG['USER']
            PASS = CONFIG['PASS']
            DB = CONFIG['DB']
        else:
            print "No previous config to restore to."

# Fetch questions to be worked on by their di
def fetchQuestions():
    global MAX_QUEUE_SIZE, HOST, PASS, USER, DB
    global queue
    # try:
    db = MySQLdb.connect(HOST, USER, PASS, DB)
    # except
    cursor = db.cursor()
    cursor.execute("SELECT ID FROM Question LIMIT " + str(MAX_QUEUE_SIZE))
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

    # Fetch config
    loadConfig()

    # Run indefinitely
    while True:
        while queue.empty():
            fetchQuestions()
        while not queue.empty():
            semaphore.acquire()
            t = threading.Thread(target=worker, args=(queue.get(), semaphore))
            t.start()

if  __name__ =='__main__':
    main()
