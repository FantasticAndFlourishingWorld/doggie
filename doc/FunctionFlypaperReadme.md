#1. IPv4
##1.1 TCP
###1.1.1 HTTP
    {"protocol":"HTTP",
     "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
     "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
     "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
     "url":url},
     "http":show_http_packet(fly),                                
     "packet":strfly,
     "time":(time.time()),
     "length":strfly.__sizeof__()}
###1.1.2 other application layer protocol
    {"protocol":"TCP",
     "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
     "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
     "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr},
     "packet":strfly,
     "time":(time.time()),
     "length":strfly.__sizeof__()}
##1.2 UDP
###1.2.1 HTTP
    {"protocol":"HTTP",
     "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
     "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
     "sport":sport,"dport":dport,"UDP_len":UDP_len,"chksum":chksum,
     "url":url},
     "http":show_http_packet(fly),
     "packet":strfly,
     "time":(time.time()),
     "length":strfly.__sizeof__()}
###1.2.2 other application layer protocol
    {"protocol":"UDP",
     "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
     "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst,
     "sport":sport,"dport":dport,"UDP_len":UDP_len,"chksum":chksum},
     "packet":strfly,
     "time":(time.time()),
     "length":strfly.__sizeof__()}
##1.3 other transport layer protocol
   {"protocol":"IPv4",
    "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
    "version":version,"ihl":ihl,"tos":tos,"len":len,"id":id,"flags":flags,"frag":frag,"ttl":ttl,"proto":proto,"IP_chksum":IP_chksum,"IP_src":IP_src,"IP_dst":IP_dst},
    "packet":strfly,
    "time":(time.time()),
    "length":strfly.__sizeof__()}  
#2. IPv6
##2.1 TCP
###2.1.1 HTTP
    {"protocol":"HTTP",
      "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
      "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
      "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr,
      "url":url},
      "http":show_http_packet(fly),
      "packet":strfly,
      "time":(time.time()),
      "length":strfly.__sizeof__()}
###2.1.2 other application layer protocol
    {"protocol":"TCP",
     "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
     "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
     "sport":sport,"dport":dport,"seq":seq,"ack":ack,"dataofs":dataofs,"reserved":reserved,"TCP_flags":TCP_flags,"window":window,"chksum":chksum,"urgptr":urgptr},
     "packet":strfly,
     "time":(time.time()),
     "length":strfly.__sizeof__()}
##2.2 UDP
###2.2.1 HTTP
    {"protocol":"HTTP",
     "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
     "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
     "sport":sport,"dport":dport,"UDP_len":UDP_len,"chksum":chksum,
     "url":url},
     "http":show_http_packet(fly),
     "packet":strfly,
     "time":(time.time()),
     "length":strfly.__sizeof__()}
###2.2.2 other application layer protocol
    {"protocol":"UDP",
     "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
     "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst,
     "sport":sport,"dport":dport,"UDP_len":UDP_len,"chksum":chksum},
     "packet":strfly,
     "time":(time.time()),
     "length":strfly.__sizeof__()}
##2.3 other transport layer protocol
   {"protocol":"IPv6",
    "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
    "version":version,"tc":tc,"fl":fl,"plen":plen,"nh":nh,"hlim":hlim,"IP_src":IP_src,"IP_dst":IP_dst},
    "packet":strfly,
    "time":(time.time()),
    "length":strfly.__sizeof__()}
#3. ARP
  {"protocol":"ARP",
   "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type,
   "hwtype":hwtype,"ptype":ptype,"hwlen":hwlen,"plen": plen,"op":op,"MAC_src":MAC_src,"IP_src":IP_src,"MAC_dst":MAC_dst,"IP_dst":IP_dst},
   "packet":strfly,
   "time":(time.time()),
   "length":strfly.__sizeof__()} 
#4. other network layer protocol
  {"protocol":"ETHERNET",
   "result":{"MAC_dst":MAC_dst,"MAC_src":MAC_src,"type":type},
   "packet":strfly,
   "time":(time.time()),
   "length":strfly.__sizeof__()}  
#BAD_PACKET (Exception)
 {"protocol":"BAD_PACKET",
  "result":{},
  "packet":strfly,
  "time":(time.time()),
  "length":strfly.__sizeof__()}   
