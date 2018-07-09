###HTTP的三次握手

####TCP
话说TCP就是传说中的`传输控制协议`，是主机对主机层的传输控制协议，提供可靠的连接服务，采用三次握手确认建立一个连接；

`位码`即TCP标志位,有6种标示:`SYN`(synchronous建立联机) `ACK`(acknowledgement 确认) `PSH`(push传送) `FIN`(finish结束) `RST`(reset重置) `URG`(urgent紧急)`Sequence number`(顺序号码) `Acknowledge number`(确认号码)

###三次握手

* ####第一次握手
    主机A发送位码为syn＝n,随机产生seq number=1234567的数据包到服务器，主机B由SYN=n知道，A要求建立联机；

* ####第二次握手：
    主机B收到请求后要确认联机信息，向A发送syn=m,ack=n+1,随机产生seq=7654321的包

* ####第三次握手：
    主机A收到后检查ack number是否正确，即第一次发送的n+1，若正确，主机A会再发送ack=m+1，主机B收到后确认seq值与ack=m则连接建立成功。

* ####完成三次握手，主机A与主机B开始传送数据。


client           server
|                     |
|     SYN = n         |
|  -----------------> |
|                     |
|     ACK = n+1       |
|  <----------------- |
|     SYN = m         |
|                     |
|  -----------------> |
|     ACK = m+1       |

is DONE
