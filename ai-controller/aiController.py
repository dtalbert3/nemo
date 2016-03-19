#!/usr/bin/python

import threading
import Queue
import time

from nemoApi import nemoApi
from nemoConfig import nemoConfig
import algorithmAnalyzer

# Create worker to process question
def worker(id, s):
    algorithmAnalyzer.run(id)
    s.release()

def main():

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
                t = threading.Thread(target=worker, args=(QUEUE.get(), SEMAPHORE))
                t.start()

if  __name__ =='__main__':
    main()
