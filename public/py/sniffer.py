#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sys
from scapy.all import *

count = 0

def sniff_callback(pkt):
    """Show packet"""
    global count
    # if (pkt[TCP].payload):
        # print str(pkt[TCP].payload)

    count += 1
    print count
    pkt.show()
    # hexdump(pkt)

def sniff_index(sniff_prn):
    """The index of the sniff module"""
    sniff(prn=sniff_prn, store=0)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        sniff_count = sys.argv[1]
    else:
        sniff_count = None
    sniff_index(sniff_callback)
