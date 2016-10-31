
# -*-coding:utf-8 -*-
import sqlite3
import sys
import os
import time 
def judgepro(keys,values):
    """
    judge if protocol in keys is true and return the tables need to be connected
    @ keys(list)
    @ values(list)
    """
    k=0
    for key in keys :
        if (key=='protocol'):
            k=keys.index(key)
            break
    if(k!=0):
        '''
        1 means intertable
        '''
        if ((values[k]=='IPv4')|(values[k]=='IPv6')|(values[k]=='ARP')):
            k= 3
        elif ((values[k]=='TCP')|(values[k]=='UDP')):
            k= 4#'Transporttable'
        else:
            k= 5#'Applicationtable'


    return k
#Main keys


    list_1= ['protocol','packet','time','length','http','UDP_len']
    #Ether keys
    list_2 = ['MAC_dst','MAC_src','pkt_type']
    #Network keys
    list_3 = ['version','ihl','tos','IP_len','IP_id','flags','frag','ttl','proto','IP_chksum','IP_src','IP_dst','tc','fl','plen','nh',
                  'hilm','IPv6_src','IPv6_dst','hwtype','ptype','hwlen','op','hwsrc','psrc','hwdst','pdst','src_longitude',
                  'src_latitude','dst_latitude','dat_longitude']
    #Transprt keys
    list_4 = ['sport','dport','seq','ack','dataofs','reserved','TCP_flags','window','chksum','urgptr','pkt_len']
    #Application keys
    list_5 = ['url','protocol_edition','state_code','state_code_description','Content_Length','SINA_LB','Server','Connection',
            'Api_Server_IP','SINA_TS','Date','Content_Type','Accept_Language','Accept_Encoding','Accept','User_Agent',
            'Host','Referer','Cookie','response_body']
