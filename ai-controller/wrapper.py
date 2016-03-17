#!/usr/bin/python
#import ....

from weka.classifiers import Classifier, Evaluation
from weka.core.classes import Random
from weka.datagenerators import DataGenerator
from weka.core.database import InstanceQuery
from weka.classifiers.meta import CVParameterSelection
import weka.core.serialization as serialization
import weka.core.jvm as jvm
import queryBuilder
import MySQLdb
import MySQLdb.cursors
import config

class Wrapper:
	
	def __init__(self, qID, cType, params):
		self.questionID = qID
		self.classifierType = cType
		self.parameters = params
		readLoginFile()


	def readLoginFile():
		file_name = "NEMO_login.text"
		nemo_login = open(file_name,'r')
		self.host = nemo_login.readline()
		self.user = nemo_login.readline()
		self.password = nemo_login.readline()
		self.database = nemo_login.readline()

		self._host = nemo_login.readline()
	
	def retrieveLearnerData():
		learnerQuery = queryBuilder.getDataQuery(datamart_host, datamart_host, datamart_pass, datamart_database, questionID, "learner")
		iquery = InstanceQuery()
		iquery.db_url = _host
		iquery.user = user
		iquery.password = password
		iquery.query = learnerQuery
		learnerData = iquery.retrieve_instances()
		learnerData.class_is_last()
		return learnerData
	
	def retrieveTestData():
		testQuery = queryBuilder.getDataQuery(datamart_host, datamart_host, datamart_pass, datamart_database, questionID, "test")
		iquery = InstanceQuery()
		iquery.db_url = _host
		iquery.user = user
		iquery.password = password
		iquery.query = testQuery
		testData = iquery.retrieve_instances()
		testData.class_is_last()
		return testData
	
	
	def run():
		jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])	
		learnerData = retrieveLearnerData()
#Naive Bayes
#SMO SVM
#Random Forest
		
		if classifierType == "SMO":
			#create smo
			cls = Classifier(classname="weka.classifiers.functions.SMO", options=parameters)

		else if classifierType == "RandomForest":
			#create random forest
			cls = Classifier(classname="weka.classifiers.trees.RandoForest", options=parameters)

		else if classifierType == "NaiveBayes":
			#create naive bayes
			cls = Classifier(classname="weka.classifiers.bayes.NaiveBayes", options=parameters)

		else:
			#Error: unrecognized classifier type
		
		# TODO: Do we need to update the status of the question status to
		# display "running"? How long with the training take?


		cls.build_classifier(learnerData)
		for index, inst in enumerate(learnerData):
    	pred = cls.classify_instance(inst)
    	dist = cls.distribution_for_instance(inst)
		
		#test classifier to determine accuracy
		
		testData = retrieveTestData()
		clsTest = Evaluation(testData)
		clsTest.evaluateModel(cls, testData)
		summary = clsTest.toSummaryString()
		#accuracy = some way of getting accuracy out of summary?


		outFile = str(questionID) + ".model"
		serialization.write(outFile, cls)
		thedata = open(outFile, 'rb').read()
		
		# Need to insert the rest of the values into the table as well. 
		# will use questionID, classifierType, accuracy
		sql = "INSERT INTO `NEMO_Datamart`.`AIModel`(`QuestionID`,`AI`, 'AIAlgorithm', 'Accuracy') VALUES (%(id)d, %(blob)s, %(alg)s, %(acc)f);"% {"id": questionID, "blob": theData, "alg": classifierType, "acc": accuracy}
		
		# Open database connection
		db = MySQLdb.connect(host, user, password, database)
		
		# prepare a cursor object using cursor() method, user a dictionary so we can use SQL attribute names as opposed to numbered indices
		cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
		cursor.execute("SELECT VERSION()")
		
		# Fetch a single row using fetchone() method.
		data = cursor.fetchone()
		cursor.execute(sql)
		db.commit()

		# Remember to delete the blob file after it has been sent to the database

		#Create sql statement to update the question table to display "Awaiting user feedback"
		sql = "UPDATE 'NEMO_Datamart'.'Question' SET (statusID=2) WHERE questionID=%(id)d" % {"id":questionID}
		
		cursor.execute(sql)
		db.commit()


		## Recover the data so you can check back
		#sql = "SELECT AI FROM `NEMO_Datamart`.`AIModel` WHERE QuestionID = 123"
		#cursor.execute(sql)
		#data = cursor.fetchone()
		## print data['AI']
		##print "\n\n\n"
		#fo = open("foo.txt", "wb")
		#fo.write(data['AI'])
		#fo.close()
		#objects = serialization.read_all("foo.txt")
		#classifier2 = Classifier(jobject=objects[0])
		#evaluation = Evaluation(learnerData)                     # initialize with priors
		#evaluation.crossvalidate_model(classifier2, learnerData, 10, Random(42))  # 10-fold CV
		#print(evaluation.summary())
		#print("pctCorrect: " + str(evaluation.percent_correct))
		#print("incorrect: " + str(evaluation.incorrect))
		
		jvm.stop()

		# run some parameter optimization

		#paramSel = CVParameterSelection(smo)
		#paramOpt.setOptions(["-W", "SVM"])
		#paramSel.setNumFolds(5)
		#paramSel.buildClassifier(learnerData)
		#params = paramSel.getBestClassifierOptions()
		
		

	#the run function will be different for each function.
	# it will be implemented by each subclass
	#def run():
		
		# for parameter optimization, refer to http://weka.sourceforge.net/doc.stable/
		# set the -W option followed by the full name of the classifier to set the base classifier.
		# each wrapper will set a different base class


#class SMOWrapper(Wrapper)
#	
#	def __init__(self, qID):
#		readLoginFile()
#		self.questionID = qID
#		self.params = ""
#	
#	def run():
#		jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])	
#		learnerData = retrieveData()
#		# run some parameter optimization
#
#		smo = SMO()
#		paramSel = CVParameterSelection(smo)
#		#paramOpt.setOptions(["-W", "SVM"])
#		paramSel.setNumFolds(5)
#		paramSel.buildClassifier(learnerData)
#		params = paramSel.getBestClassifierOptions()

#class NaiveBayesWrapper(Wrapper)
#	
#	def __init__(self, qID):
#		readLoginFile()
#		self.questionID = qID
#		self.params = ""
#	
#	def run():
#		jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])	
#		learnerData = retrieveData()
#		# run some parameter optimization
#
#		nb = NaiveBayes()
#		paramSel = CVParameterSelection( nb )
#		paramSel.setNumFolds(5)
#		paramSel.buildClassifier(learnerData)
#		params = paramSel.getBestClassifierOptions()
		

