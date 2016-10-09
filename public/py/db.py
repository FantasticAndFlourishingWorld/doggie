#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sqlite3
import os

class SQLite():
    def __init__(self, dbName):
        self.dbName = dbName
        self.dbPath = os.getcwd() + "/database/" + dbName.lower() + ".db"

    def createTable(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            SPORT INTEGER,
            DPORT INTEGER,
            SMAC TEXT,
            DMAC TEXT,
            SIP TEXT,
            DIP TEXT,
            STIME INTEGER,
            PLEN INTEGER
            );''')

        conn.close()

    def insertData(self, keys, values):
        """
        Insert data into database
        @param: keys (list)
        @param: values (list)
        """
        conn = sqlite3.connect(self.dbPath)
        keysStr = ','.join(keys).upper()
        valuesStr = ','.join(values).upper()
        # print "INSERT INTO " + self.dbName + " (" + keysStr + ") \
        # VALUES (" + valuesStr + ");"
        conn.execute("INSERT INTO " + self.dbName + " (" + keysStr + ") \
        VALUES (" + valuesStr + ");")

        conn.commit()
        conn.close()

    def selectData(self, keys):
        """
        Select data from database
        @param: keys (list)
        @return: result (list)
        """
        conn = sqlite3.connect(self.dbPath)
        keysStr = ','.join(keys).upper()
        cursor = conn.execute("SELECT " + keysStr + " FROM " + self.dbName + ";")
        result = []
        for row in cursor:
            item = {}
            for i in range(len(keys)):
                item[keys[i]] = row[i]
            result.append(item)

        conn.close()
        return result

    def deleteData(self):
        """
        Delete data
        @param: op (string)
        """
        conn = sqlite3.connect(self.dbPath)
        conn.execute("DELETE FROM " + self.dbName + " WHERE " + op + ";")
        conn.commit()
        conn.close()
