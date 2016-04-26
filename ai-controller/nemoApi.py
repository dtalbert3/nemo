import MySQLdb
import MySQLdb.cursors
import json as json

def borg(cls):
    cls._state = {}
    orig_init = cls.__init__
    def new_init(self, *args, **kwargs):
        self.__dict__ = cls._state
        orig_init(self, *args, **kwargs)
    cls.__init__ = new_init
    return cls

@borg
class nemoApi():

    # __shared_state = {}
    def __init__(self, host=None, port=None, user=None, password=None, database=None):
        if host is not None: self.host = host
        if port is not None: self.port = port
        if user is not None: self.user = user
        if password is not None: self.password = password
        if database is not None: self.database = database
        if host is not None and port is not None and database is not None:
            self.url = "jdbc:mysql://" + self.host + ":" + str(self.port) + "/" + self.database

    # Add ai model
    def addModel(self, id, value, accuracy, blob, algorithm, active, matrix, optimizer):
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)
        cursor = db.cursor()
        sql = "INSERT INTO AIModel(QuestionID, Value, Accuracy, AI, Algorithm, Active, ConfusionMatrix, Optimizer) " + \
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (id, value, accuracy, blob, algorithm, active, matrix, optimizer))
        db.commit()
        db.close()

    # Fetch questions
    def fetchQuestions(self, limit, status):
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)
        cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        cursor.execute(
            "SELECT ID " +
            "FROM Question " +
            "WHERE StatusID = " + str(status) + " " +
            "ORDER BY DateModified DESC " +
            "LIMIT " + str(limit))
        results = cursor.fetchall()
        db.close()
        return results

    # Set status of given question
    def updateQuestionStatus(self, id, status):
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)
        cursor = db.cursor()
        cursor.execute(
            "UPDATE Question " +
            "SET StatusID = " + str(status) + " "
            "WHERE ID = " + str(id))
        db.commit()
        db.close()
        # Return true/false?

    # Get info on specific question
    def fetchQuestionInfo(self, id):
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)
        cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        cursor.execute(
            "SELECT ID, Accuracy, AIFeedback, PredictionFeedback, Algorithm " +
            "FROM AIModel " +
            "WHERE QuestionID = " + str(id) + " " +
            "ORDER BY DateModified DESC " +
            "LIMIT 1")
        result =  cursor.fetchone()
        db.close()
        return result
        
    # Get info on specific question
    def fetchPatientJSON(self, id):
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)
        cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        cursor.execute(
            "SELECT PatientJSON " +
            "FROM Question " +
            "WHERE ID = " + str(id) + " " +
            "LIMIT 1")
        result =  cursor.fetchone()
        db.close()
        patientJSON = result['PatientJSON']
        patient = json.loads(patientJSON)
        return patient   

    # Get AIModelParams on specific AIModel
    def fetchAIModelParams(self, aiModelId):
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)
        cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        cursor.execute(
            "SELECT AIModel, Param, Value, param_use, ID " +
            "FROM AIModelParams " +
            "WHERE AIModel = " + str(aiModelId))
        results =  cursor.fetchall()
        AIModelParams = []
        for row in results:
            aiModelId = row["AIModel"]
            param = row["Param"]
            value = row["Value"]
            param_use = row["param_use"]
            aiModelParam = AIParam(aiModelId, param, value, param_use)
            AIModelParams.append(aiModelParam)
        db.close()
        return AIModelParams

        # Add ai model
    def addAIModelParam(self, aiModelParam):
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)
        cursor = db.cursor()
        sql = "INSERT INTO AIModelParams(AIModel, Param, Value, param_use) " + \
            "VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (aiModelParam.AIModel, aiModelParam.Param, aiModelParam.Value, aiModelParam.param_use))
        db.commit()
        db.close()

    # Get AIModelParams on specific AIModel
    def fetchLatestAIModelByAlgorithm(self, questionID, algorithm):
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)
        cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        cursor.execute(
            "SELECT ID " +
            "FROM AIModel " +
            "WHERE Algorithm = '" + algorithm + "' " +
            "AND QuestionID = " + str(questionID) + " " +
            "ORDER BY DateModified DESC " +
            "LIMIT 1")
        result =  cursor.fetchone()
        db.close()
        return result

    # Construct query for gathering data
    def getDataQuery(self, questionID, dataset):
        # Whitelist of database attributes to select in query
        #observationAttributes = ["encounter_num", "concept_cd", "provider_id", "nval_num"]
        #patientAttributes = ["vital_status_cd", "sex_cd", "age_in_years_num", "language_cd", "race_cd", "marital_status_cd", "zip_cd", "income_cd"]
        observationAttributes = ["nval_num", "tval_char"]
        patientAttributes = ["race_cd", "sex_cd", "age_in_years_num"]

        # Open database connection
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)

        # prepare a cursor object using cursor() method, user a dictionary so we can use SQL attribute names as opposed to numbered indices
        cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)

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

        dataQuery = "Select DISTINCT "
        # Add patient_dimension attributes to statement
        for attribute in patientAttributes:
            dataQuery += " p.{0}, ".format(attribute)
        # Add each diagnosis/lab's data to statement
        for i, param in enumerate(question.params):
            for j, attribute in enumerate(observationAttributes):
                if(j == (len(observationAttributes) - 1) and i == (len(question.params) - 1)):
                    dataQuery += "`{0}`.{1} as `{0}{1}` ".format(param.concept_cd, attribute)
                else:
                    dataQuery += "`{0}`.{1} as `{0}{1}`, ".format(param.concept_cd, attribute)

        dataQuery += " ,pr.readmitted"
        dataQuery += " from patient_dimension p"
        # Build query, add observation_fact joins for each parameter
        for i, param in enumerate(question.params):
            dataQuery += " INNER JOIN observation_fact `{0}` on p.patient_num = `{0}`.patient_num ".format(param.concept_cd)

        # TODO: Add the left outer join when the ReadmittancePatients table is up

        # Add the learner or test patients join to select only learner or test patients
        if(dataset.upper() == "LEARNER"):
            dataQuery += " INNER JOIN LearnerPatients lp on p.patient_num = lp.patient_num "
        elif(dataset.upper() == "TEST"):
            dataQuery += " INNER JOIN TestPatients tp on p.patient_num = tp.patient_num "

        dataQuery += " INNER JOIN PatientReadmittance pr on p.patient_num = pr.patient_num "
        # Add WHERE clause for each parameter
        # Need to add demographic selection if param.TableName = patient_dimension
        if(len(question.params) > 0):
            dataQuery += " WHERE "
            for i, param in enumerate(question.params):
                if(i == 0):
                    dataQuery += " `{0}`.concept_cd = '{0}' ".format(param.concept_cd)
                else:
                    dataQuery += "AND `{0}`.concept_cd = '{0}' ".format(param.concept_cd)
                if(param.min != None and param.max != None):
                    dataQuery += " AND `{0}`.nval_num BETWEEN {1} AND {2} ".format(param.concept_cd, param.min, param.max)
        dataQuery += ";"
        # disconnect from server
        db.close()
        return dataQuery

class Question:
    # 'Common base class for all Questions'
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
    # 'Common base class for all Parameters'
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

class AIParam:
    # 'Common base class for all Parameters'
    def __init__(self, aiModelId, param, value, param_use):
        self.AIModel = aiModelId
        self.Param = param
        self.Value = value
        self.param_use = param_use
