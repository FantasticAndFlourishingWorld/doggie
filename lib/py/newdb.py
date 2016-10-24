#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sqlite3
# import sys
# import os

class SQLite():
    def __init__(self, dbName, dbPath):
        self.dbName = dbName
        self.dbPath = dbPath + dbName.lower() + ".db"
        # self.dbPath = os.getcwd() + "/database/" + dbName.lower() + ".db"


    def createTable(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PRID INTERGER PRIMARY KEY AUTOINCREMENT,
            PROTOCOL TEXT NOT NULL,
            SPORT INTEGER,
            DPORT INTEGER,
            SMAC TEXT,
            DMAC TEXT,
            TYPE TEXT,
            VERSION TEXT,
            IHL INTEGER, 
            TOS TEXT,
            LEN INTERGER,
            ID TEXT,
            FLAGS INTERGER,
            FRAG INTERGER,
            TTL INTERGER,
            PROTO TEXT,
            TC TEXT,
            FL TEXT,
            PPLEN TEXT,
            NH TEXT,
            HILM TEXT,
            UDP_LEN INTERGER,
            IP_CHECKSUM INTERGER,
            SIP TEXT,
            DIP TEXT,
            SEQ TEXT,
            ACK TEXT,
            DATAOFS TEXT,
            RESERVED TEXT,
            TCP_FLAGS TEXT,
            WINDOW TEXT,
            CHKSUM INTERGER,
            URGPTR TEXT,
            URL TEXT,
            HTTP TEXT,
            HWTYPE TEXT,
            PTYPE TEXT,
            HWLEN TEXT,
            OP TEXT,
            HWSRC TEXT,
            PSRC TEXT,
            HWDST TEXT,
            PDEST TEXT,
            PACKET TEXT,
            SIP TEXT,
            DIP TEXT,
            STIME INTEGER,
            PLEN INTEGER,
            COUNTRY_NAME_EN TEXT,
            COUNTRY_NAME_ZH TEXT,
            CITY_NAME TEXT,
            LOCATION_LATITUDE TEXT,
            LOCATION_LONGITUDE,
            CITY TEXT
            );''')

        conn.close()
        print("create table successfully!")

    def insertData(self, keys, values):
        """
        Insert data into database
        @param: keys (list)
        @param: values (list)

        """
        conn = sqlite3.connect(self.dbPath)
        for value in values:
            if value.isdigit()!=True:
                v=values.index(value)
                values[v] ="'"+value+"'"
        keysStr = ','.join(keys).upper()
        valuesStr = ','.join(values).upper()
        conn.execute("INSERT INTO "+ self.dbName + " (" + keysStr + ")"+"VALUES"+"(" + valuesStr + ")")
        conn.commit()
        conn.close()

    def selectData(self, conditions, con_values, keys=None):
        """
        Select data from database
        @param: conditions (list)
        @param: con_values (list)
        @param: keys(list)
        @return: result (list)
        """
        conn = sqlite3.connect(self.dbPath)
        if keys==None:
            keysStr="*"
            keys=["PRID","PROTOCOL","SPORT","DPORT","SMAC","DMAC","TYPE","VERSION","IHL", "TOS","LEN","ID","FLAGS","FRAG",
            "TTL","PROTO","TC","FL","PPLEN","NH","HILM","UDP_LEN","IP_CHECKSUM","SIP","DIP","SEQ","ACK","DATAOFS",
            "RESERVED",
            "TCP_FLAGS","WINDOW","CHKSUM","URGPTR","URL","HTTP","HWTYPE","PTYPE","HWLEN","OP","HWSRC","PSRC","HWDST",
            "PDEST","PACKET","SIP","DIP","STIME","PLEN","COUNTRY_NAME_EN","COUNTRY_NAME_ZH","CITY_NAME","LOCATION_LATITUDE",
            "LOCATION_LONGITUDE","CITY"]
        else:
            keysStr=','.join(keys).upper()
            

        for con_value in con_values:
            if con_value.isdigit()!=True:
                v=con_values.index(con_value)
                con_values[v] ="'"+con_value+"'"

        con_vas=[]
        for condition in conditions:
            a=conditions.index(condition)
            con_vas.append(conditions[a].upper()+"="+con_values[a].upper())

        con_vaStr=' AND '.join(con_vas)
        bb="SELECT " + keysStr + " FROM " + self.dbName + " WHERE "+con_vaStr
        cursor = conn.execute(bb) 
        result = []
        result.append(keys)
        for row in cursor:
            result.append(row)
            '''*item = {}
            for i in range(len(keys)):
                item[keys[i]] = row[i]
            result.append(item)'''


        conn.close()
        print result
        return result
    def updateData(self, conditions, newvalues):
        """
        Update data in database
        @param:conditions(string)
        @param:newvalues(string)
        """
        conn =sqlite3.connect(self.dbPath)
        conn.execute("UPDATE "+self.dbName+" SET "+conditions+" WHERE "+newvalues)
        
        conn.commit()
        conn.close()
        print "updata successfully!"

    def deleteData(self,op):
        """
        Delete data
        @param: op (string)
        """
        conn = sqlite3.connect(self.dbPath)
        conn.execute("DELETE FROM " + self.dbName + " WHERE " + op )
        conn.commit()
        conn.close()
        print "delete data successfully!"
    def deleteTable(self):
        """
        Delete Table

        """
        conn =sqlite3.connect(self.dbPath)
        conn.execute("DELETE FROM "+self.dbName)
        conn.commit()
        conn.execute("VACUUM")
        conn.commit()
        conn.close()
        print "delete table successfully!"
'''
def main():
    aa=SQLite("test1","F:/")
    aa.createTable()
    aa.insertData(["protocol","sport","dport"],["1","text","2"])
    aa.insertData(["protocol","sport","dport"],["2","text","3"])
    aa.insertData(["protocol","sport","dport"],["3","text","4"])
    aa.selectData(["sport"],["text"])
    aa.deleteData("protocol='text'")
    aa.deleteTable()


main()

'''
