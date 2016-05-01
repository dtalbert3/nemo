#!/usr/bin/python
import threading
import Queue
import time
import sys
import zerorpc

# from nemoLogger import createLogger
from nemoApi import nemoApi
from nemoConfig import nemoConfig
import algorithmAnalyzer

API = None
CONFIG = None
QUEUE = None

dataLoad = False
finishedRun = True

class HelloRPC(object):
	def dataLoad(self, event):
		print "received a signal - " + event
		if event == "pendingDataLoad":
			print "inside pending"
			dataLoad = True
			return "pendingAck"
		elif event == "dataLoadDone":
			print "inside load done"
			dataLoad = False
			return "doneAck"
		elif event == "isAiDone":
			print "finished run:"
			print finishedRun
			if finishedRun == False:
				return "notReady"
			else:
				print "returning ready"
				return "ready"


def server():
    global dataLoad, finishedRun
    s = zerorpc.Server(HelloRPC())
    s.bind("tcp://0.0.0.0:4242")
    s.run()
	

# Create worker to process question
def worker(questionObj, s):
    global API, CONFIG, QUEUE

    id = questionObj['id']
    makePrediction = questionObj['makePrediction']
    # Set question status to running
    API.updateQuestionStatus(id, CONFIG.RUNNING_STATUS)

    # Determine which algorithm to use
    instance = algorithmAnalyzer.run(id)

    # Run algorithm if analyzer returned algorithm
    if instance is not None:

        # Run the algorithm
        try:
            success = instance.run()

            # Check if algorithm was successful
            if success:
                # Upload alogirthms results and feedback to datamart
                instance.uploadData()
        except:
            e = sys.exc_info()[0]
            API.updateQuestionStatus(id, CONFIG.QUEUED_STATUS)
            print e
            # Need to log exception
    predictionInstance = None
    if(makePrediction > 0):
        predictionInstance = algorithmAnalyzer.predict(id)
    if predictionInstance is not None:

        # Run the algorithm
        try:
            success = predictionInstance.run()

            # Check if algorithm was successful
            if success:
                # Upload alogirthms results and feedback to datamart
                predictionInstance.uploadPrediction()
        except:
            e = sys.exc_info()[0]
            API.updateQuestionStatus(id, CONFIG.QUEUED_STATUS)
            print e
            # Need to log exception
    # Set question status
    API.updateQuestionStatus(id, instance.status)

    # Release thread
    QUEUE.task_done()
    s.release()

def main():
    global API, CONFIG, QUEUE

    # Creating logger for logging to MAsterLog.log and console
    # logger = createLogger()

    # Load config file
    CONFIG = nemoConfig('config/dev.json')
    if CONFIG.CONFIG is None:
        print 'Could not load config file on . . .'
        return
		
    # Start zerorpc server for remote control
    t = threading.Thread(target=server)
    t.start()
    #c = zerorpc.Client()
    #c.connect("tcp://0.0.0.0:4242")


    # Set semaphore
    SEMAPHORE = threading.BoundedSemaphore(CONFIG.MAX_NUM_THREADS)

    # Instantiate api for use by sub modules
    API = nemoApi(CONFIG.HOST, CONFIG.PORT, CONFIG.USER, CONFIG.PASS, CONFIG.DB)

    QUEUE = Queue.Queue()
    # Run indefinitely
    while True:
			finishedRun = False
			RESULTS = API.fetchQuestions(CONFIG.MAX_QUEUE_SIZE, CONFIG.QUEUED_STATUS)
			for ROW in RESULTS:
			    QUEUE.put({'id': ROW['ID'], 'makePrediction':ROW['MakePrediction']})
			if QUEUE.empty():
			    time.sleep(CONFIG.TIMEOUT)
			else:
			    while not QUEUE.empty():
			        SEMAPHORE.acquire()
			        t = threading.Thread(target=worker, args=(QUEUE.get(), SEMAPHORE))
			        t.start()
			QUEUE.join()
			
			finishedRun = True
			
			while dataLoad:
				print "waiting"
#=======
#				RESULTS = API.fetchQuestions(CONFIG.MAX_QUEUE_SIZE, CONFIG.QUEUED_STATUS)
#        for ROW in RESULTS:
#            QUEUE.put({'id': ROW['ID'], 'makePrediction':ROW['MakePrediction']})
#        if QUEUE.empty():
#            time.sleep(CONFIG.TIMEOUT)
#        else:
#            while not QUEUE.empty():
#                SEMAPHORE.acquire()
#                t = threading.Thread(target=worker, args=(QUEUE.get(), SEMAPHORE))
#                t.start()
#        QUEUE.join()
#>>>>>>> 5eb9239c59a993714072f7a7f6337f1743b0e757


if  __name__ =='__main__':
    main()
