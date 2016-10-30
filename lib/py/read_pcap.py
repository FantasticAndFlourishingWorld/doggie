#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sys
import json
import logging
logging.getLogger("scapy.runtime").setLevel(logging.ERROR)
from scapy.all import *
from function_flypaper import flypaper

def read_pcap(path):
    """Read pcap file"""
    pkts = rdpcap(path)
    pktObjs = []
    for pkt in pkts:
        pktObj = flypaper(pkt)
        if not pktObj:
            return None

        if pktObj['protocol'] is 'HTTP':
            for key, value in pktObj['http'].iteritems():
                pktObj[key] = value
            del pktObj['http']

        pktObjs.append(pktObj)


    print json.dumps({ "pkts": pktObjs })

if __name__ == '__main__':
    read_pcap(sys.argv[1])
