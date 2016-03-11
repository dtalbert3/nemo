#!/usr/bin/python
import queryBuilder

host = "codyemoffitt.com"
user = "NEMO_WEB"
password = "NEMO"
database = "NEMO_Datamart"
print queryBuilder.getDataQuery(host, user, password, database, 123, "test")
print "\n\n\n"
print queryBuilder.getDataQuery(host, user, password, database, 123, "learner")
