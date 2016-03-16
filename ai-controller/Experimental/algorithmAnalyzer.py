import MySQLdb
import MySQLdb.cursors

def fetchInfo(id):
    db = MySQLdb.connect(HOST, USER, PASS, DB)
    # except
    cursor = db.cursor()

def run(id):
    print 'hello world', id
