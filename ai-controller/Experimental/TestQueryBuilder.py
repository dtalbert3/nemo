#!/usr/bin/python
import queryBuilder

host = "codyemoffitt.com"
user = "NEMO_WEB"
password = "NEMO"
database = "NEMO_Datamart"
print queryBuilder.getDataQuery(host, user, password, database, 122, "test")
