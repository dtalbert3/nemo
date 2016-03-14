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
learnerData.class_is_last()   # set class attribute
# learnerData.class_index = 1 #Sets the class to gender (F or M)

print "\n\n\n"
print "Current class: {0}".format(learnerData.class_attribute)
print "\n\n\n"
print learnerData


# classifier = Classifier(classname="weka.classifiers.trees.J48", options=["-C", "0.3"])
# evaluation = Evaluation(learnerData)                     # initialize with priors
# evaluation.crossvalidate_model(classifier, learnerData, 10, Random(42))  # 10-fold CV
# print(evaluation.summary())
# print("pctCorrect: " + str(evaluation.percent_correct))
# print("incorrect: " + str(evaluation.incorrect))
cls = Classifier(classname="weka.classifiers.trees.J48", options=["-C", "0.3"])
cls.build_classifier(learnerData)
for index, inst in enumerate(learnerData):
    pred = cls.classify_instance(inst)
    dist = cls.distribution_for_instance(inst)
    print(str(index+1) + ": label index=" + str(pred) + ", class distribution=" + str(dist))

print "\n\nSaving classifier\n\n"
serialization.write("out.model", cls)
thedata = open('out.model', 'rb').read()
# sql = "INSERT INTO sometable (theblobcolumn) VALUES (%s)"
sql = "INSERT INTO `NEMO_Datamart`.`AIModel`(`QuestionID`,`AI`) VALUES (123, %s);"

host = "codyemoffitt.com"
user = "NEMO_WEB"
password = "NEMO"
database = "NEMO_Datamart"
# Open database connection
db = MySQLdb.connect(host, user, password, database)

# prepare a cursor object using cursor() method, user a dictionary so we can use SQL attribute names as opposed to numbered indices
cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
# execute SQL query using execute() method.
cursor.execute("SELECT VERSION()")

# Fetch a single row using fetchone() method.
data = cursor.fetchone()
print data
print sql
# print thedata
cursor.execute(sql, (thedata,))
db.commit()
print "\n\n\n\n\n"

# Recover the data so you can check back
sql = "SELECT AI FROM `NEMO_Datamart`.`AIModel` WHERE QuestionID = 123"
cursor.execute(sql)
data = cursor.fetchone()
# print data['AI']
print "\n\n\n"
fo = open("foo.txt", "wb")
fo.write(data['AI'])
fo.close()
objects = serialization.read_all("foo.txt")
classifier2 = Classifier(jobject=objects[0])
evaluation = Evaluation(learnerData)                     # initialize with priors
evaluation.crossvalidate_model(classifier2, learnerData, 10, Random(42))  # 10-fold CV
print(evaluation.summary())
print("pctCorrect: " + str(evaluation.percent_correct))
print("incorrect: " + str(evaluation.incorrect))

jvm.stop()
