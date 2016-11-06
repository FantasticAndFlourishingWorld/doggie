
import re

pattern_a1 = '^10(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){3}$'
pattern_a2 = '^100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[07])(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}$'
pattern_b = '^172\.([1][6-9]|[2]\d|3[01])(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}$'
pattern_c = '^192\.168(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}$'
pattern_ip = '^([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])$'
pattern_169 = '^169\.254\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])$'
pattern_224 = '^2([34]\d|2[4-9]|5[0-5])(\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])){3}$'
pattern_127 = '127(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){3}$'


prog_a1 = re.compile(pattern_a1)
prog_a2 = re.compile(pattern_a2)
prog_b = re.compile(pattern_b)
prog_c = re.compile(pattern_c)
prog_ip = re.compile(pattern_ip)
prog_169 = re.compile(pattern_169)
prog_224 = re.compile(pattern_224)
prog_127 = re.compile(pattern_127)

special_ip = ['0.0.0.0']


def check_ip(ipstr):
    '''
    whether ip
    '''
    result = prog_ip.match(ipstr)
    return result


def check_special(ipstr):
    if ipstr in special_ip:
        return False
    else:
        return True


def check_ipa1(ipstr):
    '''
       Whether the A class of ip
       10.0.0.0-10.255.255.255
       If it is true, it returns the IP
       If it is false, it returns None
    '''
    result = prog_a1.match(ipstr)
    # print result
    return result

def check_ipa2(ipstr):
    '''
        100.64.0.0-100.127.255.255
    '''
    result = prog_a2.match(ipstr)
    # print result
    return result

def check_ipb(ipstr):
    '''
       whether the B class of ip
       172.16.0.0-172.31.255.255
    '''
    result = prog_b.match(ipstr)
    # print result
    return result


def check_ipc(ipstr):
    '''
       whether the C class of ip
       192.168.0.0-192.168.255.255
    '''
    result = prog_c.match(ipstr)
    # print result
    return result


def check_169(ipstr):
    """
       whether 169.254.x.x
    """
    result = prog_169.match(ipstr)
    return result


def check_224(ipstr):
    """
      whether 224.x.x.x - 255.x.x.x
    """
    result = prog_224.match(ipstr)
    return result

def check_127(ipstr):
    """
      whether 127.x.x.x
    """
    result = prog_127.match(ipstr)
    return result

def is_network_ip(ipstr):
    '''
    check whether it is network ip
    '''
    result_ip = check_ip(ipstr)
    if result_ip is None:
        return False

    result_special = check_special(ipstr)
    if result_special is False:
        return False

    result_a1 = check_ipa1(ipstr)
    if result_a1 is not None:
        return False

    result_a2 = check_ipa2(ipstr)
    if result_a2 is not None:
        return False


    result_b = check_ipb(ipstr)
    if result_b is not None:
        return False

    result_c = check_ipc(ipstr)
    if result_c is not None:
        return False

    result_169 = check_169(ipstr)
    if result_169 is not None:
        return False

    result_224 = check_224(ipstr)
    if result_224 is not None:
        return False

    result_127 = check_127(ipstr)
    if result_127 is not None:
        return False

    return True


#testa = check_ipa('100.1.1.1')
#testb = check_ipb('173.16.1.1')
#testc = check_ipc('193.168.1.1')
# test = is_network_ip('224.0.0.251')
# print test
