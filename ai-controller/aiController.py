#!/usr/bin/python
import threading
import Queue
import time

from nemoLogger import createLogger
from nemoApi import nemoApi
from nemoConfig import nemoConfig
import algorithmAnalyzer

API = None
CONFIG = None

# Create worker to process question
def worker(id, s):
    global API, CONFIG

    # Set question status to running
    API.updateQuestionStatus(id, CONFIG.RUNNING_STATUS)

    # Determine which alogirthm to use
    instance = algorithmAnalyzer.run(id)

    # Run algorithm if analyzer returned algorithm
    if instance is not None:

        # Run the algorithm
        success = instance.run()

        # Check if algorithm was successful
        if success:
            # Upload alogirthms results and feedback to datamart
            instance.uploadData()

    # Set question status
    API.updateQuestionStatus(id, instance.status)

    # Release thread
    s.release()

def main():
    global API, CONFIG

    # Creating logger for logging to MAsterLog.log and console
    logger = createLogger()

    # Load config file
    CONFIG = nemoConfig('config/nemoConfig.json')
    if CONFIG.CONFIG is None:
        print 'Could not load config file on . . .'
        return

    # Set semaphore
    SEMAPHORE = threading.BoundedSemaphore(CONFIG.MAX_NUM_THREADS)

    # Instantiate api for use by sub modules
    API = nemoApi(CONFIG.HOST, CONFIG.PORT, CONFIG.USER, CONFIG.PASS, CONFIG.DB)

    QUEUE = Queue.Queue()
    # Run indefinitely
    while True:
        RESULTS = API.fetchQuestions(CONFIG.MAX_QUEUE_SIZE, CONFIG.QUEUED_STATUS)
        for ROW in RESULTS:
            QUEUE.put(ROW['ID'])
        if QUEUE.empty():
            time.sleep(CONFIG.TIMEOUT)
        else:
            while not QUEUE.empty():
                SEMAPHORE.acquire()
                t = threading.Thread(target=`worker`, args=(QUEUE.get(), SEMAPHORE))
                t.start()


if  __name__ =='__main__':
    main()
