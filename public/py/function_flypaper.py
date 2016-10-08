#! /usr/bin/env python
#-*- encoding: utf-8 -*-
from scapy.all import *
import time
def flypaper(fly):
    #<ether layer>
    MAC_dst=fly[Ether].dst
    MAC_src=fly[Ether].src
    type=fly[Ether].type
    ##<network layer>
    if type==0x0800 :
        version=fly[IP].version
        ihl=fly[IP].ihl
        tos=fly[IP].tos
        len=fly[IP].len
        id=fly[IP].id
        flags=fly[IP].flags
        frag=fly[IP].frag
        ttl=fly[IP].ttl
        proto=fly[IP].proto
        IP_chksum=fly[IP].chksum
        IP_src=fly[IP].src
        IP_dst=fly[IP].dst   
        ###<transport layer>
        if proto==0x06:
            sport=fly[TCP].sport
            dport=fly[TCP].dport
            seq=fly[TCP].seq
            ack=fly[TCP].ack
            dataofs=fly[TCP].dataofs
            reserved=fly[TCP].reserved
            TCP_flags=fly[TCP].flags
            window=fly[TCP].window
            chksum=fly[TCP].chksum
            urgptr=fly[TCP].urgptr# (16)r>
            tempfly=str(fly)
            if "HTTP" in tempfly:
                application_layer_protocol="HTTP"
                if "GET" not in tempfly and "POST"not in tempfly and "HEAD"not in tempfly and "PUT"not in tempfly and "DELETE" not in tempfly and "OPTIONS"not in tempfly and "TRACE" not in tempfly and "CONNECT" not in tempfly:
                    url="" 
                    print "IPv4 TCP HTTP"                 
                    return {"protocol":"HTTP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                            "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                            "application_layer_protocol":application_layer_protocol,"url":url},
                            "packet":str(fly),
                            "time":(time.time())}
                else:
                    temphttp=str(fly[Raw])
                    url=(temphttp.split(' '))[2]
                    print "IPv4 TCP HTTP"
                    return {"protocol":"HTTP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                            "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                            "application_layer_protocol":application_layer_protocol,"url":url},
                            "packet":str(fly),
                            "time":(time.time())}                          
            else :
                application_layer_protocol="NOT HTTP" 
                print "IPv4 TCP NOT HTTP"               
                return {"protocol":"TCP",
                        "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                        "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                        "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                        "application_layer_protocol":application_layer_protocol},
                        "packet":str(fly),
                        "time":(time.time())}
        elif proto==0x11:
            sport=fly[UDP].sport
            dport=fly[UDP].dport
            len=fly[UDP].len
            chksum=fly[UDP].chksum
             ####<application layer>
            tempfly=str(fly)            
            if "HTTP" in tempfly:
                application_layer_protocol="HTTP"
                if "GET" not in tempfly and "POST"not in tempfly and "HEAD"not in tempfly and "PUT"not in tempfly and "DELETE" not in tempfly and "OPTIONS"not in tempfly and "TRACE" not in tempfly and "CONNECT" not in tempfly:
                    url=""
                    print "IPv4 UDP HTTP"
                    return {"protocol":"HTTP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                            "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                            "application_layer_protocol":application_layer_protocol,"url":url},
                            "packet":str(fly),
                            "time":(time.time())}
                else:
                    temphttp=str(fly[Raw])
                    url=(temphttp.split(' '))[2]
                    print "IPv4 UDP HTTP"
                    return {"protocol":"HTTP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                            "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                            "application_layer_protocol":application_layer_protocol,"url":url},
                            "packet":str(fly),
                            "time":(time.time())}                  
            else :
                application_layer_protocol="NOT HTTP"
                print "IPv4 UDP NOT HTTP"
                return {"protocol":"UDP",
                        "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                        "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                        "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                        "application_layer_protocol":application_layer_protocol},
                        "packet":str(fly),
                        "time":(time.time())}
        else:
            transport_layer_protocol="NOT TCP,UDP"
            print "IPv4 NOT TCP,UDP"
            return {"protocol":"IPv4",
                    "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                    "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                    "transport_layer_protocol":transport_layer_protocol},
                    "packet":str(fly),
                    "time":(time.time())
                    }    
    elif type==0x86dd :
        version=fly[IPv6].version
        tc=fly[IPv6].tc
        fl=fly[IPv6].fl
        plen=fly[IPv6].plen
        nh=fly[IPv6].nh
        hlim=fly[IPv6].hlim
        IPv6_src=fly[IPv6].src
        IPv6_dst=fly[IPv6].dst
        ###<transport layer>
        if nh==0x06:
            sport=fly[TCP].sport
            dport=fly[TCP].dport
            seq=fly[TCP].seq
            ack=fly[TCP].ack
            dataofs=fly[TCP].dataofs
            reserved=fly[TCP].reserved
            TCP_flags=fly[TCP].flags
            window=fly[TCP].window
            chksum=fly[TCP].chksum
            urgptr=fly[TCP].urgptr
             ####<application layer>
            tempfly=str(fly)
            if "HTTP" in tempfly:
                application_layer_protocol="HTTP"
                if "GET" not in tempfly and "POST"not in tempfly and "HEAD"not in tempfly and "PUT"not in tempfly and "DELETE" not in tempfly and "OPTIONS"not in tempfly and "TRACE" not in tempfly and "CONNECT" not in tempfly:
                    url=""
                    print "IPv6 TCP HTTP"
                    return {"protocol":"HTTP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IPv6_src":IPv6_src,"IPv6_dst":IPv6_dst,
                            "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                            "application_layer_protocol":application_layer_protocol,"url":url},
                            "packet":str(fly),
                            "time":(time.time())}
                else:
                    temphttp=str(fly[Raw])
                    url=(temphttp.split(' '))[2]
                    print "IPv6 TCP HTTP"     
                    return {"protocol":"HTTP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IPv6_src":IPv6_src,"IPv6_dst":IPv6_dst,
                            "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                            "application_layer_protocol":application_layer_protocol,"url":url},
                            "packet":str(fly),
                            "time":(time.time())}  
            else :
                application_layer_protocol="NOT HTTP"
                print "IPv6 TCP NOT HTTP"
                return {"protocol":"TCP",
                        "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                        "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IPv6_src":IPv6_src,"IPv6_dst":IPv6_dst,
                        "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                        "application_layer_protocol":application_layer_protocol,},
                        "packet":str(fly),
                        "time":(time.time())}
        elif nh==0x11:
            sport=fly[UDP].sport
            dport=fly[UDP].dport
            len=fly[UDP].len
            chksum=fly[UDP].chksum
             ####<application layer>
            tempfly=str(fly)
            if "HTTP" in tempfly:
                application_layer_protocol="HTTP"
                if "GET" not in tempfly and "POST"not in tempfly and "HEAD"not in tempfly and "PUT"not in tempfly and "DELETE" not in tempfly and "OPTIONS"not in tempfly and "TRACE" not in tempfly and "CONNECT" not in tempfly:
                    url=""
                    print "IPv6 UDP HTTP"
                    return {"protocol":"HTTP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IPv6_src":IPv6_src,"IPv6_dst":IPv6_dst,
                            "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                            "application_layer_protocol":application_layer_protocol,"url":url},
                            "packet":str(fly),
                            "time":(time.time())}
                else:
                    temphttp=str(fly[Raw])
                    url=(temphttp.split(' '))[2]  
                    print "IPv6 UDP HTTP"
                    return {"protocol":"HTTP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IPv6_src":IPv6_src,"IPv6_dst":IPv6_dst,
                            "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                            "application_layer_protocol":application_layer_protocol,"url":url},
                            "packet":str(fly),
                            "time":(time.time())}
            else :
                application_layer_protocol="NOT HTTP"
                print "IPv6 UDP NOT HTTP"
                return {"protocol":"UDP",
                        "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                        "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IPv6_src":IPv6_src,"IPv6_dst":IPv6_dst,
                        "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                        "application_layer_protocol":application_layer_protocol},
                        "packet":str(fly),
                        "time":(time.time())}
        else:
            transport_layer_protocol="NOT TCP,UDP"
            print "IPv6 NOT TCP,UD"
            return {"protocol":"IPv6",
                    "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                    "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IPv6_src":IPv6_src,"IPv6_dst":IPv6_dst,
                    "transport_layer_protocol":transport_layer_protocol},
                    "packet":str(fly),
                    "time":(time.time())}
    elif type==0x0806 :
        hwtype=fly[ARP].hwtype
        ptype=fly[ARP].ptype
        hwlen=fly[ARP].hwlen
        plen=fly[ARP].plen
        op=fly[ARP].op
        hwsrc=fly[ARP].hwsrc
        psrc=fly[ARP].psrc
        hwdst=fly[ARP].hwdst
        pdst=fly[ARP].pdst
        print "ARP"
        return {"protocol":"ARP",
                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                "hwtype":hwtype,"ptype":ptype,"hwlen":hwlen,"plen": plen,"op":op,"hwsrc":hwsrc,"psrc":psrc,"hwdst":hwdst,"pdst":pdst},
                "packet":str(fly),
                "time":(time.time())}   
    else:
        network_layer_protocol="NOT IPv4,IPv6,ARP"
        print  "NOT IPv4,IPv6,ARP"
        return {"protocol":"ETHERNET",
                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type},
                "packet":str(fly),
                "time":(time.time())}                 
    ####</application layer>
    ###</transport layer>
    ##</network layer>
    #</ether layer>