#!/usr/bin/env python
# -*-coding:utf-8 -*-
import os
import sys
import json

ls = os.linesep

def limitHttp():
    """
    limit http requests and responses by updating hosts file, must flush the dns cache!
    """
    flushCmds = []
    if 'darwin' in sys.platform:
        path = '/Private/etc/hosts'
    elif 'win' in sys.platform:
        path = r'C:\Windows\System32\drivers\etc\hosts'
        flushCmds.append('ipconfig /flushdns')
    elif 'linux' in sys.platform:
        path = '/etc/hosts'
        flushCmds.append('/etc/init.d/named restart')
        flushCmds.append('/etc/init.d/nscd restart')
    else:
        print json.dumps({
            'success': False
        })
        exit(1)

    if (sys.argv[1] == 'delete'):
        hosts = open(path, 'r')
        lines = hosts.readlines()
        hosts.close()
        hosts = open(path, 'w')
        url = sys.argv[2]
        for line in lines:
            if not url in line:
                hosts.write(line)
    else:
        hosts = open(path, 'a')
        for url in sys.argv[2:]:
            hosts.write(ls)
            hosts.writelines('127.0.0.1 %s' % url)
            hosts.write(ls)

    hosts.close()

    for cmd in flushCmds:
        os.popen(cmd)

    print json.dumps({
        'success': True
    })

if __name__ == '__main__':
    limitHttp()
    exit(0)
