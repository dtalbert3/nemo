import json
import os

def borg(cls):
    cls._state = {}
    orig_init = cls.__init__
    def new_init(self, *args, **kwargs):
        self.__dict__ = cls._state
        orig_init(self, *args, **kwargs)
    cls.__init__ = new_init
    return cls

@borg
class nemoConfig():
    def __init__(self, file=None):
        if file is not None:
            self.FILE = file
            self.CONFIG = None
            config = self.load(file)
            if self.validate(config):
                self.CONFIG = config

    def validate(self, config):
        try:
            # Validate CONTROLLER
            self.CONTROLLER = config['CONTROLLER']
            self.MAX_QUEUE_SIZE = self.CONTROLLER['MAX_QUEUE_SIZE']
            self.MAX_NUM_THREADS = self.CONTROLLER['MAX_NUM_THREADS']
            self.TIMEOUT = self.CONTROLLER['TIMEOUT']

            # Validate DATABASE
            self.DATABASE = config['DATABASE']
            self.HOST = self.DATABASE['HOST']
            self.PORT = self.DATABASE['PORT']
            self.USER = self.DATABASE['USER']
            self.PASS = self.DATABASE['PASS']
            self.DB = self.DATABASE['DB']
            self.QUEUED_STATUS = self.DATABASE['QUEUED_STATUS']
            self.RUNNING_STATUS =  self.DATABASE['RUNNING_STATUS']
            self.AWAITING_FEEDBACK_STATUS =  self.DATABASE['AWAITING_FEEDBACK_STATUS']
            self.NOT_ENOUGH_DATA =  self.DATABASE['NOT_ENOUGH_DATA']

            # Validate ALGORITHMS
            self.ALGORITHMS = config['ALGORITHMS']

            self.RandomForest = self.ALGORITHMS['RandomForest']
            self.Active = self.RandomForest['Active']

            self.SMO = self.ALGORITHMS['SMO']
            self.Active = self.SMO['Active']

            self.NaiveBayes = self.ALGORITHMS['NaiveBayes']
            self.Active = self.NaiveBayes['Active']
            return True
        except KeyError as e:
            print 'Invalid config file, ', e
            return False

    def load(self, file):
        config = None
        if os.path.isfile(file):
            try:
                with open(file, 'r') as f:
                    try:
                        config = json.load(f)
                    except ValueError as e:
                        print "ValError: " , e
            except EnvironmentError as e:
                print "EnvError: " , e
        else:
            print file + " not found"

        return config
