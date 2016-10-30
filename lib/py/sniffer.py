#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sys
import json
import logging
logging.getLogger("scapy.runtime").setLevel(logging.ERROR)
from scapy.all import *
from db import SQLite
from function_flypaper import flypaper

sq = SQLite("PACKET", sys.argv[1])

def sniff_callback(pkt):
    """Show packet"""
    global sq

    pktObj = flypaper(pkt)
    if not pktObj or pktObj['protocol'] is 'BAD_PACKET':
        return None

    if pktObj['protocol'] is 'HTTP':
        for key, value in pktObj['http'].iteritems():
            pktObj[key] = value
        del pktObj['http']

    print json.dumps(pktObj)

    # sq.insertData(keys, [protocol, sport, dport, smac, dmac, sip, dip, stime, pktlen])
    for key, value in pktObj['result'].iteritems():
        pktObj[key] = value
    del pktObj['result']
    sq.insertData(keys=pktObj.keys(), values=pktObj.values())

def sniff_index(sniff_prn, bpf):
    """The index of the sniff module"""
    if bpf:
        sniff(prn=sniff_prn, store=0, filter=bpf)
    else:
        sniff(prn=sniff_prn, store=0)

if __name__ == '__main__':
    sq.createMain()
    sq.createEther()
    sq.createNetwork()
    sq.createTransport()
    sq.createApplication()
    sniff_index(sniff_callback, sys.argv[2] if len(sys.argv) > 2 else None)
