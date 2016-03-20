#!/usr/bin/python

from weka.classifiers import Classifier, Evaluation
from weka.core.classes import Random
from weka.datagenerators import DataGenerator
from weka.core.database import InstanceQuery
# from weka.classifiers.meta import CVParameterSelection
import weka.core.serialization as serialization
import weka.core.jvm as jvm
import javabridge

import os

from nemoApi import nemoApi
from nemoConfig import nemoConfig

# Start JVM on import
jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])

class WekaWrapper:

	def __init__(self, questionID, algorithm, classifier, parameters):
		self.questionID = questionID
		self.algorithm = algorithm
		self.classifier = classifier
		self.parameters = parameters
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
		self.api.addModel(self.questionID, '?', self.acc, self.model, self.algorithm, False)

	def run(self):
		# Attach JVM
		javabridge.attach()

		# Get data for testing and learning
		learnerData = self.retrieveData(self.questionID, "learner")
		testData = self.retrieveData(self.questionID, 'test')
		masterData = self.retrieveData(self.questionID, 'all')

		# Check if there is enough correct data to run
		if (learnerData.num_instances < 1 or testData.num_instances < 1):
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
		self.cls.build_classifier(learner)
		# for index, inst in enumerate(learnerData):
			# prediction = self.cls.classify_instance(inst)
			# distribution = self.cls.distribution_for_instance(inst)

		# Test classifier
		evl = Evaluation(learner)
		evl.test_model(self.cls, test)

		self.acc = evl.percent_correct
		self.val = None

		print 'Classifier: ', self.classifier
		print 'ID: ', self.questionID
		print 'ACC: ', self.acc
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

		# jvm.stop()
		print '\nFINISHED JOB\n'
		return True

# Main method for direct testing
def main():
	# Load config file
	CONFIG = nemoConfig('config/nemoConfig.json')

	# Instantiate api
	API = nemoApi(CONFIG.HOST, CONFIG.PORT, CONFIG.USER, CONFIG.PASS, CONFIG.DB)

	instance = WekaWrapper(123, 'J48', 'weka.classifiers.trees.J48', ["-C", "0.3"])
	instance.run()
	instance.uploadData()

if  __name__ =='__main__':
	main()
