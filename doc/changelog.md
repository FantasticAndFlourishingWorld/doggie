# 打包时的改动(darwin)
### 解决的问题

  打包后抓包显示no module named ...

* 找到我的pip安装路径: /usr/local/lib/python2.7/site-packages/
* 将scapy文件夹、pcapy.so和dnet.so三个依赖拷贝到/public/py目录下
