#!/usr/bin/env python
#-*- coding: utf-8 -*-

import json

fin = open('../../settings.json', 'r')
all_file = json.load(fin)
fin.close()


bpflist = all_file['bpf']
bpflist_len = len(bpflist)
keywords = all_file['bpfKeywords']

new_keywords = []

for i in range(0, bpflist_len):
    new_keywords.append(bpflist[i]["name"])

new_keywords.extend(keywords)
# print new_keywords


def word_hint(str):
    """
        Helpful hints of characters
    """

    str_split = str.split(" ")
    # print str_split
    last_str = str_split[-1]
    # print last_str
    result2 = []
    result = {"correct": True, "hint": result2}

    for i in range(0, len(new_keywords)):

        if last_str in new_keywords[i]:

            result2.append(new_keywords[i])

    if result2 == []:
        # print "false"
        result["correct"] = False

    # print result
    return result


#word_hint("tcp udp yy")
#word_hint("tcp udp yan")
#word_hint("tcp udp d")
#word_hint("tcp udp l")
