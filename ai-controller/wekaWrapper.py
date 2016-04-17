#!/usr/bin/python

from weka.classifiers import Classifier, Evaluation, Instance
from weka.core.classes import Random
from weka.datagenerators import DataGenerator
from weka.core.database import InstanceQuery
# from weka.classifiers.meta import CVParameterSelection
import weka.core.serialization as serialization
import weka.core.jvm as jvm
import javabridge

import json
import os

from nemoApi import nemoApi, AIParam
from nemoConfig import nemoConfig

# Start JVM on file load
# Required that only ONE jvm exist for all threads
jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])

class WekaWrapper:

	def __init__(self, questionID, algorithm, classifier, parameters, modelParams, optimizer):
		self.questionID = questionID
		self.algorithm = algorithm
		self.classifier = classifier
		self.parameters = parameters
		self.modelParams = modelParams
		self.api = nemoApi()
		self.config = nemoConfig()
		self.optimizer = optimizer


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
		self.api.addModel(self.questionID, '?', self.acc, self.model, self.algorithm, False, self.matrix, self.optimizer)
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
		    learner.add_instance(Instance.create_instance(learnerData.get_instance(i).values))
		    i = i + 1
		i = 0
		while i < testData.num_instances:
		    test.add_instance(Instance.create_instance(testData.get_instance(i).values))
		    i = i + 1

		# Instantiate classifier
		self.cls = Classifier(classname=self.classifier, options=self.parameters)

		# Run classifier
		self.cls.build_classifier(learner)
		# for index, inst in enumerate(learnerData):
			# prediction = self.cls.classify_instance(inst)
			# distribution = self.cls.distribution_for_instance(inst)

		# Test classifier
		evl = Evaluation(learner)
		evl.test_model(self.cls, test)

		# Store information about matrix
		self.acc = evl.percent_correct
		self.val = None

		# Convert numpy array into simple array
		confusionMatrix = []
		confusionMatrix.append([evl.confusion_matrix[0][0], evl.confusion_matrix[0][1]])
		confusionMatrix.append([evl.confusion_matrix[1][0], evl.confusion_matrix[1][1]])

		# Convert matrix into json format
		self.matrix = json.dumps(confusionMatrix)

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
