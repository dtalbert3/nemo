#!/usr/bin/python

from weka.classifiers import Classifier, Evaluation, Instance
from weka.core.classes import Random
from weka.datagenerators import DataGenerator
from weka.core.database import InstanceQuery
# from weka.classifiers.meta import CVParameterSelection
import weka.core.serialization as serialization
import weka.core.jvm as jvm
from weka.core.dataset import Attribute, Instances
import javabridge
import numpy as np

import pdb


import json
import os

from nemoApi import nemoApi, AIParam
from nemoConfig import nemoConfig

# Start JVM on file load
# Required that only ONE jvm exist for all threads
jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])

class WekaWrapper:

	def __init__(self, questionID, algorithm, classifier, parameters, modelParams, optimizer, predict = 0):
		self.questionID = questionID
		self.algorithm = algorithm
		self.classifier = classifier
		self.parameters = parameters
		self.modelParams = modelParams
		self.api = nemoApi()
		self.config = nemoConfig()
		self.optimizer = optimizer
		self.predict = predict
		self.prediction = None


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
			
	def uploadPrediction(self):
		# Upload best classifier prediction to database
		
		if self.prediction is not None:
			# Convert prediction to string
			predStr = 'No prediction'
			if (self.prediction == 1.0):
				predStr = "True"
			elif (self.prediction == 0.0):
				predStr = "False"
			print 'Writing ' + predStr
			self.api.updatePrediction(self.questionID, predStr) 
			
	def addInstancesToDataset(self, source, dest):
		# Align the instances of a source dataset to destination's header and add them to the destination dataset
		i = 0
		while i < source.num_instances:
			values = source.get_instance(i).values
			it = np.nditer(values, flags=['f_index'], op_flags=['readwrite'])
			while not it.finished:
				(it[0], it.index),
				if (source.attribute(it.index).is_nominal):
					stringVal = source.get_instance(i).get_string_value(it.index)
					# print stringVal
					if(stringVal != '?'):
						values[it.index] = dest.attribute(it.index).values.index(stringVal)
				it.iternext()
			dest.add_instance(Instance.create_instance(values))
			i = i + 1
			
	def buildPatientObject(self):
		# Build a patient to classify
		patient = self.api.fetchPatientJSON(self.questionID)
		if patient is not None:
			newPatient = {}
			demographics = ['race_cd', 'sex_cd', 'age_in_years_num']
			observation_fact_features = ['tval_char', 'nval_num']
			for demo in demographics:
				newPatient[demo] = patient[demo]
			for obs in patient['observation_facts']:
				concept_cd = obs['concept_cd']
				for feat in observation_fact_features:
					newPatient[(concept_cd + feat)] = obs[feat]
			return newPatient
		else:
			return None
				
	def addPatientNominals(self, patient, dataset):
		# Add the nominal values for the patient to the master header, in case they aren't already there
		# Loop and add patient's nominal values in case they aren't in masterDataset
		# newDataset will be the new master header
		# Waiting on prediction patient to be defined
		# Should be like {sex_cd: "m", ...}
		ignoreAttributes = ['readmitted']
		atts = []
		for a in dataset.attributes():
			if (not (a.is_nominal)) or (a.name in ignoreAttributes) :
				atts.append(a)
			else:
				newValues = list(a.values)
				#print a.name 
				pvalue = patient[a.name]
				if(pvalue not in newValues):
					newValues.append(pvalue)
				atts.append(Attribute.create_nominal(a.name, newValues))
		newDataset = Instances.create_instances("Dataset", atts, 0)
		newDataset.class_is_last()
		return newDataset
		
	def createPatientInstance(self, patient, dataset):
		# Create a patient instance to classify
		ignoreAttributes = ['readmitted']
		values = []
		for a in dataset.attributes():
			if not a.is_nominal:
				values.append(patient[a.name])
			elif a.name in ignoreAttributes:
				values.append(0)
			else:
				values.append(a.values.index(patient[a.name]))
		#print values
		newInst = Instance.create_instance(values)
		return newInst
		
		
		
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

		# If this is a prediction and there is a valid patient, change masterData header 
		patientObj = self.buildPatientObject()
		patientInstance = None
		if ((patientObj is not None) and (self.predict == 1)):
			masterData = self.addPatientNominals(patientObj, masterData)
			patientInstance = self.createPatientInstance(patientObj, masterData)
			masterData.add_instance(patientInstance)
		
		elif (patientObj is None) and (self.predict == 1):
			print 'No patient defined for prediction. Exiting'
			return True
		# Fix dataset headers up to match and fix instances to match headers
		masterData.delete()
		learner = masterData.copy_instances(masterData, 0, 0)
		test = masterData.copy_instances(masterData, 0, 0)
		self.addInstancesToDataset(learnerData, learner)
		self.addInstancesToDataset(testData, test)
		
		# Comparison of data for testing purposes
		# print 'learnerData'
		# print learnerData
		
		# print 'learner'
		# print learner
		
		# print 'testData'
		# print testData
		
		# print 'test'
		# print test

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
		
		# If this is a prediction... make the prediction
		if ((patientObj is not None) and (self.predict == 1)):
			masterData.add_instance(patientInstance)
			self.prediction = self.cls.classify_instance(masterData.get_instance(0))
			self.uploadPrediction()

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
	newWrapper = WekaWrapper(313, 'SMO', 'weka.classifiers.functions.SMO', [], [], '', predict=1)
	masterData = newWrapper.retrieveData(313, 'all')
	#learnerData = newWrapper.retrieveData(312, 'learner')
	#testData = newWrapper.retrieveData(312, 'test')
	masterData.delete()
	patient = API.fetchPatientJSON(313)
	patientObj = newWrapper.buildPatientObject()
	
	
	print patientObj
	newDataset = newWrapper.addPatientNominals(patientObj, masterData)
	newWrapper.createPatientInstance(patientObj, newDataset)
	newWrapper.run()
	
		
	#newWrapper.addInstancesToDataset(learnerData, masterData)

	# atts = []
	# for a in masterData.attributes():
	# 	if not (a.is_nominal):
	# 		atts.append(a)
	# 	else:
	# 		newValues = list(a.values)
	# 		newValues.append("poop")
	# 		atts.append(Attribute.create_nominal(a.name, newValues))
	
	# newDataset = Instances.create_instances("Dataset", atts, 0)
	# newDataset.class_is_last()
	#pdb.set_trace()
	#param = AIParam("238", "C", "1 4 4", "CVParams")
	#instance = WekaWrapper(208, 'SMO', 'weka.classifiers.functions.SMO', ["-W", "weka.classifiers.functions.SMO", "-P", (param.Param + ' ' + param.Value)], None)
	#instance.run()
	#instance.uploadData()

if  __name__ =='__main__':
	main()
