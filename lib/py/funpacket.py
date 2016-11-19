from scapy.all import *


def sendrst(dst_ip, dst_port, src_port):
    a = IP(dst=dst_ip)
    b = TCP(sport=src_port, dport=dst_port, flags="R")
    try:
        send(a / b)
        return True
    except:
        return False
