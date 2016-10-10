#! /usr/bin/env python
#-*- encoding: utf-8 -*-
from scapy.all import *
import time
def flypaper(fly):
    try:
        #<ether layer>    
        MAC_dst=fly[Ether].dst#destination MAC (48)
        MAC_src=fly[Ether].src#source MAC (48)
        type=fly[Ether].type#protocol type of network layer (16)
        ##<network layer>
        if type==0x0800 :# IP(IPv4) protocol 2048
            version=fly[IP].version#version of IP protocol, usually is 4L(IPv4) (4)
            ihl=fly[IP].ihl#length of IP head (4)
            tos=fly[IP].tos# (8)
            len=fly[IP].len# (16)
            id=fly[IP].id# (16)
            flags=fly[IP].flags# (3)
            frag=fly[IP].frag# (13)
            ttl=fly[IP].ttl#time to live (8) 
            proto=fly[IP].proto#protocol of transport layer (8)
            IP_chksum=fly[IP].chksum# (16)
            IP_src=fly[IP].src# (32)
            IP_dst=fly[IP].dst# (32)    
            ###<transport layer>
            if proto==0x06:
                sport=fly[TCP].sport# (16)
                dport=fly[TCP].dport# (16)
                seq=fly[TCP].seq# (32)
                ack=fly[TCP].ack# (32)
                dataofs=fly[TCP].dataofs# (4)
                reserved=fly[TCP].reserved#reserved for fruture,now must be zero (6)
                TCP_flags=fly[TCP].flags# (6)
                window=fly[TCP].window# (16)
                chksum=fly[TCP].chksum# (16)
                urgptr=fly[TCP].urgptr# (16)
                ####<application layer>
                tempfly=str(fly)
                if "HTTP" in tempfly:
                    if "GET" not in tempfly and "POST"not in tempfly and "HEAD"not in tempfly and "PUT"not in tempfly and "DELETE" not in tempfly and "OPTIONS"not in tempfly and "TRACE" not in tempfly and "CONNECT" not in tempfly:
                        url="" 
                        #print "IPv4 TCP HTTP"   
                        strfly=str(fly)              
                        return {"protocol":"HTTP",
                                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                                "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                                "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                                "url":url},
                                "packet":strfly,
                                "time":(time.time()),
                                "length":strfly.__sizeof__()}
                    else:
                        temphttp=str(fly[Raw])
                        url=(temphttp.split(' '))[1]
                        #print "IPv4 TCP HTTP"
                        strfly=str(fly)      
                        return {"protocol":"HTTP",
                                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                                "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                                "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                                "url":url},
                                "packet":strfly,
                                "time":(time.time()),
                                "length":strfly.__sizeof__()}                          
                else :               
                    #print "IPv4 TCP NOT HTTP"
                    strfly=str(fly)               
                    return {"protocol":"TCP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                            "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr},
                            "packet":strfly,
                            "time":(time.time()),
                            "length":strfly.__sizeof__()}
            elif proto==0x11:
                sport=fly[UDP].sport# (16)
                dport=fly[UDP].dport# (16)
                len=fly[UDP].len# (16)
                chksum=fly[UDP].chksum# (16)
                ####<application layer>
                tempfly=str(fly)            
                if "HTTP" in tempfly:
                    if "GET" not in tempfly and "POST"not in tempfly and "HEAD"not in tempfly and "PUT"not in tempfly and "DELETE" not in tempfly and "OPTIONS"not in tempfly and "TRACE" not in tempfly and "CONNECT" not in tempfly:
                        url=""
                        #print "IPv4 UDP HTTP"
                        strfly=str(fly)
                        return {"protocol":"HTTP",
                                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                                "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                                "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                                "url":url},
                                "packet":strfly,
                                "time":(time.time()),
                                "length":strfly.__sizeof__()}
                    else:
                        temphttp=str(fly[Raw])
                        url=(temphttp.split(' '))[1]
                        #print "IPv4 UDP HTTP"
                        strfly=str(fly)      
                        return {"protocol":"HTTP",
                                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                                "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                                "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                                "url":url},
                                "packet":strfly,
                                "time":(time.time()),
                                "length":strfly.__sizeof__()}                  
                else :
                    #print "IPv4 UDP NOT HTTP"
                    strfly=str(fly)      
                    return {"protocol":"UDP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
                            "sport":sport,"dport":dport,"len":len,"chksum":chksum},
                            "packet":strfly,
                            "time":(time.time()),
                            "length":strfly.__sizeof__()}
            else:#other transport layer protocol
                #print "IPv4 NOT TCP,UDP"
                strfly=str(fly)      
                return {"protocol":"IPv4",
                        "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                        "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst},
                        "packet":strfly,
                        "time":(time.time()),
                        "length":strfly.__sizeof__()}    
        elif type==0x86dd :#IPv6  protocol 2269
            version=fly[IPv6].version#version of IP protocol,for IPv6 protocol is six (4)
            tc=fly[IPv6].tc#traffice class,default value is zero (8)
            fl=fly[IPv6].fl#flow label,ususlly is zero (20)
            plen=fly[IPv6].plen#payload length (16)
            nh=fly[IPv6].nh#next header,protocol of transport layer (8)
            hlim=fly[IPv6].hlim#hop limit (8)
            IP_src=fly[IPv6].src# (128)
            IP_dst=fly[IPv6].dst# (128)
            ###<transport layer>
            if nh==0x06:
                sport=fly[TCP].sport# (16)
                dport=fly[TCP].dport# (16)
                seq=fly[TCP].seq# (32)
                ack=fly[TCP].ack# (32)
                dataofs=fly[TCP].dataofs# (4)
                reserved=fly[TCP].reserved#reserved for fruture,now must be zero (6)
                TCP_flags=fly[TCP].flags# (6)
                window=fly[TCP].window# (16)
                chksum=fly[TCP].chksum# (16)
                urgptr=fly[TCP].urgptr# (16)
                ####<application layer>
                tempfly=str(fly)
                if "HTTP" in tempfly:
                    if "GET" not in tempfly and "POST"not in tempfly and "HEAD"not in tempfly and "PUT"not in tempfly and "DELETE" not in tempfly and "OPTIONS"not in tempfly and "TRACE" not in tempfly and "CONNECT" not in tempfly:
                        url=""
                        #print "IPv6 TCP HTTP"
                        strfly=str(fly)      
                        return {"protocol":"HTTP",
                                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                                "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
                                "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                                "url":url},
                                "packet":strfly,
                                "time":(time.time()),
                                "length":strfly.__sizeof__()}
                    else:
                        temphttp=str(fly[Raw])
                        url=(temphttp.split(' '))[2]
                        #print "IPv6 TCP HTTP"     
                        strfly=str(fly)      
                        return {"protocol":"HTTP",
                                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                                "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
                                "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
                                "url":url},
                                "packet":strfly,
                                "time":(time.time()),
                                "length":strfly.__sizeof__()}  
                else :
                    #print "IPv6 TCP NOT HTTP"
                    strfly=str(fly)      
                    return {"protocol":"TCP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
                            "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr},
                            "packet":strfly,
                            "time":(time.time()),
                            "length":strfly.__sizeof__()}
            elif nh==0x11:
                sport=fly[UDP].sport# (16)
                dport=fly[UDP].dport# (16)
                len=fly[UDP].len# (16)
                chksum=fly[UDP].chksum# (16)
                ####<application layer>
                tempfly=str(fly)
                if "HTTP" in tempfly:
                    if "GET" not in tempfly and "POST"not in tempfly and "HEAD"not in tempfly and "PUT"not in tempfly and "DELETE" not in tempfly and "OPTIONS"not in tempfly and "TRACE" not in tempfly and "CONNECT" not in tempfly:
                        url=""
                        #print "IPv6 UDP HTTP"
                        strfly=str(fly)      
                        return {"protocol":"HTTP",
                                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                                "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
                                "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                                "url":url},
                                "packet":strfly,
                                "time":(time.time()),
                                "length":strfly.__sizeof__()}
                    else:
                        temphttp=str(fly[Raw])
                        url=(temphttp.split(' '))[2]  
                        #print "IPv6 UDP HTTP"
                        strfly=str(fly)      
                        return {"protocol":"HTTP",
                                "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                                "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
                                "sport":sport,"dport":dport,"len":len,"chksum":chksum,
                                "url":url},
                                "packet":strfly,
                                "time":(time.time()),
                                "length":strfly.__sizeof__()}
                else :
                    #print "IPv6 UDP NOT HTTP"
                    strfly=str(fly)      
                    return {"protocol":"UDP",
                            "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                            "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
                            "sport":sport,"dport":dport,"len":len,"chksum":chksum},
                            "packet":strfly,
                            "time":(time.time()),
                            "length":strfly.__sizeof__()}
            else:#other transport layer protocol
                #print "IPv6 NOT TCP,UD"
                strfly=str(fly)      
                return {"protocol":"IPv6",
                        "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                        "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst},
                        "packet":strfly,
                        "time":(time.time()),
                        "length":strfly.__sizeof__()}
        elif type==0x0806 :#ARP protocol
            hwtype=fly[ARP].hwtype# (16)
            ptype=fly[ARP].ptype#for IP procotol is 0x0800 (16)
            hwlen=fly[ARP].hwlen# (8)
            plen=fly[ARP].plen# (8)
            op=fly[ARP].op# (16)
            hwsrc=fly[ARP].hwsrc# (6)
            psrc=fly[ARP].psrc# (4)
            hwdst=fly[ARP].hwdst# (6)
            pdst=fly[ARP].pdst# (4);
            #print "ARP"
            strfly=str(fly)      
            return {"protocol":"ARP",
                    "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
                    "hwtype":hwtype,"ptype":ptype,"hwlen":hwlen,"plen": plen,"op":op,"hwsrc":hwsrc,"psrc":psrc,"hwdst":hwdst,"pdst":pdst},
                    "packet":strfly,
                    "time":(time.time()),
                    "length":strfly.__sizeof__()}   
        else:#other network layer protocol
            #print  "NOT IPv4,IPv6,ARP"
            strfly=str(fly)      
            return {"protocol":"ETHERNET",
                    "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type},
                    "packet":strfly,
                    "time":(time.time()),
                    "length":strfly.__sizeof__()}                 
        ####</application layer>
        ###</transport layer>
        ##</network layer>
        #</ether layer>
    except :
        strfly=str(fly)
        return {"protocol":"BAD_PACKET",
                "result":{},
                "packet":strfly,
                "time":(time.time()),
                "length":strfly.__sizeof__()}     
