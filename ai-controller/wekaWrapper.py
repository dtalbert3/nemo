#!/usr/bin/python

from weka.classifiers import Classifier, Evaluation
from weka.core.classes import Random
from weka.datagenerators import DataGenerator
from weka.core.database import InstanceQuery
# from weka.classifiers.meta import CVParameterSelection
import weka.core.serialization as serialization
import weka.core.jvm as jvm
import javabridge
from nemoApi import AIParam

import os

from nemoApi import nemoApi
from nemoConfig import nemoConfig

# Start JVM on import
jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])

class WekaWrapper:

	def __init__(self, questionID, algorithm, classifier, parameters, modelParams):
		self.questionID = questionID
		self.algorithm = algorithm
		self.classifier = classifier
		self.parameters = parameters
		self.modelParams = modelParams
		self.api = nemoApi()
		self.config = nemoConfig()


	def retrieveData(self, id, dataset):
		query = self.api.getDataQuery(id, dataset)
		iquery = InstanceQuery()
		iquery.db_url = "jdbc:mysql://" + self.config.HOST + ":" + str(self.config.PORT) + "/" + self.config.DB
		iquery.user = self.config.USER
		iquery.password = self.config.PASS
		iquery.query = query
		data = iquery.retrieve_instances()
		data.class_is_last()
		return data

	def uploadData(self):
		# Upload file to database
		self.api.addModel(self.questionID, '?', self.acc, self.model, self.algorithm, False, self.matrix)
		info = self.api.fetchQuestionInfo(self.questionID)
		modelID = info['ID']
		for mParam in self.modelParams:
			mParam.AIModel = modelID
			self.api.addAIModelParam(mParam)

	def run(self):
		# Attach JVM
		javabridge.attach()

		# Debug

		print "Classifier"
		print self.classifier
		print "Params"
		print self.parameters
		print "Model Params"
		print self.modelParams

		# Get data for testing and learning
		learnerData = self.retrieveData(self.questionID, "learner")
		testData = self.retrieveData(self.questionID, 'test')
		masterData = self.retrieveData(self.questionID, 'all')

		# Check if there is enough correct data to run
		if (learnerData.num_instances < 1 or testData.num_instances < 1):
			self.status = self.config.NOT_ENOUGH_DATA
			return False

		# Fix data up
		masterData.delete()
		learner = masterData.copy_instances(masterData, 0, 0)
		test = masterData.copy_instances(masterData, 0, 0)
		i = 0
		while i < learnerData.num_instances:
		    learner.add_instance(learnerData.get_instance(i))
		    i = i + 1
		i = 0
		while i < testData.num_instances:
		    test.add_instance(testData.get_instance(i))
		    i = i + 1

		# Instantiate classifier
		self.cls = Classifier(classname=self.classifier, options=self.parameters)

		# Run classifier
		print " ---------------  about to run classifier"
		self.cls.build_classifier(learner)
		# for index, inst in enumerate(learnerData):
			# prediction = self.cls.classify_instance(inst)
			# distribution = self.cls.distribution_for_instance(inst)

		# Test classifier
		print " ----------------- about to do evaluation"
		evl = Evaluation(learner)
		evl.test_model(self.cls, test)

		self.acc = evl.percent_correct
		

		print " ------------------ about to write confusion matrix"
		# Temporarily write the serialized confusion matrix to a file
		conf_matrix = evl.confusion_matrix
		fileName = str(self.questionID) + self.algorithm + ".matrix"
		serialization.write(fileName, str(conf_matrix))
		# Open the file and read the contents back in
		self.matrix = None
		with open(fileName, 'rb') as f:
			self.matrix = f.read()
		# Remove the file
		os.remove(fileName)

		self.val = None

		# print 'Classifier: ', self.classifier
		# print 'ID: ', self.questionID
		# print 'ACC: ', self.acc
		# print(evl.summary())

		# Temporarily store file to serialize to
		fileName = str(self.questionID) + self.algorithm + ".model"
		serialization.write(fileName, self.cls)

		# Open that file and store it
		self.model = None
		with open(fileName, 'rb') as f:
			self.model = f.read()

		# Remove temporary file
		os.remove(fileName)

		# Set status to awaiting feedback
		self.status = self.config.AWAITING_FEEDBACK_STATUS
		return True

# Main method for direct testing
def main():
	# Load config file
	CONFIG = nemoConfig('config/dev.json')

	# Instantiate api
	API = nemoApi(CONFIG.HOST, CONFIG.PORT, CONFIG.USER, CONFIG.PASS, CONFIG.DB)
	

	param = AIParam("238", "C", "1 4 4", "DefaultCVParams")
	instance = WekaWrapper(208, 'SMO', 'weka.classifiers.functions.SMO', ["-W", "weka.classifiers.functions.SMO", "-P", (param.Param + ' ' + param.Value)], None)
	instance.run()
	instance.uploadData()

if  __name__ =='__main__':
	main()
