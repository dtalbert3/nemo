# Test for python-weka-wrapper
# FIRST: Follow the instructions at http://pythonhosted.org/python-weka-wrapper/install.html
# to install python-weka-wrapper
# To install mysql for python
# sudo apt-get install python-mysqldb

from weka.classifiers import Classifier, Evaluation
from weka.core.classes import Random
from weka.datagenerators import DataGenerator
from weka.core.database import InstanceQuery
import weka.core.serialization as serialization
import weka.core.jvm as jvm
import queryBuilder
import MySQLdb
import MySQLdb.cursors
import javabridge

host = "codyemoffitt.com"
user = "NEMO_WEB"
password = "NEMO"
database = "NEMO_Datamart"
# Get learner data query for questionID 123
allQuery = queryBuilder.getDataQuery(host, user, password, database, 123, "all");
learnerQuery = queryBuilder.getDataQuery(host, user, password, database, 123, "learner");
testQuery = queryBuilder.getDataQuery(host, user, password, database, 123, "test");

jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])
iquery = InstanceQuery()
iquery.db_url = "jdbc:mysql://codyemoffitt.com:3306/NEMO_Datamart"
iquery.user = "NEMO_WEB"
iquery.password = "NEMO"

iquery.query = learnerQuery
learnerData = iquery.retrieve_instances()
learnerData.class_is_last()   # set class attribute

iqueryb = InstanceQuery()
iqueryb.db_url = "jdbc:mysql://codyemoffitt.com:3306/NEMO_Datamart"
iqueryb.user = "NEMO_WEB"
iqueryb.password = "NEMO"

iqueryb.query = testQuery
testData = iqueryb.retrieve_instances()
testData.class_is_last()   # set class attribute

iqueryc = InstanceQuery()
iqueryc.db_url = "jdbc:mysql://codyemoffitt.com:3306/NEMO_Datamart"
iqueryc.user = "NEMO_WEB"
iqueryc.password = "NEMO"

iqueryc.query = allQuery
allData = iqueryc.retrieve_instances()
allData.class_is_last()   # set class attribute

allData.delete()
learner = allData.copy_instances(allData, 0, 0)
test = allData.copy_instances(allData, 0, 0)
i = 0
while i < learnerData.num_instances:
    learner.add_instance(learnerData.get_instance(i))
    i = i + 1
i = 0
while i < learnerData.num_instances:
    test.add_instance(testData.get_instance(i))
    i = i + 1
print "Learner:\n"
print learner
print "Test:\n"
print test
cls = Classifier(classname="weka.classifiers.trees.J48", options=["-C", "0.3"])
cls.build_classifier(learner)
# evaluation = Evaluation(learnerData)                     # initialize with priors
# evaluation.crossvalidate_model(cls, learnerData, 2, Random(42))  # 10-fold CV
# print(evaluation.summary())
# print("pctCorrect: " + str(evaluation.percent_correct))
# print("incorrect: " + str(evaluation.incorrect))
# build classifier
# print "Learner Data \n"
# print learnerData
# print "\n\n\n\nTest Data\n"
# print testData
# allData = allData.append_instances(learnerData, testData)
# # # evaluate
evl = Evaluation(learner)
evl.test_model(cls, test)
print(evl.summary())


jvm.stop()
