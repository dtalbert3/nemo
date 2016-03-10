#!/usr/bin/python
# Install MySQLdb with sudo apt-get install python-mysqldb
import MySQLdb
import MySQLdb.cursors

class Question:
   'Common base class for all Questions'

   def __init__(self, id, userID, statusID, typeID, eventID):
      self.ID = id
      self.UserID = userID
      self.StatusID = statusID
      self.TypeID = typeID
      self.EventID = eventID
      self.params = []

   def displayUserID(self):
     print "UserID: %d" % self.UserID

   def addParam(self, param):
     self.params.append(param)

class Parameter:
   'Common base class for all Parameters'

   def __init__(self, id, questionID, tval_char, nval_num, concept_path, concept_cd, valtype_cd, tableName, tableColumn, min, max):
      self.ID = id
      self.QuestionID = questionID
      self.tval_char = tval_char
      self.nval_num = nval_num
      self.concept_path = concept_path
      self.concept_cd = concept_cd
      self.valtype_cd = valtype_cd
      self.tableName = tableName
      self.tableColumn = tableColumn
      self.min = min
      self.max = max


   def displayConceptCode(self):
     print "concept_cd: %s" % self.concept_cd

# Open database connection
db = MySQLdb.connect("codyemoffitt.com","NEMO_WEB","NEMO","NEMO_Datamart")

# prepare a cursor object using cursor() method, user a dictionary so we can use SQL attribute names as opposed to numbered indices
cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)

# execute SQL query using execute() method.
cursor.execute("SELECT VERSION()")

# Fetch a single row using fetchone() method.
data = cursor.fetchone()

questionID = 120

print "Database version : %s " % data
# Get question info
questionQuery = "Select * from Question where ID = %d" % questionID

try:
   # Execute the SQL command
   cursor.execute(questionQuery)
   # Fetch all the rows in a list of lists.
   results = cursor.fetchall()
   for row in results:
      questionID = row["ID"]
      userID = row["UserID"]
      statusID = row["StatusID"]
      typeID = row["TypeID"]
      eventID = row["EventID"]
      question = Question(questionID, userID, statusID, typeID, eventID)

except:
   print "Error: Unable to fetch question data"

# Get Parameter info
paramQuery = "Select * from QuestionParameter where QuestionID = %d" % questionID

try:
   # Execute the SQL command
   cursor.execute(paramQuery)
   # Fetch all the rows in a list of lists.
   results = cursor.fetchall()
   for row in results:
      id = row["ID"]
      #self.QuestionID = questionID
      tval_char = row["tval_char"]
      nval_num = row["nval_num"]
      concept_path = row["concept_path"]
      concept_cd = row["concept_cd"]
      valtype_cd = row["valtype_cd"]
      tableName = row["TableName"]
      tableColumn = row["TableColumn"]
      min = row["min"]
      max = row["max"]
      parameter = Parameter(id, questionID, tval_char, nval_num, concept_path, concept_cd, valtype_cd, tableName, tableColumn, min, max)
      question.addParam(parameter)
except:
   print "Error: Unable to fetch parameter data"

question.params[0].displayConceptCode()
question.params[1].displayConceptCode()



# disconnect from server
db.close()
