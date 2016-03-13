# Test for python-weka-wrapper
# FIRST: Follow the instructions at http://pythonhosted.org/python-weka-wrapper/install.html
# to install python-weka-wrapper
# To install mysql for python
# sudo apt-get install python-mysqldb

from weka.classifiers import Classifier, Evaluation
from weka.core.classes import Random
from weka.datagenerators import DataGenerator
from weka.core.database import InstanceQuery
import weka.core.jvm as jvm
import queryBuilder

host = "codyemoffitt.com"
user = "NEMO_WEB"
password = "NEMO"
database = "NEMO_Datamart"
# Get learner data query for questionID 123
learnerQuery = queryBuilder.getDataQuery(host, user, password, database, 123, "learner");

jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])
iquery = InstanceQuery()
iquery.db_url = "jdbc:mysql://codyemoffitt.com:3306/NEMO_Datamart"
iquery.user = "NEMO_WEB"
iquery.password = "NEMO"
# iquery.query = "Select * from IrisData;"
iquery.query = learnerQuery
learnerData = iquery.retrieve_instances()
# data.class_is_last()   # set class attribute
learnerData.class_index = 1 #Sets the class to gender (F or M)

print "\n\n\n"
print "Current class: {0}".format(learnerData.class_attribute)
print "\n\n\n"
print learnerData


classifier = Classifier(classname="weka.classifiers.trees.J48", options=["-C", "0.3"])
evaluation = Evaluation(learnerData)                     # initialize with priors
evaluation.crossvalidate_model(classifier, learnerData, 10, Random(42))  # 10-fold CV
print(evaluation.summary())
print("pctCorrect: " + str(evaluation.percent_correct))
print("incorrect: " + str(evaluation.incorrect))
jvm.stop()
