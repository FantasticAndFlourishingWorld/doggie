#!/usr/bin/env python
# -*- coding:utf-8 -*-
import sys
import json
from db import SQLite


if __name__ == '__main__':
    sq = SQLite("PACKET", sys.argv[1])
    sq.createMain()
    sq.createEther()
    sq.createNetwork()
    sq.createTransport()
    sq.createApplication()
    data = sq.selectData({}, {})
    # print json.dumps({
    #     'data': data
    # })
    print json.dumps({
        'message': 'hehe'
    })
