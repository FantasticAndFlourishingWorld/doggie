#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sys
from scapy.all import *

def read_pcap(path):
    """Read pcap file"""
    pkts = rdpcap(path)
    pkts.show()

if __name__ == '__main__':
    read_pcap(sys.argv[1])
