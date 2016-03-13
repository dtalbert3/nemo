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

def getDataQuery(host, user, password, database, questionID, dataSetType):
    # Whitelist of database attributes to select in query
    observationAttributes = ["encounter_num", "concept_cd", "provider_id", "nval_num"]
    patientAttributes = ["vital_status_cd", "sex_cd", "age_in_years_num", "language_cd", "race_cd", "marital_status_cd", "zip_cd", "income_cd"]
    # Open database connection
    db = MySQLdb.connect(host, user, password, database)

    # prepare a cursor object using cursor() method, user a dictionary so we can use SQL attribute names as opposed to numbered indices
    cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)

    # execute SQL query using execute() method.
    cursor.execute("SELECT VERSION()")

    # Fetch a single row using fetchone() method.
    data = cursor.fetchone()

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

  # Need to be able to dynamically build a query as below
  # Sample query of question with two parameters, ICD9:427.9 and ICD9:382.9
  # select DISTINCT * from patient_dimension p
  # INNER JOIN observation_fact o on p.patient_num = o.patient_num
  # INNER JOIN observation_fact o2 on p.patient_num = o2.patient_num
  # INNER JOIN LearnerPatients lp on p.patient_num = lp.patient_num
  # #LEFT OUTER JOIN ReadmittancePatients rp on p.patient_num = rp.patient_num
  # WHERE
  # o.concept_cd Like 'ICD9:427.9'
  # AND o2.concept_cd Like 'ICD9:382.9'

    learnerDataQuery = "Select DISTINCT "
    # Add patient_dimension attributes to statement
    for attribute in patientAttributes:
        learnerDataQuery += " p.{0}, ".format(attribute)
    # Add each diagnosis/lab's data to statement
    for i, param in enumerate(question.params):
        for j, attribute in enumerate(observationAttributes):
            if(j == (len(observationAttributes) - 1) and i == (len(question.params) - 1)):
                learnerDataQuery += "o{0}.{1} as o{0}{1} ".format(i, attribute)
            else:
                learnerDataQuery += "o{0}.{1} as o{0}{1}, ".format(i, attribute)

    learnerDataQuery += " ,pr.readmitted"
    learnerDataQuery += " from patient_dimension p"
    # Build query, add observation_fact joins for each parameter
    for i, param in enumerate(question.params):
        learnerDataQuery += " INNER JOIN observation_fact o{0} on p.patient_num = o{0}.patient_num ".format(i)

    # TODO: Add the left outer join when the ReadmittancePatients table is up

    # Add the learner or test patients join to select only learner or test patients
    if(dataSetType.upper() == "LEARNER"):
        learnerDataQuery += " INNER JOIN LearnerPatients lp on p.patient_num = lp.patient_num "
    else:
        learnerDataQuery += " INNER JOIN TestPatients tp on p.patient_num = tp.patient_num "

    learnerDataQuery += " INNER JOIN PatientReadmittance pr on p.patient_num = pr.patient_num "
    # Add WHERE clause for each parameter
    if(len(question.params) > 0):
        learnerDataQuery += " WHERE "
        for i, param in enumerate(question.params):
            if(i == 0):
                learnerDataQuery += " o{0}.concept_cd = '{1}' ".format(i, param.concept_cd)
            else:
                learnerDataQuery += "AND o{0}.concept_cd = '{1}' ".format(i, param.concept_cd)
            if(param.min != None and param.max != None):
                learnerDataQuery += " AND o{0}.nval_num BETWEEN {1} AND {2} ".format(i, param.min, param.max)
    learnerDataQuery += ";"
    # disconnect from server
    db.close()
    return learnerDataQuery

# host = "codyemoffitt.com"
# user = "NEMO_WEB"
# password = "NEMO"
# database = "NEMO_Datamart"
# print getDataQuery(host, user, password, database, 122, "test")
