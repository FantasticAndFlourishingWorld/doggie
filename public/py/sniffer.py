#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sys
from scapy.all import *

def sniff_callback(pkt):
    """Show packet"""
    # if (pkt[TCP].payload):
        # print str(pkt[TCP].payload)

    # if pkt.haslayer(TCP):
        # return pkt.getlayer(TCP).dport

    hexdump(pkt)

def sniff_index(sniff_prn, bpf):
    """The index of the sniff module"""
    # sniff(prn=sniff_prn, store=0)
    sniff_count = 0
    sniff(prn=lambda x:x.sprintf("{IP:%IP.src% -> %IP.dst%\n%sniff_count++%}"), store=0, count=5)

if __name__ == '__main__':
    sniff_index(sniff_callback, sys.argv[1])
