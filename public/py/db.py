#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sqlite3

class SQLite():
    def __init__(self, dbName):
        self.dbName = dbName
        self.dbPath = "../../database/" + dbName.lower() + ".db"

    def createTable(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            SPORT INTEGER,
            DPORT INTEGER,
            SMAC TEXT,
            DMAC TEXT,
            SIP TEXT,
            DIP TEXT,
            STIME INTEGER
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

if __name__ == "__main__":
    # example:
    # make sure that when value's type is TEXT, you should make it like "'192.168.1.1'"!
    db = SQLite("PACKET")
    db.createTable()
    keys = ["protocol", "sport", "dport"]
    values = ["'192.168.1.1'", "80", "8080"]
    db.insertData(keys, values)
    data = db.selectData(keys)
