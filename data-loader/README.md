# Prerequisites

1. libzmq-dev
2. libevent 

run `sudo spt-get install libzmq-dev libevent`
run `npm i` to install node packages

# To run

To force the dataloader to run immediately: 

node DataLoader.js

To run the dataloader on schedule, in background: 

node ScheduleDataLoader.js
press ctrl-z to suspend the process
enter bg to run in the background

# Explanation of configuration:
```
{
  // This is the configuration for the nemo datamart connection
  "nemoConnection": {
    "dbName": "DATALOADER_TEST_TWO",
    "userName": "username",
    "password": "password",
    "sequelizeOptions": {
      "host": "host.com",
      "dialect": "mysql", // This could be mysql, postgres, or another value to indicate db type
      "port": 3306,
      "logging": false,
      "pool": {
        "max": 5,
        "min": 0,
        "idle": 10000
      }
    }
  },
  // This is the source database connection
  "kumcConnection": {
    "dbName": "DATALOADER_TEST_ONE",
    "userName": "username",
    "password": "password",
    "sequelizeOptions": {
      "host": "host.com",
      "dialect": "mysql",
      "port": 3306,
      "logging": false,
      "pool": {
        "max": 5,
        "min": 0,
        "idle": 10000
      }
    }
  },
  // This indicates which tables to copy
  "tablesToCopy": {
    "observation_fact": true,
    "code_lookup": false,
    "concept_dimension": false,
    "patient_dimension": true,
    "provider_dimension": false,
    "visit_dimension": false
  },
  // Should the dataloader divide patients into test and learner tables?
  "dividePatients": true,
  // Should the dataloader calculate readmittance rates for these patients?
  "findReadmittance": true,
  // This indicates what day of the month the dataloader will run
  "schedule": {
    "dayOfMonth": 11,
    "hour": 8,
    "minute": 39
  },
  // This is a clause to feed to the patient copy function that indicates which patients to use
  // For example, this would only copy english speaking patients
  "patientWhereClause": {
    "language_cd": "english"
  },
    "server": {
      "db": {
        "host": "codyemoffitt.com",
        "name": "name of the db",
        "username": "username",
        "password": "password",
        "dialect": "mysql",
        "port": 3306,
        "logging": true
      }
    }

}
```
