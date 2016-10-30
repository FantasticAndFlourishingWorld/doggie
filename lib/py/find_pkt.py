#!/usr/bin/env python
# -*- coding:utf-8 -*-
import sys
from db import SQLite


if __name__ == '__main__':
    sq = SQLite("PACKET", sys.argv[1])
    data = sq.selectData({}, {})
    print json.dumps({
        'data': data
    })
