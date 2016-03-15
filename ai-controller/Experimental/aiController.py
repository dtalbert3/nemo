import json
import threading
import Queue
import MySQLdb
import MySQLdb.cursors
import time

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

# Load config file for settings to be used during runtime
def loadConfig():
    # Add error handling
    try:
        with open('aiConfig.json', 'r') as f:
            config = json.load(f)

            # Get globals
            global MAX_QUEUE_SIZE, MAX_NUM_THREADS, HOST, PASS, USER, DB
            global semaphore

            # Set ai controller parameters
            MAX_QUEUE_SIZE = config['MAX_QUEUE_SIZE']
            MAX_NUM_THREADS = config['MAX_NUM_THREADS']
            semaphore = threading.BoundedSemaphore(MAX_NUM_THREADS)

            # Set database config
            HOST = config['HOST']
            USER = config['USER']
            PASS = config['PASS']
            DB = config['DB']
    except EnvironmentError as e:
        print e
    else:
        'Loaded config file'
# Fetch questions to be worked on by their di
def fetchQuestions():
    global MAX_QUEUE_SIZE, HOST, PASS, USER, DB
    global queue
    db = MySQLdb.connect(HOST, USER, PASS, DB)
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
