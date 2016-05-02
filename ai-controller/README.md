# NEMO  AI CONTROLLER
## Prerequisites 

1. default-jdk 
2. python-dev 
3. python-pip 
4. python-numpy 
5. libmysqlclient-dev 
6. libzmq-dev 
7. libevent 
8. javabridge 
9. python-weka-wrapper 
10. MySQL-python 
11. pyzmq 
12. zerorpc

## Installing Packages
The following can be installed using "apt-get install"

`sudo apt-get install default-jdk python-dev python-pip python-numpy libmysqlclient-dev libzmq-dev libevent`

The following can be installed using "pip install"

`sudo pip install javabridge python-weka-wrapper MySQL-python pyzmq zerorpc`

Alternatively the install_ai_packages script can be run.
The Script for this is located in nemo/ai-controller/ folder

## Configuration

The configuration of the ai-controller is outlined below.

```
{
  "CONTROLLER": {
    // This is the maximum amount of questions the AI controller will pull at a given time
    "MAX_QUEUE_SIZE": 20,
    // This is the maximum number of questions the AI controller will work on at once
    "MAX_NUM_THREADS": 1, 
    // This is the amount of time the AI controller sleeps before polling for new questions, in seconds
    "TIMEOUT": 3 
  },
  // This is the database login information
  "DATABASE": { 
    "HOST": "codyemoffitt.com",
    "PORT": 3306,
    "USER": "NEMO_WEB",
    "PASS": "NEMO",
    "DB": "NEMO_DEV",
    // This is the integer defining queued status for a question, it is 1 in the database as well
    "QUEUED_STATUS": 1, 
    // Integer defining running status of a question
    "RUNNING_STATUS": 2, 
    // Integer defining the Waiting on Feedback status for a question
    "AWAITING_FEEDBACK_STATUS": 3, 
    // Integer defining the Not Enough Data status for a question
    "NOT_ENOUGH_DATA": 4 
  },
  // This is a list of algorithms the ai-controller will use, and which optimizers can be used with them
  "ALGORITHMS": { 
    "RandomForest": {
      // Active denotes that the AI can choose to run this algorithm
      "Active": true, 
      // This is a list of optimizers that can be used for this algorithm
      "Optimizers": {
        // These are parameters the AI Analyzer can choose to add when the CV Parameter Optimizer is chosen
        "CVParams": { 
          "CV_I": {"param":"I", "value":"1 10 10"},
          "CV_K": {"param":"K", "value": "1 10 10"},
          "CV_S": {"param":"S", "value": "1 10 10"}
        },
        // These are parameters the AI Analyzer can choose to add when the no Optimizer is chosen
        "Options": { 
          "CV_O": {"param":"-O", "value":true},
          "CV_B": {"param":"-B", "value":true}
        },
        // Feature selection has no parameters specified
        "FeatureSelection": {}, 
        // These are classifiers that can be chosen to be used with this algorithm when ensemble learning is chosen as the Optimizer
        "Ensemble": { 
          "SMO": {"param":"-B", "value":"weka.classifiers.functions.SMO"},
          "NaiveBayes": {"param":"-B", "value":"weka.classifiers.bayes.NaiveBayes"},
          "J48": {"param":"-B", "value":"weka.classifiers.trees.J48"},
          "Perceptron": {"param":"-B", "value":"weka.classifiers.functions.MultilayerPerceptron"}
        }
      }
    },
    "SMO":{
      "Active": true,
      "Optimizers": {
        "CVParams": {
          "CV_C": {"param":"C", "value":"1 4 4"},
          "CV_V": {"param":"V", "value":"1 5 5"},
          "CV_W": {"param":"W", "value":"1 10 10"}
        },
        "FeatureSelection": {},
        "Ensemble": {
          "RandomForest": {"param":"-B", "value":"weka.classifiers.trees.RandomForest"},
          "NaiveBayes": {"param":"-B", "value":"weka.classifiers.bayes.NaiveBayes"},
          "J48": {"param":"-B", "value":"weka.classifiers.trees.J48"},
          "Perceptron": {"param":"-B", "value":"weka.classifiers.functions.MultilayerPerceptron"}
        }
      }
    },
    "NaiveBayes": {
      "Active": true,
      "Optimizers": {
        "Options": {
          "CV_D": {"param":"-D", "value":true}
        },
        "FeatureSelection": {},
        "Ensemble": {
          "RandomForest": {"param":"-B", "value":"weka.classifiers.trees.RandomForest"},
          "J48": {"param":"-B", "value":"weka.classifiers.trees.J48"},
          "Perceptron": {"param":"-B", "value":"weka.classifiers.functions.MultilayerPerceptron"},
          "SMO": {"param":"-B", "value":"weka.classifiers.functions.SMO"}
        }
      }
    },
    "J48": {
      "Active": true,
      "Optimizers": {
        "Options": {
          "CV_B": {"param":"-B", "value":true},
          "CV_U": {"param":"-U", "value":true},
          "CV_R": {"param":"-R", "value":true},
          "CV_S": {"param":"-S", "value":true},
          "CV_A": {"param":"-A", "value":true},
          "CV_J": {"param":"-J", "value":true}
        },
        "FeatureSelection": {},
        "Ensemble": {
          "RandomForest": {"param":"-B", "value":"weka.classifiers.trees.RandomForest"},
          "NaiveBayes": {"param":"-B", "value":"weka.classifiers.bayes.NaiveBayes"},
          "Perceptron": {"param":"-B", "value":"weka.classifiers.functions.MultilayerPerceptron"},
          "SMO": {"param":"-B", "value":"weka.classifiers.functions.SMO"}
        }
      }
    },
    "Perceptron": {
      "Active": true,
      "Optimizers": {
        "Options": {
          "CV_B": {"param":"-B", "value":true},
          "CV_C": {"param":"-C", "value":true},
          "CV_I": {"param":"-I", "value":true},
          "CV_D": {"param":"-D", "value":true}
        },
        "FeatureSelection": {},
        "Ensemble": {
          "RandomForest": {"param":"-B", "value":"weka.classifiers.trees.RandomForest"},
          "NaiveBayes": {"param":"-B", "value":"weka.classifiers.bayes.NaiveBayes"},
          "J48": {"param":"-B", "value":"weka.classifiers.trees.J48"},
          "SMO": {"param":"-B", "value":"weka.classifiers.functions.SMO"}
        }
      }
    }
  }
}
```