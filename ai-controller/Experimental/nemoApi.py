import MySQLdb
import MySQLdb.cursors

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

    # Fetch questions
    def fetchQuestions(self, limit, status):
        db = MySQLdb.connect(self.host, self.user, self.password, self.database)
        cursor = db.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        cursor.execute(
            "SELECT ID " +
            "FROM Question " +
            # "WHERE StatusID = " + str(status) + " " +
            "ORDER BY DateModified DESC " +
            "LIMIT " + str(limit))
        results = cursor.fetchall()
        # db.close()
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
        return cursor.fetchone()
