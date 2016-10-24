#!/usr/bin/env python
#-*- coding: utf-8 -*-

import json

fin = open('../../settings.json', 'r')
all_file = json.load(fin)
fin.close()


bpflist = all_file['bpf']
# print bpflist

bpflist_len = len(bpflist)


def nametobpf(name):
    """
      将过滤器名转换为相应的pbf表达式
      若无相应name，则返回-1
    """

    bpf = "-1"
    for i in range(0, bpflist_len):
        # print i
        # print bpflist[i]["name"]
        # print bpflist[i]["value"]

        if name == bpflist[i]["name"]:
            bpf = bpflist[i]["value"]

    return bpf


#name = "yanran"
#test = nametobpf(name)
# print test
