# Test for python-weka-wrapper
# FIRST: Follow the instructions at http://pythonhosted.org/python-weka-wrapper/install.html
# to install python-weka-wrapper

from weka.classifiers import Classifier, Evaluation
from weka.core.classes import Random
from weka.datagenerators import DataGenerator
from weka.core.database import InstanceQuery
import weka.core.jvm as jvm


jvm.start(class_path=["mysql-connector-java-5.1.38-bin.jar"])
iquery = InstanceQuery()
iquery.db_url = "jdbc:mysql://codyemoffitt.com:3306/NEMO_Datamart"
iquery.user = "NEMO_WEB"
iquery.password = "NEMO"
iquery.query = "Select * from IrisData;"
data = iquery.retrieve_instances()

print data

data.class_is_last()   # set class attribute
classifier = Classifier(classname="weka.classifiers.trees.J48", options=["-C", "0.3"])
evaluation = Evaluation(data)                     # initialize with priors
evaluation.crossvalidate_model(classifier, data, 10, Random(42))  # 10-fold CV
print(evaluation.summary())
print("pctCorrect: " + str(evaluation.percent_correct))
print("incorrect: " + str(evaluation.incorrect))
jvm.stop()
