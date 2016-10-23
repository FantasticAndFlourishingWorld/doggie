#<ether layer>链路层

 * MAC_dst:目的主机的mac地址。
 * MAC_src:源主机的mac地址。
 * type:指定网络层所用的协议类型，通常是IP协议，0x0800。
 
#<network layer>网络层
##IPv4

 * version:版本，记录网络层协议属于哪一个版本，如IPv4或IPv6。
 * ihl:首部长度，指明IP头部长度，单位是字，也就是两个字节。该域的值最小为5，就是标准的头部长度；最大为15，表明有扩展部分。
 * tos:服务类型，用来区分不同服务的需要。
 * len: 数据报总长，包含IP头部的数据报的总长度。注意，这里不包括链路层的头部，目前最大值是65535字节。 
 * id: 分组ID，这个域的作用是当一个大的数据包被拆分时，拆分成的小的数据包的这个域都是一样的。 
 * flags: 标记，共三个bit，第一个未使用；第二个DF(Don’t Fragment)，设置成1表示这个数据包不能被分割，这个是针对路由器的一条指令；第三个MF(MoreFragment)，如果一个数据包被分割了，那么除了最后一个分段以外的所有分段都必须设置为1，用来表示后面还有更多的分段没有到达，最后一个设置为0，用来表示分割的段全部到达。 
 * frag: 段偏移量，这个域有13bit，也就是每一个数据报最多有8192个分段。每一个分段的长度必须是8字节的倍数，也就是说8字节是分段的基本单位，当然分组的最后一个段不做限制。这样最大的数据报长度为8*8192=65536字节，比目前限制的最大数据报长度还多1，能够满足对网络中所有数据报传送的需求。 
 * ttl: 生存时间，这是一个生存期计数器，最大为255s，但是实际上使用的时候用作跳数计数器，当值为0时数据报被丢弃，用来避免一个数据报过久的逗留在网络中。 
 * proto:传输层协议类型。
 * IP_chksum: 首部校验和，IP头部的校验和 。
 * IP_src: 源IP地址，数据包来源主机的IP地址 。
 * IP_dst: 目的IP地址，数据包目的主机的IP地址 。
 
##IPv6

 * version:版本，长度为4位，对于IPv6，该字段必须为6。
 * tc:类别，长度为8位，指明为该包提供了某种“区分服务”。
 * fl:流标签。长度为20位，用于标识属于同一业务流的包。
 * plen:净荷长度，长度为16位，其中包括包净荷的字节长度，即IPv6头后的包中包含的字节数。这意味着在计算净荷长度时包含了IPv6扩展头的长度。
 * nh:传输层协议类型。
 * hlim:跳极限。长度为8位。每当一个节点对包进行一次转发之后，这个字段就会被减1。假如该字段达到0，这个包就将被丢弃。IPv4中有一个具有类似功能的生存期字段，但与IPv4不同，人们不愿意在IPv6中由协议定义一个关于包生存时间的上限。这意味着对过期包进行超时判定的功能可以由高层协议完成。
 * IPv6_src:源地址，长度为128位，指出了IPv6包的发送方地址。
 * IPv6_dst:目的地址，长度为128位，指出了IPv6包的接收方地址。
 
##ARP

 * hwtype:硬件类型，指明了发送方想知道的硬件接口类型，以太网的值为1。
 * ptype:上层协议类型，指明了发送方提供的高层协议类型，IP为0800（16进制）。
 * hwlen:硬件地址长度和协议长度，指明了硬件地址和高层协议地址的长度，这样ARP报文就可以在任意硬件和任意协议的网络中使用。
 * plen:IP地址长度  。
 * op:操作类型，用来表示这个报文的类型，ARP请求为1，ARP响应为2，RARP请求为3，RARP响应为4。
 * hwsrc:发送方MAC。         
 * psrc:发送方IP。
 * hwdst:接收方MAC。
 * pdst:接收方IP。
 
##other network layer protocol
#<transport layer>传输层
##TCP

 * sport:源端口。
 * dport:目的端口。
 * seq:序号。
 * ack:确认号。
 * dataofs:首部长度。
 * reserved:保留，64bits未使用的域。
 * TCP_flags:标识。
 * window:窗口大小。
 * chksum:校验和。
 * urgptr:紧急指针。
 
##UDP

 * sport:源端口号。
 * dport:目的端口号。
 * len:长度。
 * chksum:校验和。
 
##other transport layer protocol
#<application layer>应用层
##HTTP

###response

 * url:统一资源定位符，在HTTP请求包中不为空，在HTTP响应包中为空字符串。
 * protocol_edition:协议版本
 * state_code:状态码
 * state_code_description:状态码描述
 * response_head:响应头部，是“头部字段名称:值” 形式的字典
 * response_body:响应包体

###request

  * url:统一资源定位符，在HTTP请求包中不为空，在HTTP响应包中为空字符串。
  * request_method":请求方法
  * protocol_edition:协议版本
  * request_head:请求头部，是“头部字段名称:值” 形式的字典
  * request_body:请求包体

## other application layer protocol
