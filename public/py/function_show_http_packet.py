from scapy.all import *
def show_http_packet(packet):
    temppacket=str(packet)
    if "GET" not in temppacket and "POST"not in temppacket and "HEAD"not in temppacket and "PUT"not in temppacket and "DELETE" not in temppacket and "OPTIONS"not in temppacket and "TRACE" not in temppacket and "CONNECT" not in temppacket:
        #response
        temphttp=str(packet[Raw]).split("\r\n")
        state_line=temphttp[0].split(' ')
        protocol_edition=state_line[0]
        state_code=state_line[1]
        state_code_description=state_line[2]
        
        i=1
        response_head={}
        while len(temphttp[i])>0:
            head_name=temphttp[i].split(':')[0]
            value=temphttp[i].split(':')[1]
            response_head[head_name]=value
            i=i+1
        
        response_body=temphttp[-1]
        return {"protocol_edition":protocol_edition,"state_code":state_code,"state_code_description":state_code_description,
                "response_head":response_head,
                "response_body":response_body}
    else:
        #request
        temphttp=str(packet[Raw]).split("\r\n")
        request_line=temphttp[0].split(' ')
        request_method=request_line[0]
        url=request_line[1]
        protocol_edition=request_line[2]
        i=1
        
        request_head={}
        while len(temphttp[i])>0:
            head_name=temphttp[i].split(':')[0]
            value=temphttp[i].split(':')[1]
            request_head[head_name]=value
            i=i+1
        
        request_body=temphttp[-1]
        return {"request_method":request_method,"url":url,"protocol_edition":protocol_edition,
               "request_head":request_head,
               "request_body":request_body}   