#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sys
import threading
from socket import *

host = gethostbyname(sys.argv[1])
start_port = int(sys.argv[2])
end_port = int(sys.argv[3])
ports = []

def scan(port):
    """Scan ports of TCP"""
    global host, ports
    try:
        sk = socket(AF_INET, SOCK_STREAM)
        sk.settimeout(0.1)
        if sk.connect_ex((host, port)) == 0:
            ports.append(port)
    except error:
        pass

    sk.close()

class Scan(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        global mutex, start_port, end_port
        while True:
            mutex.acquire()
            if start_port > end_port - 1:
                mutex.release()
                break

            start_port += 1
            mutex.release()
            scan(start_port)

def scanner_index(thread_count):
    """The entry"""
    global mutex, ports
    threads = []
    mutex = threading.Lock()
    for i in range(thread_count):
        thread = Scan()
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

    ports.sort()
    print ports

if __name__ == "__main__":
    scanner_index(60)
