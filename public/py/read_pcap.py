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
    results = []
    for pkt in pkts:
        pkt = flypaper(pkt)
        pktResult = pkt['result']
        result = {}
        result['SMAC'] = pktResult.get('MAC_src', None)
        result['DMAC'] = pktResult.get('MAC_dst', None)
        result['SPORT'] = pktResult.get('sport', '0')
        result['DPORT'] = pktResult.get('dport', '0')
        result['SIP'] = pktResult.get('IP_src', None)
        result['DIP'] = pktResult.get('IP_dst', None)
        result['PROTOCOL'] = pkt.get('protocol', None)
        result['STIME'] = pkt.get('time', 0) * 1000

        results.append(result)


    print json.dumps({ "pkts": results })

if __name__ == '__main__':
    read_pcap(sys.argv[1])