class SQLite():

    def __init__(self, dbName, dbPath):
        self.dbName = dbName
        self.dbPath = dbPath + '/' + dbName.lower() + ".db"
        # self.dbPath = os.getcwd() + "/database/" + dbName.lower() + ".db"

    def  createMain(self):
        conn= sqlite3.connect(self.dbPath)
        a='''CREATE TABLE IF NOT EXISTS Maintable '''+'''
            (prid INTEGER PRIMARY KEY AUTOINCREMENT,
            protocol TEXT,
            packet TEXT,
            time TEXT,
            length TEXT,
            http TEXT,
            UDP_len TEXT)
            ;'''

        conn.execute(a)
        conn.close()
        # print "successfully"

    def createEther(self):
        conn= sqlite3.connect(self.dbPath)
        a='''CREATE TABLE IF NOT EXISTS Entertable '''+'''
            (
            prid INTEGER PRIMARY KEY,
            MAC_dst TEXT,
            MAC_src TEXT,
            pkt_type TEXT
            );'''

        conn.execute(a)

        conn.close()
        # print "successfully"

    def  createNetwork(self):
        conn= sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS Networktable '''+'''
            (
            prid INTEGER PRIMARY KEY,
            version TEXT,
            ihl TEXT,
            tos TEXT,
            IP_len TEXT,
            IP_id TEXT,
            flags TEXT,
            frag TEXT,
            ttl TEXT,
            proto TEXT,
            IP_chksum TEXT,
            IP_src TEXT,
            IP_dst TEXT,
            tc TEXT,
            fl TEXT,
            plen TEXT,
            nh TEXT,
            hilm TEXT,
            IPv6_src TEXT,
            IPv6_dst TEXT,
            hwtype TEXT,
            ptype TEXT,
            hwlen TEXT,
            op TEXT,
            hwsrc TEXT,
            psrc TEXT,
            hwdst TEXT,
            pdst TEXT,
            src_longitude TEXT,
            src_latitude TEXT,
            dst_latitude TEXT,
            dat_longitude TEXT

            );''')
        conn.close()
        # print "successfully"

    def createTransport(self):
        conn= sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS Transporttable '''+'''
            (
            prid INTEGER PRIMARY KEY,
            sport TEXT,
            dport TEXT,
            seq TEXT,
            ack TEXT,
            dataofs TEXT,
            reserved TEXT,
            TCP_flags TEXT,
            window TEXT,
            chksum TEXT,
            urgptr TEXT,
            pkt_len TEXT
            );''')

        conn.close()
        # print "successfully"
    def createApplication(self):
        conn= sqlite3.connect(self.dbPath)
        conn.execute('''CREATE TABLE IF NOT EXISTS Applicationtable '''+'''
            (
            prid INTEGER PRIMARY KEY,
            url TEXT,
            protocol_edition TEXT,
            state_code TEXT,
            state_code_description TEXT,
            Content_Length TEXT,
            SINA_LB TEXT,
            Server TEXT,
            Connection TEXT,
            Api_Server_IP TEXT,
            SINA_TS TEXT,
            Date TEXT,
            Content_Type TEXT,
            Accept_Language TEXT,
            Accept_Encoding TEXT,
            Accept TEXT,
            User_Agent TEXT,
            Host TEXT,
            Referer TEXT,
            Cookie TEXT,
            response_body TEXT
            );''')


        conn.close()



    def insertData(self, **kw):
        """
        Insert data into database
        @param: keys (list)
        @param: values (list)

        """
        keys, values = kw['keys'], kw['values']

        lname =''
        proname=''
        res=judgepro(keys,values)
        if (res==3) :

            proname ='Networktable'
        elif(res==4):

            proname ='Transporttable'
        else:

            proname ='Applicationtable'
        # print lname,proname

        conn = sqlite3.connect(self.dbPath)

        for value in values:
            v=values.index(value)
            values[v], value = str(value), str(values[v])
            values[v] ="'"+value+"'"
            # if value.isdigit()!=True:
                # values[v] ="'"+value+"'"
        list_1 = ['protocol','packet','time','length','http','UDP_len']
        #找出主表对应属性
        mts=set(list_1)
        ks=set(keys)
        makey=ks&mts #取交集
        mainkeys=list(makey)
        mainvalues=[]
        for mainkey in mainkeys:
            n=keys.index(mainkey)
            mainvalues.append(values[n])
        #往主表插入数据

        mainkeysStr = ','.join(mainkeys)
        mainvaluesStr = ','.join(mainvalues)
        a="INSERT INTO  Maintable  (" + mainkeysStr + ")"+" VALUES "+"(" + mainvaluesStr + ")"
        conn.execute("INSERT INTO  Maintable  (" + mainkeysStr + ")"+" VALUES "+"(" + mainvaluesStr + ")")
        conn.commit()
        #找出连接层对应的属性
        list_2 = ['MAC_dst','MAC_src','pkt_type']
        mts=set(list_2)
        ks=set(keys)
        makey=ks&mts #取交集
        etherkeys=list(makey)
        ethervalues=[]
        for etherkey in etherkeys:
            n=keys.index(etherkey)
            ethervalues.append(values[n])


        etherkeysStr = ','.join(etherkeys)
        ethervaluesStr = ','.join(ethervalues)
        a="INSERT INTO  Entertable (prid," + etherkeysStr + ")"+"VALUES"+"((SELECT max(prid) FROM Maintable)," + ethervaluesStr + ")"
        # print a
        conn.execute(a)
        conn.commit()
        #找出对应副表的属性
        list_3 = ['version','ihl','tos','IP_len','IP_id','flags','frag','ttl','proto','IP_chksum','IP_src','IP_dst','tc','fl','plen','nh',
                  'hilm','IPv6_src','IPv6_dst','hwtype','ptype','hwlen','op','hwsrc','psrc','hwdst','pdst','src_longitude',
                  'src_latitude','dst_latitude','dat_longitude']
        # Transprt keys
        list_4 = ['sport','dport','seq','ack','dataofs','reserved','TCP_flags','window','chksum','urgptr','pkt_len']
        #Application keys
        list_5 = ['url','protocol_edition','state_code','state_code_description','Content_Length','SINA_LB','Server','Connection',
                  'Api_Server_IP','SINA_TS','Date','Content_Type','Accept_Language','Accept_Encoding','Accept','User_Agent',
                  'Host','Referer','Cookie','response_body']

        mts=[]
        if (res==3) :
            mts=set(list_3)
        elif(res==4):
            mts=set(list_4)
        else:
            mts=set(list_5)
        ks=set(keys)
        makey=ks&mts #取交集
        tkeys=list(makey)

        if len(tkeys) > 0:
            tvalues=[]
            for tkey in tkeys:
                n=tkeys.index(tkey)
                tvalues.append(values[n])

            tkeysStr = ','.join(tkeys)
            tvaluesStr = ','.join(tvalues)

            a="INSERT INTO "+ proname + " (prid," + tkeysStr + ")"+"VALUES"+"((SELECT max(prid) FROM Maintable)," + tvaluesStr + ")"
            conn.execute(a)
            conn.commit()

        conn.close()
        # print "insert successfully"

    def selectData(self, conditions, con_values, keys=None):
        """
        Select data from database
        @param: conditions (list)
        @param: con_values (list)
        @param: keys(list)
        @return: result (list)
        """
        conn = sqlite3.connect(self.dbPath)
        proname=''
        res=judgepro(conditions, con_values)
        if (res==3) :
            proname ='Networktable'
            if keys==None:
                keys=[
                'protocol',
                'packet',
                'time',
                'length',
                'http',
                'UDP_len',
                'MAC_dst',
                'MAC_src',
                'IP_type',
                'version',
                'ihl',
                'tos',
                'IP_len',
                'IP_id',
                'flags',
                'frag',
                'ttl',
                'proto',
                'IP_chksum',
                'IP_src',
                'IP_dst',
                'tc',
                'fl',
                'plen',
                'nh',
                'hilm',
                'IPv6_src',
                'IPv6_dst',
                'hwtype',
                'ptype',
                'hwlen',
                'op',
                'hwsrc',
                'psrc',
                'hwdst',
                'pdst',
                'src_longitude',
                'src_latitude',
                'dst_latitude',
                'dat_longitude'
                ]
        elif(res==4):
            lname ='list_4'
            proname ='Transporttable'
            if keys==None:
                keys=[
                'protocol',
                'packet',
                'time',
                'length',
                'http',
                'UDP_len',
                'MAC_dst',
                'MAC_src',
                'pkt_type',
                'sport',
                'dport',
                'seq',
                'ack',
                'dataofs',
                'reserved',
                'TCP_flags',
                'window',
                'chksum',
                'urgptr',
                'pkt_len'
                ]
        else:
            lname ='list_5'
            proname ='Applicationtable'
            if keys==None:
                keys=[
                'protocol',
                'packet',
                'time',
                'length',
                'http',
                'UDP_len',
                'MAC_dst',
                'MAC_src',
                'IP_type',
                'url',
                'protocol_edition',
                'state_code',
                'state_code_description',
                'Content_Length',
                'SINA_LB',
                'Server',
                'Connection',
                'Api_Server_IP',
                'SINA_TS',
                'Date',
                'Content_Type',
                'Accept_Language',
                'Accept_Encoding',
                'Accept',
                'User_Agent',
                'Host',
                'Referer',
                'Cookie',
                'response_body'
                ]
                
        # print keys
        keysStr=','.join(keys).upper()

        for con_value in con_values:
            v=con_values.index(con_value)
            con_value, con_values[v] = str(con_value), str(con_values[v])
            con_values[v] ="'"+con_value+"'"
            # if con_values[v].isdigit()!=True:
                # con_values[v] ="'"+con_value+"'"

        con_vas=[]
        for condition in conditions:
            a=conditions.index(condition)
            con_vas.append(conditions[a].upper()+"="+con_values[a].upper())

        con_vaStr=' AND '.join(con_vas)
        bb="SELECT " + keysStr + " FROM Maintable INNER JOIN Entertable INNER JOIN " + proname + " "
        if proname:
            bb += " INNER JOIN " + proname
        bb += " ON ((Maintable.prid=Entertable.prid)&(Entertable.prid="+proname+".prid)) "
        if con_vaStr:
            bb += "WHERE " + con_vaStr

        #返回字典
        cursor = conn.execute(bb)
        result = []

        for rows in cursor:
            nvs = zip(keys,rows)
            nvDict = dict( (key,row) for key,row in nvs)
            result.append(nvDict)
        conn.close()
        #print result
        return result

    def deleteTable(self,tablename):
        '''
        deleteTable
        @param tablename(string)
        '''
        conn =sqlite3.connect(self.dbPath)

        conn.execute("DELETE FROM " + tablename)
        conn.commit()
        conn.execute("VACUUM")
        conn.commit()
        conn.close()

    def deleteData(self,proto,op):
        """
        Delete data
        @param：proto is the value of protocol(string )
        @param: op (string)

        """
        proname=''
        if ((proto=='IPv4')|(proto=='IPv6')|(proto=='ARP')):
            proname= 'Networktable'
        elif ((proto=='TCP')|(proto=='UDP')):
            proname= 'Transporttable'
        else:
            proname= 'Applicationtable'
        bb="DELETE FROM (Maintable JOIN Entertable JOIN "+ proname + " ON ((Maintable.prid=Entertable.prid)&(Entertable.prid="+proname+".prid))) WHERE "+op

        conn = sqlite3.connect(self.dbPath)
        conn.execute(bb)

        conn.commit()
        conn.close()

  def timeDelete(self):
        '''
        timeDeletede  data

        '''
        print "How long do you want to save those data ?"
        wishtime = raw_input()
        DATE = time.localtime()[2]
        conn =sqlite3.connect(self.dbPath)
        time = DATE - intern(wishtime)
        conn.execute("DELETE FROM " + self.dbName + ".Maintable" + "WHERE time < (" + time +")")
        conn.execute("DELETE FROM " + self.dbName + ".Ethertable" + "WHERE time < (" + time +")")
        conn.execute("DELETE FROM " + self.dbName + ".Networktable" + "WHERE time < (" + time +")")
        conn.execute("DELETE FROM " + self.dbName + ".Applicationtable" + "WHERE time < (" + time +")")
        conn.execute("DELETE FROM " + self.dbName + ".Transporttable" + "WHERE time < (" + time +")")
        conn.commit()
        conn.close()

