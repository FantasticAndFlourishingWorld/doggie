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
keys = ["PROTOCOL", "SPORT", "DPORT", "SMAC", "DMAC", "SIP", "DIP", "STIME"]

def sniff_callback(pkt):
    """Show packet"""
    global keys, sniff_count, sq

    pktObj = flypaper(pkt)
    stime = str(pktObj.get('time', "0"))
    protocol = "'" + pktObj['protocol'] + "'"
    result = pktObj['result']
    sport = str(result.get('sport', "0"))
    dport = str(result.get('dport', "0"))
    sip = "'" + result.get('IP_src', "") + "'"
    dip = "'" + result.get('IP_dst', "") + "'"
    smac = "'" + result.get('MAC_src', "") + "'"
    dmac = "'" + result.get('MAC_dst', "") + "'"
    pktlen = str(result.get('len', "0"))

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
    sq.insertData(keys, [protocol, sport, dport, smac, dmac, sip, dip, stime])

def sniff_index(sniff_prn):
    """The index of the sniff module"""
    sniff(prn=sniff_callback, store=0)

if __name__ == '__main__':
    sq.createTable()
    sniff_index(sniff_callback)
    exit(0)
