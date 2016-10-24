#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sqlite3
# import sys
# import os

class SQLite():
    def __init__(self, dbName, dbPath):
        self.dbName = dbName
        self.dbPath = dbPath + "/../../database/" + dbName.lower() + ".db"
        # self.dbPath = os.getcwd() + "/database/" + dbName.lower() + ".db"

    #IPV4/TCP/HTTP
    def createTable1_1_1(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            ihl INTEGER,
            tos TEXT,
            len INTEGER,
            id INTEGER,
            flags INTEGER,
            frag INTEGER,
            ttl INTEGER,
            proto TEXT,
            IP_chksum TEXT,
            sport INTEGER,
            dport INTEGER,
            seq TEXT,
            ack TEXT,
            dataofs TEXT,
            reserved TEXT,
            TCP_flags TEXT,
            window TEXT,
            url TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #IPV4/TCP/OTHER
    def createTable1_1_2(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            ihl INTEGER,
            tos TEXT,
            len INTEGER,
            id INTEGER,
            flags INTEGER,
            frag INTEGER,
            ttl INTEGER,
            proto TEXT,
            IP_chksum TEXT,
            sport INTEGER,
            dport INTEGER,
            seq TEXT,
            ack TEXT,
            dataofs TEXT,
            reserved TEXT,
            TCP_flags TEXT,
            window TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #IPV4/UDP/HTTP
    def createTable1_2_1(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            ihl INTEGER,
            tos TEXT,
            len INTEGER,
            id INTEGER,
            flags INTEGER,
            frag INTEGER,
            ttl INTEGER,
            proto TEXT,
            IP_chksum TEXT,
            sport INTEGER,
            dport INTEGER,
            chksum TEXT,
            url TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #IPV4/UDP/OTHER
    def createTable1_2_2(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            ihl INTEGER,
            tos TEXT,
            len INTEGER,
            id INTEGER,
            flags INTEGER,
            frag INTEGER,
            ttl INTEGER,
            proto TEXT,
            IP_chksum TEXT,
            sport INTEGER,
            dport INTEGER,
            chksum TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #IPV4/OTHER
    def createTable1_3(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            ihl INTEGER,
            tos TEXT,
            len INTEGER,
            id INTEGER,
            flags INTEGER,
            frag INTEGER,
            ttl INTEGER,
            proto TEXT,
            IP_chksum TEXT,
            IP_src TEXT,
            IP_dst TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #IPV6/TCP/HTTP
    def createTable2_1_1(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            tc INTEGER,
            fl INTEGER,
            plen INTEGER,
            nh TEXT,
            hlim INTEGER,
            IPv6_src INTEGER,
            IPv6_dst INTEGER,
            sport INTEGER,
            dport INTEGER,
            seq TEXT,
            ack TEXT,
            dataofs TEXT,
            reserved TEXT,
            TCP_flags TEXT,
            window TEXT,
            url TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #IPV6/TCP/OTHER
    def createTable2_1_2(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            tc INTEGER,
            fl INTEGER,
            plen INTEGER,
            nh TEXT,
            hlim INTEGER,
            IPv6_src INTEGER,
            IPv6_dst INTEGER,
            sport INTEGER,
            dport INTEGER,
            seq TEXT,
            ack TEXT,
            dataofs TEXT,
            reserved TEXT,
            TCP_flags TEXT,
            window TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

            conn.close()

    #IPV6/UDP/HTTP
    def createTable2_2_1(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            tc INTEGER,
            fl INTEGER,
            plen INTEGER,
            nh TEXT,
            hlim INTEGER,
            IPv6_src INTEGER,
            IPv6_dst INTEGER,
            sport INTEGER,
            dport INTEGER,
            len TEXT,
            chksum TEXT,
            url TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #IPV6/UDP/OTHER
    def createTable2_2_2(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            tc INTEGER,
            fl INTEGER,
            plen INTEGER,
            nh TEXT,
            hlim INTEGER,
            IPv6_src INTEGER,
            IPv6_dst INTEGER,
            sport INTEGER,
            dport INTEGER,
            len INTEGER,
            chksum TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #IPV6/OTHER
    def createTable2_3(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            version TEXT,
            tc INTEGER,
            fl INTEGER,
            plen INTEGER,
            nh TEXT,
            hlim INTEGER,
            IPv6_src INTEGER,
            IPv6_dst INTEGER,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #ARP
    def createTable3(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            hwtype TEXT,
            ptype TEXT,
            hwlen INTEGER,
            plen INTEGER,
            op INTEGER,
            hwsrc TEXT,
            psrc TEXT,
            hwdst TEXT,
            pdst TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #OTHER
    def createTable4(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            MAC_dst TEXT,
            MAC_src TEXT,
            type TEXT,
            packet TEXT,
            time INTEGER,
            length INTEGER
            );''')

        conn.close()

    #BAD_PACKET
    def createTableBAD_PACKET(self):
        conn = sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS ''' + self.dbName + '''
            (PROTOCOL TEXT NOT NULL,
            packet TEXT,
            time INTEGER,
            length INTEGER
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
