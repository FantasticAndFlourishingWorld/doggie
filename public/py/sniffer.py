#!/usr/bin/env python
# -*-coding:utf-8 -*-
import sys
import json
import logging
logging.getLogger("scapy.runtime").setLevel(logging.ERROR)
from scapy.all import *
from db import SQLite
from function_flypaper import flypaper

sq = SQLite("PACKET")
keys = ["PROTOCOL", "SPORT", "DPORT", "SMAC", "DMAC", "SIP", "DIP", "STIME", "PLEN"]

def sniff_callback(pkt):
    """Show packet"""
    global keys, sq

    pktObj = flypaper(pkt)
    if not pktObj:
        return None

    stime = str(int(pktObj.get('time', 0) * 1000))
    protocol = "'" + pktObj['protocol'] + "'"
    result = pktObj['result']
    sport = str(result.get('sport', "0"))
    dport = str(result.get('dport', "0"))
    sip = "'" + result.get('IP_src', "") + "'"
    dip = "'" + result.get('IP_dst', "") + "'"
    smac = "'" + result.get('MAC_src', "") + "'"
    dmac = "'" + result.get('MAC_dst', "") + "'"
    pktlen = str(pktObj.get('length', "0"))

    print json.dumps({
        "STIME": stime,
        "PROTOCOL": pktObj['protocol'],
        "SPORT": sport,
        "DPORT": dport,
        "SIP": result.get('IP_src', ""),
        "DIP": result.get('IP_dst', ""),
        "SMAC": result.get('MAC_src', ""),
        "DMAC": result.get('MAC_dst', ""),
        "PKTLEN": pktlen
    })
    sq.insertData(keys, [protocol, sport, dport, smac, dmac, sip, dip, stime, pktlen])

def sniff_index(sniff_prn, bpf):
    """The index of the sniff module"""
    sniff(prn=sniff_callback, store=0, filter=bpf)

if __name__ == '__main__':
    sq.createTable()
    sniff_index(sniff_callback, sys.argv[1] if len(sys.argv) > 1 else None)
    exit(0)
