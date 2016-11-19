#! /usr/bin/env python
#-*- encoding: utf-8 -*-
from abc import ABCMeta, abstractmethod
from Queue import Queue
import sqlite3
import time

class PoolException(Exception):
    pass

class Pool(object):
    def __init__(self, maxActive=5, maxWait=None, init_size=0, db_type="SQlite3", **config):
        self.free_conns = Queue(maxActive)
        self.maxWait = maxWait
        self.db_type = db_type
        self.config = config
        for i in xrange(min(init_size, maxActive)):
            self.free(self.create_conn())
    
    def __del__(self):
        self.release()
    
    def release(self):
        while self.free_conns and not self.free_conns.empty():
            conn = self.free_conns.get()
            conn.release()
        self.free_conns = None
    
    def create_conn(self):
        if self.db_type in dbcs:
            return dbcs[self.db_type](**self.config)
        else:
            return None
    
    def get(self, timeout=None):
        if not timeout:
            timeout = self.maxWait
        conn = None
        if self.free_conns.empty():
            conn = self.create_conn()
        else:
            conn = self.free_conns.get(timeout=timeout)
        conn.pool = self;
        return conn
    
    def free(self, conn):
        conn.pool = None
        if self.free_conns.full():
            conn.release()
        else:
            self.free_conns.put_nowait(conn)
    
class PoolingConnection(object):
    __metaclass__ = ABCMeta
    def __init__(self, **config):
        self.conn = None
        self.pool = None
        self.config = config
    
    def __del__(self):
        self.release()
    
    def __enter__(self):
        pass
    
    def __exit__(self, exc_type, exc_value, traceback):
        self.close()
    
    def release(self):
        if self.conn is not None:
            self.conn.close()
            self.conn = None
        self.pool = None
    
    def close(self):
        if self.pool is None:
            raise PoolException("Closed already!")
        self.pool.free(self)
    
    def __getattr__(self, val):
        if self.conn is None and self.pool is not None:
            self.conn = self.create_conn(**self.config)
        if self.conn is None:
            raise PoolException("Cannot create connection!")
        return getattr(self.conn, val)
    
    @abstractmethod
    def create_conn(self, **config):
        pass

class SQlite3PoolConnection(PoolingConnection):
    def create_conn(self, **config):
        conn = sqlite3.connect(**config)
        return conn

dbcs = {
    "SQlite3": SQlite3PoolConnection
}


# def test():
#     pool = Pool(database="../../database/packet.db")
#     conn = pool.get()
#     with conn:
#         for a in conn.execute("SELECT * FROM Transporttable"):
#             print a

if __name__ == "__main__":
    test()
