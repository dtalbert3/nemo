#!/usr/bin/python

from weka.classifiers import Classifier, Evaluation
from weka.core.classes import Random
from weka.datagenerators import DataGenerator
from weka.core.database import InstanceQuery
# from weka.classifiers.meta import CVParameterSelection
import weka.core.serialization as serialization
import weka.core.jvm as jvm
import queryBuilder
import MySQLdb
import MySQLdb.cursors
from nemoApi import nemoApi
from nemoConfig import nemoConfig


class WekaWrapper:

	def __init__(self, questionID, classifier, parameters):
		self.questionID = questionID
		self.classifier = classifier
		self.parameters = parameters

	def retrieveData(id, table):
		config = nemoConfig()
		query = queryBuilder.getDataQuery(config.host, config.user, config.password, config.database, id, table)
		iquery = InstanceQuery()
		iquery.db_url = "jdbc:mysql://" + config.host + ":" + config.port + "/" + config.database
		iquery.user = config.user
		iquery.password = config.password
		iquery.query = config.query
		data = iquery.retrieve_instances()
		data.class_is_last()
		return data

	# def run():
		# jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])
		# learnerData = retrieveData(self.config.questionID, "learner")

		# cls = Classifier(classname=self.classifier, options=parameters)
		# if classifierType == "SMO":
		# 	#create smo
		# 	cls = Classifier(classname="weka.classifiers.functions.SMO", options=parameters)
		# elif classifierType == "RandomForest":
		# 	#create random forest
		# 	cls = Classifier(classname="weka.classifiers.trees.RandoForest", options=parameters)
		# elif classifierType == "NaiveBayes":
		# 	#create naive bayes
		# 	cls = Classifier(classname="weka.classifiers.bayes.NaiveBayes", options=parameters)
		# else:
			#Error: unrecognized classifier type

		# cls.build_classifier(learnerData)
		# for index, inst in enumerate(learnerData):
    	# pred = cls.classify_instance(inst)
    	# dist = cls.distribution_for_instance(inst)
		#
		# #test classifier to determine accuracy
		# testData = retrieveData(self.config.questionID, 'test')
		# clsTest = Evaluation(testData)
		# clsTest.evaluateModel(cls, testData)
		# summary = clsTest.toSummaryString()
		# #accuracy = some way of getting accuracy out of summary?
		#
		#
		# outFile = str(questionID) + ".model"
		# serialization.write(outFile, cls)
		# thedata = open(outFile, 'rb').read()
		#
		# # Need to insert the rest of the values into the table as well.
		# # will use questionID, classifierType, accuracy
		# sql = "INSERT INTO `NEMO_Datamart`.`AIModel`(`QuestionID`,`AI`, 'AIAlgorithm', 'Accuracy') VALUES (%(id)d, %(blob)s, %(alg)s, %(acc)f);"% {"id": questionID, "blob": theData, "alg": classifierType, "acc": accuracy}
		#
		# # Open database connection
		# db = MySQLdb.connect(host, user, password, database)
		#
		# # prepare a cursor object using cursor() method, user a dictionary so we can use SQL attribute names as opposed to numbered indices
		# cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
		# cursor.execute("SELECT VERSION()")
		#
		# # Fetch a single row using fetchone() method.
		# data = cursor.fetchone()
		# cursor.execute(sql)
		# db.commit()
		# jvm.stop()


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
