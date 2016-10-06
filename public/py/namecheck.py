#!/usr/bin/env python
#-*- coding: utf-8 -*-

import json


fin = open('../../settings.json', 'r')
all_file = json.load(fin)
fin.close()

# print all_file

keywords = all_file['bpfKeywords']
# print keywords


def namecheck(name):
    """
                    flag=1，则无冲突
                    flag=0，则有冲突
    """

    if name in keywords:
        flag = 0
        # print "youchongtu"
    else:
        flag = 1
        print "wuchongtu"

    return flag

#name = "yan"
#result = namecheck(name)
# print result
